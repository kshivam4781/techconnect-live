import { QueueUser, MatchResult } from "./types";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// In-memory queue (in production, use Redis)
const matchQueue: QueueUser[] = [];
// Map for quick lookup by userId-socketId
export const queueUsersMap = new Map<string, QueueUser>();

export function addToQueue(user: QueueUser) {
  // Remove user if already in queue
  removeFromQueue(user.userId, user.socketId);
  
  // Add to queue
  matchQueue.push(user);
  const key = `${user.userId}-${user.socketId}`;
  queueUsersMap.set(key, user);
  console.log(`User ${user.userId} added to queue. Queue size: ${matchQueue.length}`);
}

export function removeFromQueue(userId: string, socketId?: string) {
  const index = matchQueue.findIndex(
    (u) => u.userId === userId && (!socketId || u.socketId === socketId)
  );
  if (index !== -1) {
    const user = matchQueue[index];
    matchQueue.splice(index, 1);
    const key = `${user.userId}-${user.socketId}`;
    queueUsersMap.delete(key);
    console.log(`User ${userId} removed from queue. Queue size: ${matchQueue.length}`);
  }
}

export function findMatch(user: QueueUser): QueueUser | null {
  // Filter out:
  // 1. Same user
  // 2. Users already matched in this session
  // 3. Users who have this user in their matchedUserIds
  const candidates = matchQueue.filter((candidate) => {
    // Don't match with self
    if (candidate.userId === user.userId) return false;
    
    // Don't match if already matched in this session
    if (user.matchedUserIds.includes(candidate.userId)) return false;
    if (candidate.matchedUserIds.includes(user.userId)) return false;
    
    // Must match mode
    if (candidate.mode !== user.mode) return false;
    
    return true;
  });

  if (candidates.length === 0) {
    return null;
  }

  // Try to match by topic overlap (priority)
  let bestMatch: QueueUser | null = null;
  let maxTopicOverlap = 0;

  for (const candidate of candidates) {
    const userTopics = new Set(user.topics);
    const candidateTopics = new Set(candidate.topics);
    const overlap = [...userTopics].filter((t) => candidateTopics.has(t)).length;

    if (overlap > maxTopicOverlap) {
      maxTopicOverlap = overlap;
      bestMatch = candidate;
    }
  }

  // If no topic match, try seniority similarity
  if (!bestMatch && user.seniority) {
    for (const candidate of candidates) {
      if (candidate.seniority === user.seniority) {
        bestMatch = candidate;
        break;
      }
    }
  }

  // Fallback: match with first available user
  if (!bestMatch) {
    bestMatch = candidates[0];
  }

  return bestMatch;
}

export async function createMatch(
  user1: QueueUser,
  user2: QueueUser
): Promise<MatchResult> {
  // Calculate matched topics
  const user1Topics = new Set(user1.topics);
  const user2Topics = new Set(user2.topics);
  const matchedTopics = [...user1Topics].filter((t) => user2Topics.has(t));

  // Generate room ID
  const roomId = randomUUID();

  // Create match record in database
  const match = await (prisma as any).match.create({
    data: {
      user1Id: user1.userId,
      user2Id: user2.userId,
      user1SessionId: user1.sessionId,
      user2SessionId: user2.sessionId,
      mode: user1.mode,
      status: "PENDING",
      matchedAt: new Date(),
      roomId,
      matchedTopics,
    },
  });

  // Update both users' sessions to track matched users
  const [session1, session2] = await Promise.all([
    (prisma as any).userSession.findFirst({
      where: {
        sessionId: user1.sessionId,
        userId: user1.userId,
      },
    }),
    (prisma as any).userSession.findFirst({
      where: {
        sessionId: user2.sessionId,
        userId: user2.userId,
      },
    }),
  ]);

  if (session1) {
    await (prisma as any).userSession.update({
      where: { id: session1.id },
      data: {
        matchedUserIds: [...session1.matchedUserIds, user2.userId],
      },
    });
  }

  if (session2) {
    await (prisma as any).userSession.update({
      where: { id: session2.id },
      data: {
        matchedUserIds: [...session2.matchedUserIds, user1.userId],
      },
    });
  }

  // Remove both users from queue
  removeFromQueue(user1.userId, user1.socketId);
  removeFromQueue(user2.userId, user2.socketId);

  return {
    matchId: match.id,
    roomId,
    user1Id: user1.userId,
    user2Id: user2.userId,
    user1SessionId: user1.sessionId,
    user2SessionId: user2.sessionId,
    mode: user1.mode,
    matchedTopics,
  };
}

export function getQueueSize(): number {
  return matchQueue.length;
}

export function getQueuePosition(userId: string, socketId?: string): number {
  const index = matchQueue.findIndex(
    (u) => u.userId === userId && (!socketId || u.socketId === socketId)
  );
  return index === -1 ? -1 : index;
}

