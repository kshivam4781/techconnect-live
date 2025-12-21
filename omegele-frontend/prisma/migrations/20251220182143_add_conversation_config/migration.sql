-- AlterTable
ALTER TABLE "User" ADD COLUMN     "initialConversationDuration" INTEGER DEFAULT 60,
ADD COLUMN     "showName" BOOLEAN NOT NULL DEFAULT true;

