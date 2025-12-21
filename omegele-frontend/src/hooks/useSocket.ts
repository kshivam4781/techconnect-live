"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

interface MatchFoundData {
  matchId: string;
  roomId: string;
  otherUserId: string;
  mode: "VIDEO" | "TEXT";
  matchedTopics: string[];
}

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [matchData, setMatchData] = useState<MatchFoundData | null>(null);

  useEffect(() => {
    if (!session || !(session as any).userId) {
      return;
    }

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
      auth: {
        userId: (session as any).userId,
      },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("match-found", (data: MatchFoundData) => {
      console.log("Match found:", data);
      setMatchData(data);
    });

    socket.on("call-started", (data: { matchId: string }) => {
      console.log("Call started:", data);
    });

    socket.on("call-ended", (data: { matchId: string; reason?: string }) => {
      console.log("Call ended:", data);
      setMatchData(null);
    });

    socket.on("error", (error: { message: string }) => {
      console.error("Socket error:", error);
    });

    socket.on("queue-joined", (data: { queuePosition: number }) => {
      console.log("Queue joined, position:", data.queuePosition);
    });

    socket.on("queue-left", () => {
      console.log("Left queue");
    });

    socket.on("queue-position", (data: { position: number }) => {
      console.log("Queue position:", data.position);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session]);

  const joinQueue = (sessionId: string, mode: "VIDEO" | "TEXT") => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("join-queue", { sessionId, mode });
    }
  };

  const leaveQueue = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("leave-queue");
    }
  };

  const startCall = (matchId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("call-started", { matchId });
    }
  };

  const endCall = (matchId: string, reason: "ended" | "skipped" = "ended") => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("call-ended", { matchId, reason });
    }
  };

  const sendWebRTCOffer = (matchId: string, offer: RTCSessionDescriptionInit) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("webrtc-offer", { matchId, offer });
    }
  };

  const sendWebRTCAnswer = (matchId: string, answer: RTCSessionDescriptionInit) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("webrtc-answer", { matchId, answer });
    }
  };

  const sendWebRTCIceCandidate = (matchId: string, candidate: RTCIceCandidateInit) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("webrtc-ice-candidate", { matchId, candidate });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    matchData,
    joinQueue,
    leaveQueue,
    startCall,
    endCall,
    sendWebRTCOffer,
    sendWebRTCAnswer,
    sendWebRTCIceCandidate,
  };
}

