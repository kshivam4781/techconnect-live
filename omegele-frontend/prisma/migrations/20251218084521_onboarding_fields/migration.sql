-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('STUDENT', 'JUNIOR', 'MID', 'SENIOR', 'STAFF_LEAD', 'EXEC');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "goals" TEXT,
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seniority" "Seniority",
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "topics" TEXT[] DEFAULT ARRAY[]::TEXT[];
