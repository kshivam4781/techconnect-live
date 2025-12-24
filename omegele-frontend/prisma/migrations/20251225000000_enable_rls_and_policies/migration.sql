-- Enable Row Level Security on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_activities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Flag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: This app uses NextAuth (not Supabase Auth) and Prisma Client
-- Prisma Client uses the service_role which bypasses RLS, so these policies
-- won't affect your application code. However, they provide security if:
-- 1. Someone accesses the database via Supabase's PostgREST API
-- 2. You switch to using Supabase Auth in the future
--
-- The policies are structured as:
-- 1. Service role policies: Allow everything (for Prisma Client)
-- 2. Authenticated user policies: Restrictive (for PostgREST API access)

-- ============================================
-- USER TABLE POLICIES
-- ============================================
-- Service role can do everything (for Prisma Client)
CREATE POLICY "Service role can access all users"
  ON "User" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can only read/update their own user record
CREATE POLICY "Users can read own profile"
  ON "User" FOR SELECT
  TO authenticated
  USING (id::text = current_setting('request.jwt.claim.user_id', true));

CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  TO authenticated
  USING (id::text = current_setting('request.jwt.claim.user_id', true))
  WITH CHECK (id::text = current_setting('request.jwt.claim.user_id', true));

-- ============================================
-- ACCOUNT TABLE POLICIES
-- ============================================
-- Service role can do everything
CREATE POLICY "Service role can access all accounts"
  ON "Account" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only access their own accounts
CREATE POLICY "Users can access own accounts"
  ON "Account" FOR ALL
  TO authenticated
  USING (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  )
  WITH CHECK (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- ============================================
-- USER_SESSIONS TABLE POLICIES
-- ============================================
-- Service role can do everything
CREATE POLICY "Service role can access all sessions"
  ON "user_sessions" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only access their own sessions
CREATE POLICY "Users can access own sessions"
  ON "user_sessions" FOR ALL
  TO authenticated
  USING (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  )
  WITH CHECK (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- ============================================
-- USER_ACTIVITIES TABLE POLICIES
-- ============================================
-- Service role can do everything
CREATE POLICY "Service role can access all activities"
  ON "user_activities" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only access their own activities
CREATE POLICY "Users can access own activities"
  ON "user_activities" FOR ALL
  TO authenticated
  USING (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  )
  WITH CHECK (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- ============================================
-- MATCH TABLE POLICIES
-- ============================================
-- Service role can do everything
CREATE POLICY "Service role can access all matches"
  ON "Match" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only access matches they're part of (as user1 or user2)
CREATE POLICY "Users can access own matches"
  ON "Match" FOR SELECT
  TO authenticated
  USING (
    "user1Id"::text = current_setting('request.jwt.claim.user_id', true) OR
    "user2Id"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- Users can update matches they're part of
CREATE POLICY "Users can update own matches"
  ON "Match" FOR UPDATE
  TO authenticated
  USING (
    "user1Id"::text = current_setting('request.jwt.claim.user_id', true) OR
    "user2Id"::text = current_setting('request.jwt.claim.user_id', true)
  )
  WITH CHECK (
    "user1Id"::text = current_setting('request.jwt.claim.user_id', true) OR
    "user2Id"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- ============================================
-- FLAG TABLE POLICIES
-- ============================================
-- Service role can do everything
CREATE POLICY "Service role can access all flags"
  ON "Flag" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can see flags they created or flags against them
CREATE POLICY "Users can access relevant flags"
  ON "Flag" FOR SELECT
  TO authenticated
  USING (
    "flaggedById"::text = current_setting('request.jwt.claim.user_id', true) OR
    "flaggedUserId"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- Users can create flags (where they are the flagger)
CREATE POLICY "Users can create flags"
  ON "Flag" FOR INSERT
  TO authenticated
  WITH CHECK (
    "flaggedById"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- Users can update flags they created
CREATE POLICY "Users can update own flags"
  ON "Flag" FOR UPDATE
  TO authenticated
  USING (
    "flaggedById"::text = current_setting('request.jwt.claim.user_id', true)
  )
  WITH CHECK (
    "flaggedById"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- ============================================
-- FEEDBACK TABLE POLICIES
-- ============================================
-- Service role can do everything
CREATE POLICY "Service role can access all feedback"
  ON "Feedback" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can only access their own feedback
CREATE POLICY "Users can access own feedback"
  ON "Feedback" FOR ALL
  TO authenticated
  USING (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  )
  WITH CHECK (
    "userId"::text = current_setting('request.jwt.claim.user_id', true)
  );

-- ============================================
-- _PRISMA_MIGRATIONS TABLE POLICIES
-- ============================================
-- This is Prisma's internal migration tracking table
-- Only service role should access it (for Prisma migrations)
CREATE POLICY "Service role can access migrations"
  ON "_prisma_migrations" FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- No authenticated user access to migrations table

