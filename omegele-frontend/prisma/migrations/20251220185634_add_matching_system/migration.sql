-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('ONLINE', 'SEARCHING', 'IN_CALL', 'OFFLINE');

-- CreateEnum
CREATE TYPE "CallMode" AS ENUM ('VIDEO', 'TEXT');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED', 'SKIPPED', 'TIMEOUT');

-- CreateEnum
CREATE TYPE "FlagCategory" AS ENUM ('HARASSMENT', 'INAPPROPRIATE', 'SPAM', 'SCAM', 'HATE_SPEECH', 'VIOLENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "FlagStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'ONLINE',
    "mode" "CallMode",
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "matchedUserIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "user1SessionId" TEXT,
    "user2SessionId" TEXT,
    "mode" "CallMode" NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "roomId" TEXT,
    "user1JoinedAt" TIMESTAMP(3),
    "user2JoinedAt" TIMESTAMP(3),
    "matchedTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flag" (
    "id" TEXT NOT NULL,
    "flaggedById" TEXT NOT NULL,
    "flaggedUserId" TEXT NOT NULL,
    "matchId" TEXT,
    "reason" TEXT NOT NULL,
    "category" "FlagCategory",
    "flaggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "FlagStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_activities_status_joinedAt_idx" ON "user_activities"("status", "joinedAt");

-- CreateIndex
CREATE INDEX "user_activities_userId_lastSeen_idx" ON "user_activities"("userId", "lastSeen");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionId_key" ON "user_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "user_sessions_userId_isActive_idx" ON "user_sessions"("userId", "isActive");

-- CreateIndex
CREATE INDEX "user_sessions_sessionId_idx" ON "user_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "Match_user1Id_matchedAt_idx" ON "Match"("user1Id", "matchedAt");

-- CreateIndex
CREATE INDEX "Match_user2Id_matchedAt_idx" ON "Match"("user2Id", "matchedAt");

-- CreateIndex
CREATE INDEX "Match_user1Id_status_idx" ON "Match"("user1Id", "status");

-- CreateIndex
CREATE INDEX "Match_user2Id_status_idx" ON "Match"("user2Id", "status");

-- CreateIndex
CREATE INDEX "Match_status_startedAt_idx" ON "Match"("status", "startedAt");

-- CreateIndex
CREATE INDEX "Match_matchedAt_idx" ON "Match"("matchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Match_roomId_key" ON "Match"("roomId");

-- CreateIndex
CREATE INDEX "Match_roomId_idx" ON "Match"("roomId");

-- CreateIndex
CREATE INDEX "Match_user1SessionId_idx" ON "Match"("user1SessionId");

-- CreateIndex
CREATE INDEX "Match_user2SessionId_idx" ON "Match"("user2SessionId");

-- CreateIndex
CREATE INDEX "Flag_flaggedById_flaggedAt_idx" ON "Flag"("flaggedById", "flaggedAt");

-- CreateIndex
CREATE INDEX "Flag_flaggedUserId_flaggedAt_idx" ON "Flag"("flaggedUserId", "flaggedAt");

-- CreateIndex
CREATE INDEX "Flag_matchId_idx" ON "Flag"("matchId");

-- CreateIndex
CREATE INDEX "Flag_status_flaggedAt_idx" ON "Flag"("status", "flaggedAt");

-- CreateIndex
CREATE INDEX "Flag_flaggedAt_idx" ON "Flag"("flaggedAt");

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_flaggedById_fkey" FOREIGN KEY ("flaggedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_flaggedUserId_fkey" FOREIGN KEY ("flaggedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

