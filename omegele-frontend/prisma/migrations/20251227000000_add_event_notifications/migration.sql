-- CreateTable
CREATE TABLE "EventNotification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventNotification_email_key" ON "EventNotification"("email");

-- CreateIndex
CREATE INDEX "EventNotification_email_idx" ON "EventNotification"("email");

-- CreateIndex
CREATE INDEX "EventNotification_isActive_idx" ON "EventNotification"("isActive");

