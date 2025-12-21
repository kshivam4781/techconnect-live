export interface QueueUser {
  userId: string;
  sessionId: string;
  mode: "VIDEO" | "TEXT";
  topics: string[];
  seniority: string | null;
  matchedUserIds: string[]; // Users already matched in this session
  joinedAt: Date;
  socketId: string;
}

export interface MatchResult {
  matchId: string;
  roomId: string;
  user1Id: string;
  user2Id: string;
  user1SessionId: string;
  user2SessionId: string;
  mode: "VIDEO" | "TEXT";
  matchedTopics: string[];
}

