import { Server as SocketIOServer, Socket } from "socket.io";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { canUserSearch } from "@/lib/user-utils";
import {
  addToQueue,
  removeFromQueue,
  findMatch,
  createMatch,
  getQueuePosition,
  queueUsersMap,
} from "./matching";
import { QueueUser } from "./types";

// Store socket connections by userId
const userSockets = new Map<string, Set<string>>();

export function setupSocketHandlers(io: SocketIOServer) {
  io.use(async (socket, next) => {
    // Authenticate socket connection
    // For now, we'll trust the userId from auth (in production, verify session token)
    const userId = socket.handshake.auth?.userId;
    if (!userId) {
      return next(new Error("Authentication error: userId required"));
    }
    next();
  });

  io.on("connection", async (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Get user from session (you'll need to pass userId in auth)
    const userId = socket.handshake.auth?.userId;
    if (!userId) {
      socket.disconnect();
      return;
    }

    // Track socket for this user
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)!.add(socket.id);

    // Handle join queue
    socket.on("join-queue", async (data: { sessionId: string; mode: "VIDEO" | "TEXT" }) => {
      try {
        const { sessionId, mode } = data;

        // Check if user can search (not blocked and flag count < 5)
        const searchCheck = await canUserSearch(userId);
        if (!searchCheck.canSearch) {
          socket.emit("error", {
            message: searchCheck.reason || "You cannot start a search at this time",
            flagCount: searchCheck.flagCount,
            isBlocked: searchCheck.isBlocked,
          });
          return;
        }

        // Get user data
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !user.onboarded) {
          socket.emit("error", { message: "User not onboarded" });
          return;
        }

        // Get session to check matchedUserIds
        const session = await (prisma as any).userSession.findFirst({
          where: {
            userId,
            sessionId,
            isActive: true,
          },
        });

        if (!session) {
          socket.emit("error", { message: "Session not found" });
          return;
        }

        // Create queue user
        const queueUser: QueueUser = {
          userId,
          sessionId,
          mode,
          topics: user.topics || [],
          seniority: user.seniority || null,
          matchedUserIds: session.matchedUserIds || [],
          joinedAt: new Date(),
          socketId: socket.id,
        };

        // Add to queue
        addToQueue(queueUser);

        // Update activity status
        await (prisma as any).userActivity.upsert({
          where: {
            id: `${userId}-latest`,
          },
          create: {
            id: `${userId}-${Date.now()}`,
            userId,
            status: "SEARCHING",
            mode,
            lastSeen: new Date(),
          },
          update: {
            status: "SEARCHING",
            mode,
            lastSeen: new Date(),
          },
        });

        socket.emit("queue-joined", {
          queuePosition: getQueuePosition(userId, socket.id),
        });

        // Try to find a match immediately
        tryMatch(userId, socket.id, io);
      } catch (error: any) {
        console.error("Error joining queue:", error);
        socket.emit("error", { message: error.message || "Failed to join queue" });
      }
    });

    // Handle leave queue
    socket.on("leave-queue", async () => {
      try {
        removeFromQueue(userId, socket.id);

        // Update activity status
        const existingActivity = await (prisma as any).userActivity.findFirst({
          where: { userId },
          orderBy: { lastSeen: "desc" },
        });

        if (existingActivity) {
          await (prisma as any).userActivity.update({
            where: { id: existingActivity.id },
            data: {
              status: "ONLINE",
              mode: null,
              lastSeen: new Date(),
            },
          });
        }

        socket.emit("queue-left");
      } catch (error: any) {
        console.error("Error leaving queue:", error);
        socket.emit("error", { message: error.message || "Failed to leave queue" });
      }
    });

    // Handle call started (both users joined)
    socket.on("call-started", async (data: { matchId: string }) => {
      try {
        const { matchId } = data;

        const match = await (prisma as any).match.findUnique({
          where: { id: matchId },
        });

        if (!match) {
          socket.emit("error", { message: "Match not found" });
          return;
        }

        // Verify user is part of this match
        if (match.user1Id !== userId && match.user2Id !== userId) {
          socket.emit("error", { message: "Not authorized" });
          return;
        }

        // Update match status
        const isUser1 = match.user1Id === userId;
        const updateData: any = {
          status: "ACTIVE",
        };

        if (isUser1 && !match.user1JoinedAt) {
          updateData.user1JoinedAt = new Date();
          if (!match.startedAt) {
            updateData.startedAt = new Date();
          }
        } else if (!isUser1 && !match.user2JoinedAt) {
          updateData.user2JoinedAt = new Date();
          if (!match.startedAt) {
            updateData.startedAt = new Date();
          }
        }

        await (prisma as any).match.update({
          where: { id: matchId },
          data: updateData,
        });

        // Update activity status
        await (prisma as any).userActivity.updateMany({
          where: { userId },
          data: {
            status: "IN_CALL",
            lastSeen: new Date(),
          },
        });

        // Notify the other user
        const otherUserId = isUser1 ? match.user2Id : match.user1Id;
        const otherUserSockets = userSockets.get(otherUserId);
        if (otherUserSockets) {
          otherUserSockets.forEach((sockId) => {
            io.to(sockId).emit("call-started", { matchId });
          });
        }
      } catch (error: any) {
        console.error("Error starting call:", error);
        socket.emit("error", { message: error.message || "Failed to start call" });
      }
    });

    // Handle call ended
    socket.on("call-ended", async (data: { matchId: string; reason?: "ended" | "skipped" }) => {
      try {
        const { matchId, reason = "ended" } = data;

        const match = await (prisma as any).match.findUnique({
          where: { id: matchId },
        });

        if (!match) {
          return;
        }

        // Verify user is part of this match
        if (match.user1Id !== userId && match.user2Id !== userId) {
          return;
        }

        // Calculate duration
        let duration: number | null = null;
        if (match.startedAt) {
          duration = Math.floor((Date.now() - new Date(match.startedAt).getTime()) / 1000);
        }

        // Update match
        await (prisma as any).match.update({
          where: { id: matchId },
          data: {
            status: reason === "skipped" ? "SKIPPED" : "ENDED",
            endedAt: new Date(),
            duration,
          },
        });

        // Update activity status
        await (prisma as any).userActivity.updateMany({
          where: { userId },
          data: {
            status: "ONLINE",
            mode: null,
            lastSeen: new Date(),
          },
        });

        // Notify the other user
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const otherUserSockets = userSockets.get(otherUserId);
        if (otherUserSockets) {
          otherUserSockets.forEach((sockId) => {
            io.to(sockId).emit("call-ended", { matchId, reason });
          });
        }
      } catch (error: any) {
        console.error("Error ending call:", error);
      }
    });

    // Handle WebRTC signaling
    socket.on("webrtc-offer", (data: { matchId: string; offer: any }) => {
      const { matchId, offer } = data;
      // Forward offer to the other user
      socket.broadcast.to(`match-${matchId}`).emit("webrtc-offer", { offer });
    });

    socket.on("webrtc-answer", (data: { matchId: string; answer: any }) => {
      const { matchId, answer } = data;
      // Forward answer to the other user
      socket.broadcast.to(`match-${matchId}`).emit("webrtc-answer", { answer });
    });

    socket.on("webrtc-ice-candidate", (data: { matchId: string; candidate: any }) => {
      const { matchId, candidate } = data;
      // Forward ICE candidate to the other user
      socket.broadcast.to(`match-${matchId}`).emit("webrtc-ice-candidate", { candidate });
    });

    // Handle location sharing
    socket.on("share-location", async (data: { matchId: string; location: { latitude: number; longitude: number; address: string } }) => {
      try {
        const { matchId, location } = data;

        // Verify match exists and user is part of it
        const match = await (prisma as any).match.findUnique({
          where: { id: matchId },
        });

        if (!match) {
          socket.emit("error", { message: "Match not found" });
          return;
        }

        // Verify user is part of this match
        if (match.user1Id !== userId && match.user2Id !== userId) {
          socket.emit("error", { message: "Not authorized" });
          return;
        }

        // Determine which user this is (user1 or user2)
        const isUser1 = match.user1Id === userId;
        
        // Save location to database
        const updateData: any = {};
        if (isUser1) {
          updateData.user1Latitude = location.latitude;
          updateData.user1Longitude = location.longitude;
          updateData.user1Address = location.address;
        } else {
          updateData.user2Latitude = location.latitude;
          updateData.user2Longitude = location.longitude;
          updateData.user2Address = location.address;
        }

        await (prisma as any).match.update({
          where: { id: matchId },
          data: updateData,
        });

        console.log(`Location saved to database for match ${matchId}, user: ${isUser1 ? 'user1' : 'user2'}`);

        // Get the other user's socket IDs
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const otherUserSockets = userSockets.get(otherUserId);
        
        if (otherUserSockets) {
          // Send location to the other user
          otherUserSockets.forEach((sockId) => {
            io.to(sockId).emit("location-shared", {
              matchId,
              location,
            });
          });
        }
      } catch (error: any) {
        console.error("Error handling location share:", error);
        socket.emit("error", { message: error.message || "Failed to share location" });
      }
    });

    // Handle chat messages
    socket.on("chat-message", async (data: { matchId: string; message: string }) => {
      try {
        const { matchId, message } = data;

        // Validate message
        if (!message || message.trim().length === 0) {
          socket.emit("error", { message: "Message cannot be empty" });
          return;
        }

        if (message.length > 1000) {
          socket.emit("error", { message: "Message too long (max 1000 characters)" });
          return;
        }

        // Verify match exists and user is part of it
        const match = await (prisma as any).match.findUnique({
          where: { id: matchId },
        });

        if (!match) {
          socket.emit("error", { message: "Match not found" });
          return;
        }

        // Verify user is part of this match
        if (match.user1Id !== userId && match.user2Id !== userId) {
          socket.emit("error", { message: "Not authorized" });
          return;
        }

        // Broadcast message to all users in the match room (including sender)
        // This ensures the sender also receives their own message for UI consistency
        const messageData = {
          userId,
          message: message.trim(),
          timestamp: new Date().toISOString(),
        };

        io.to(`match-${matchId}`).emit("chat-message", messageData);
      } catch (error: any) {
        console.error("Error handling chat message:", error);
        socket.emit("error", { message: error.message || "Failed to send message" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Remove from queue
      removeFromQueue(userId, socket.id);

      // Remove socket from tracking
      const sockets = userSockets.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSockets.delete(userId);
        }
      }

      // Update activity status
      try {
        const existingActivity = await (prisma as any).userActivity.findFirst({
          where: { userId },
          orderBy: { lastSeen: "desc" },
        });

        if (existingActivity) {
          await (prisma as any).userActivity.update({
            where: { id: existingActivity.id },
            data: {
              status: "OFFLINE",
              lastSeen: new Date(),
            },
          });
        }
      } catch (error) {
        console.error("Error updating activity on disconnect:", error);
      }
    });
  });
}

// Try to match a user with someone in the queue
async function tryMatch(userId: string, socketId: string, io: SocketIOServer) {
  // This will be called periodically or when new users join
  // For now, we'll check immediately after a user joins
  
  // Find the user in the queue
  const queueUser = getQueueUser(userId, socketId);
  if (!queueUser) return;

  const match = findMatch(queueUser);
  if (!match) {
    // No match found, emit queue position update
    io.to(socketId).emit("queue-position", {
      position: getQueuePosition(userId, socketId),
    });
    return;
  }

  // Create match
  try {
    const matchResult = await createMatch(queueUser, match);

    // Get socket IDs for both users
    const user1Sockets = userSockets.get(matchResult.user1Id) || new Set();
    const user2Sockets = userSockets.get(matchResult.user2Id) || new Set();

    // Join both users to the match room
    user1Sockets.forEach((sockId) => {
      io.sockets.sockets.get(sockId)?.join(`match-${matchResult.matchId}`);
    });
    user2Sockets.forEach((sockId) => {
      io.sockets.sockets.get(sockId)?.join(`match-${matchResult.matchId}`);
    });

    // Emit match found to both users
    user1Sockets.forEach((sockId) => {
      io.to(sockId).emit("match-found", {
        matchId: matchResult.matchId,
        roomId: matchResult.roomId,
        otherUserId: matchResult.user2Id,
        mode: matchResult.mode,
        matchedTopics: matchResult.matchedTopics,
      });
    });

    user2Sockets.forEach((sockId) => {
      io.to(sockId).emit("match-found", {
        matchId: matchResult.matchId,
        roomId: matchResult.roomId,
        otherUserId: matchResult.user1Id,
        mode: matchResult.mode,
        matchedTopics: matchResult.matchedTopics,
      });
    });
  } catch (error) {
    console.error("Error creating match:", error);
  }
}

// Helper to get queue user
function getQueueUser(userId: string, socketId: string): QueueUser | null {
  const key = `${userId}-${socketId}`;
  return queueUsersMap.get(key) || null;
}

// Start matching interval after io is available
let matchingInterval: NodeJS.Timeout | null = null;

export function startMatchingInterval(io: SocketIOServer) {
  if (matchingInterval) {
    clearInterval(matchingInterval);
  }
  
  matchingInterval = setInterval(() => {
    // This is a simple implementation - in production, you'd optimize this
    const queueSnapshot = Array.from(queueUsersMap.values());
    queueSnapshot.forEach((user) => {
      const socket = io.sockets.sockets.get(user.socketId);
      if (socket) {
        tryMatch(user.userId, user.socketId, io);
      }
    });
  }, 2000); // Check every 2 seconds
}

