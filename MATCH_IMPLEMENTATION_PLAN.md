# Video Call Matching & Activity Tracking - Implementation Plan

## Key Requirements

This implementation will track:
1. **Which users matched with which users** - Complete record of user1 ↔ user2 matches
2. **Exact timeline** - When match was found (`matchedAt`), when call started (`startedAt`), when call ended (`endedAt`)
3. **Call duration** - Calculated duration in seconds
4. **Activity tracking** - How many users were active and which users were active at what time
5. **Query capabilities** - API endpoints to query match history by user, time range, status
6. **Duplicate prevention** - Users will NOT be matched with the same person twice in a single session (session-based matching)
7. **Flagging/Reporting system** - Users can flag other users during calls with immediate save of who flagged whom, timestamp, and reason

## Current State Analysis

### What Exists:
1. **Frontend Match Page** (`/match`)
   - UI states: idle, searching, matched, in-call, ended
   - Simulated matching (setTimeout-based, no real backend)
   - Video/text mode selection
   - Timer displays for matching and calls
   - Basic controls (mute, video toggle, skip, end call)
   - Video elements (`localVideoRef`, `remoteVideoRef`) but no WebRTC implementation

2. **Database Schema**
   - `User` model with onboarding, preferences, topics, seniority
   - `Account` model for OAuth providers
   - **Missing**: Match/Conversation models, Activity tracking models

3. **Authentication**
   - NextAuth with GitHub OAuth working
   - Session management in place
   - User onboarding flow complete

### What's Missing:
1. **Real-time matching system** (WebSocket server)
2. **WebRTC video call implementation**
3. **Activity tracking** (who's active, when)
4. **Database models** for matches, conversations, activity logs
5. **Backend API routes** for matching queue management

---

## Implementation Plan

### Phase 1: Database Schema Updates

#### 1.1 Add Activity Tracking Models

```prisma
model UserActivity {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Activity tracking
  status    ActivityStatus @default(ONLINE) // ONLINE, SEARCHING, IN_CALL, OFFLINE
  mode      CallMode?      // VIDEO, TEXT (null when not searching)
  joinedAt  DateTime       @default(now())
  lastSeen  DateTime       @default(now())
  
  // Indexes for fast queries
  @@index([status, joinedAt])
  @@index([userId, lastSeen])
  @@map("user_activities")
}

enum ActivityStatus {
  ONLINE      // User is on the site
  SEARCHING   // User is actively searching for a match
  IN_CALL     // User is in an active call
  OFFLINE     // User left or disconnected
}

enum CallMode {
  VIDEO
  TEXT
}
```

#### 1.2 Add Session Tracking Model

```prisma
model UserSession {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Session tracking
  sessionId       String   @unique // Unique session identifier
  startedAt       DateTime @default(now())
  endedAt         DateTime?
  isActive        Boolean  @default(true)
  
  // Track previously matched users in this session (to prevent re-matching)
  matchedUserIds  String[] @default([]) // Array of user IDs this user has already matched with
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([userId, isActive])
  @@index([sessionId])
  @@map("user_sessions")
}
```

#### 1.3 Add Match/Conversation Models

```prisma
model Match {
  id              String   @id @default(cuid())
  user1Id         String
  user2Id         String
  user1           User     @relation("MatchesAsUser1", fields: [user1Id], references: [id])
  user2           User     @relation("MatchesAsUser2", fields: [user2Id], references: [id])
  
  // Session tracking - CRITICAL for preventing duplicate matches
  user1SessionId  String?  // Session ID for user1 when this match occurred
  user2SessionId  String?  // Session ID for user2 when this match occurred
  
  // Match details
  mode            CallMode // VIDEO or TEXT
  status          MatchStatus @default(PENDING) // PENDING, ACTIVE, ENDED, SKIPPED
  
  // Timeline tracking - CRITICAL for tracking who matched with whom and when
  matchedAt       DateTime @default(now())  // When match was found/created
  startedAt       DateTime?                 // When both users joined and call actually started
  endedAt         DateTime?                 // When call ended
  duration        Int?                      // Duration in seconds (calculated: endedAt - startedAt)
  
  // WebRTC room/session info
  roomId          String?  @unique // For WebRTC signaling
  user1JoinedAt   DateTime?        // When user1 joined the call
  user2JoinedAt   DateTime?        // When user2 joined the call
  
  // Matching criteria (for analytics)
  matchedTopics   String[] // Topics that matched
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([user1Id, matchedAt])
  @@index([user2Id, matchedAt])
  @@index([user1Id, status])
  @@index([user2Id, status])
  @@index([status, startedAt])
  @@index([matchedAt])  // For querying matches by time range
  @@index([roomId])
  @@index([user1SessionId])  // For session-based queries
  @@index([user2SessionId])  // For session-based queries
}

enum MatchStatus {
  PENDING   // Match found, waiting for both users to join
  ACTIVE    // Both users joined, call in progress
  ENDED     // Call ended normally
  SKIPPED   // One user skipped
  TIMEOUT   // Match timeout (user didn't join)
}
```

#### 1.4 Add Flag/Report Model

```prisma
model Flag {
  id              String   @id @default(cuid())
  
  // Who flagged whom
  flaggedById     String   // User who reported/flagged
  flaggedBy       User     @relation("FlagsCreated", fields: [flaggedById], references: [id])
  flaggedUserId   String   // User who was flagged
  flaggedUser     User     @relation("FlagsReceived", fields: [flaggedUserId], references: [id])
  
  // Match context - which call/match this flag is related to
  matchId         String?
  match           Match?   @relation(fields: [matchId], references: [id], onDelete: SetNull)
  
  // Flag details
  reason          String   // Reason for flagging (user-provided)
  category        FlagCategory? // Optional categorization
  flaggedAt       DateTime @default(now()) // When flag was created
  
  // Status tracking
  status          FlagStatus @default(PENDING) // PENDING, REVIEWED, RESOLVED, DISMISSED
  reviewedAt     DateTime?
  reviewedBy      String?  // Admin user ID who reviewed
  adminNotes      String?  // Admin notes/actions taken
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([flaggedById, flaggedAt])
  @@index([flaggedUserId, flaggedAt])
  @@index([matchId])
  @@index([status, flaggedAt])
  @@index([flaggedAt])
}

enum FlagCategory {
  HARASSMENT      // Harassment or bullying
  INAPPROPRIATE   // Inappropriate content/behavior
  SPAM            // Spam or solicitation
  SCAM            // Scam or fraud
  HATE_SPEECH     // Hate speech
  VIOLENCE        // Threats or violence
  OTHER           // Other reason
}

enum FlagStatus {
  PENDING     // Flag submitted, awaiting review
  REVIEWED    // Under review by admin
  RESOLVED    // Action taken (e.g., user banned)
  DISMISSED   // Flag dismissed (false report)
}
```

#### 1.5 Update User Model

```prisma
model User {
  // ... existing fields ...
  
  // Relations
  activities      UserActivity[]
  sessions        UserSession[]
  matchesAsUser1  Match[] @relation("MatchesAsUser1")
  matchesAsUser2  Match[] @relation("MatchesAsUser2")
  flagsCreated    Flag[]  @relation("FlagsCreated")    // Flags this user created
  flagsReceived   Flag[]  @relation("FlagsReceived")    // Flags against this user
}
```

#### 1.6 Update Match Model (add relation)

```prisma
model Match {
  // ... existing fields ...
  
  // Relations
  flags           Flag[]  // Flags related to this match
}
```

---

### Phase 2: Backend Infrastructure

#### 2.1 WebSocket Server Setup

**Technology Choice**: Socket.io (works well with Next.js)

**File Structure**:
```
src/
  app/
    api/
      socket/
        route.ts          # Socket.io server setup
  lib/
    socket/
      server.ts           # Socket server instance
      handlers.ts         # Event handlers
      matching.ts         # Matching algorithm
      webrtc-signaling.ts # WebRTC signaling
```

**Key Features**:
- Real-time connection management
- User presence tracking
- Match queue management
- WebRTC signaling (offer/answer/ICE candidates)
- Activity status updates

#### 2.2 Session Management

**Session Definition**:
- A session starts when a user clicks "Start" to begin searching
- A session ends when:
  - User explicitly stops searching and goes back to idle
  - User disconnects/closes the page
  - User goes offline
- Each session has a unique `sessionId` (UUID or cuid)

**Session Lifecycle**:
1. User clicks "Start" → Create/update `UserSession`:
   - Generate unique `sessionId`
   - Set `isActive = true`
   - Initialize `matchedUserIds = []`
   - Set `startedAt = now()`

2. During session:
   - Track all matched users in `matchedUserIds` array
   - Query this array before matching to exclude previous matches

3. Session ends:
   - Set `isActive = false`
   - Set `endedAt = now()`

#### 2.3 Matching Queue System

**Algorithm**:
1. When user clicks "Start" → Create/update session and add to queue with:
   - User ID
   - Session ID
   - Preferred mode (video/text)
   - Topics/interests
   - Seniority level
   - Timestamp
   - List of previously matched user IDs (from session)

2. Matching Logic (with duplicate prevention):
   - **Step 1**: Get user's current session and `matchedUserIds`
   - **Step 2**: Filter queue to exclude:
     - Same user (self)
     - Users already in `matchedUserIds` (prevent duplicate matches in session)
     - Users who have this user in their `matchedUserIds` (bidirectional check)
   - **Step 3**: Try to match by topic overlap (priority)
   - **Step 4**: Fallback: match by seniority similarity
   - **Step 5**: Fallback: match any available user after 30 seconds
   - **Step 6**: If no matches available (all users already matched), show message: "No new matches available. Start a new session to match with more users."

3. When match found:
   - Create `Match` record in DB with:
     - `user1Id` and `user2Id` (tracking which users matched)
     - `user1SessionId` and `user2SessionId` (track session IDs)
     - `matchedAt` = current timestamp (when match was found)
     - `mode` = user's selected mode
     - `status` = PENDING
   - **Update both users' sessions**:
     - Add `user2Id` to `user1`'s `matchedUserIds` array
     - Add `user1Id` to `user2`'s `matchedUserIds` array
   - Generate unique `roomId`
   - Emit match event to both users via WebSocket
   - Set both users' status to `IN_CALL`

4. When both users join the call:
   - Update `Match` record:
     - `startedAt` = current timestamp (when call actually started)
     - `user1JoinedAt` = timestamp when user1 joined
     - `user2JoinedAt` = timestamp when user2 joined
     - `status` = ACTIVE

5. When call ends:
   - Update `Match` record:
     - `endedAt` = current timestamp
     - `duration` = calculate (endedAt - startedAt) in seconds
     - `status` = ENDED or SKIPPED
   - This provides complete timeline: matchedAt → startedAt → endedAt

**Duplicate Prevention Logic (Critical)**:
- Before matching user A with user B, check:
  1. Is user B in user A's `matchedUserIds`? → Skip
  2. Is user A in user B's `matchedUserIds`? → Skip
  3. Are they the same user? → Skip
- This ensures users never match with the same person twice in a session
- When a new session starts, `matchedUserIds` is reset to `[]`, allowing fresh matches
- Users can start a new session to match with previously matched users again

#### 2.3 Activity Tracking Service

**API Endpoints**:
- `POST /api/activity/update` - Update user activity status
- `GET /api/activity/stats` - Get active user count (public or admin)
- `GET /api/activity/history` - Get activity history (admin)

**Real-time Updates**:
- When user joins match page → `ONLINE`
- When user starts searching → `SEARCHING`
- When match found → `IN_CALL`
- When user leaves → `OFFLINE`
- Periodic heartbeat to update `lastSeen`

**Activity Logging**:
- Store activity changes in `UserActivity` table
- Track: userId, status, timestamp, mode
- Query for analytics: "How many users were active at time X?"

---

### Phase 3: WebRTC Video Call Implementation

#### 3.1 Frontend WebRTC Setup

**Dependencies to Add**:
```json
{
  "socket.io-client": "^4.7.0",
  "simple-peer": "^9.11.1" // Or use native WebRTC API
}
```

**Key Components**:
1. **WebRTC Manager Hook** (`useWebRTC.ts`)
   - Initialize local media stream
   - Handle peer connection
   - Manage offer/answer exchange
   - Handle ICE candidates
   - Cleanup on disconnect

2. **Socket Connection Hook** (`useSocket.ts`)
   - Connect to Socket.io server
   - Handle match events
   - Handle WebRTC signaling events
   - Handle disconnect/reconnect

#### 3.2 WebRTC Flow

1. **User A starts searching**:
   - Get local media stream (camera/mic)
   - Display in `localVideoRef`

2. **Match found**:
   - Both users receive `match-found` event with `roomId`
   - Both create peer connections
   - User A creates offer, sends via WebSocket
   - User B receives offer, creates answer, sends back
   - Exchange ICE candidates
   - Establish connection
   - Display remote stream in `remoteVideoRef`

3. **During call**:
   - Handle mute/unmute
   - Handle video on/off
   - Track call duration
   - Handle disconnect/reconnect
   - **Flagging functionality**:
     - User clicks flag button
     - **IMMEDIATELY** save flag to database (flaggedById, flaggedUserId, matchId, flaggedAt)
     - Show modal for reason input
     - User submits reason → Update flag record
     - Optionally auto-end call

4. **Call ends**:
   - Close peer connections
   - Stop media streams
   - Update match status in DB
   - Update user activity status

---

### Phase 4: API Routes

#### 4.1 Session Management API

```
POST /api/session/start
  Body: { mode?: "video" | "text" } (optional, can be set later)
  Response: { 
    success: true,
    sessionId: string,
    session: {
      id: string,
      sessionId: string,
      startedAt: ISO datetime,
      isActive: true,
      matchedUserIds: []
    }
  }

POST /api/session/end
  Body: { sessionId: string }
  Response: { success: true }

GET /api/session/current
  Response: {
    session: {
      id: string,
      sessionId: string,
      startedAt: ISO datetime,
      isActive: boolean,
      matchedUserIds: string[],
      matchCount: number
    } | null
  }

GET /api/session/history
  Query params:
    - limit?: number (default: 10)
    - offset?: number (default: 0)
  Response: {
    sessions: [
      {
        id: string,
        sessionId: string,
        startedAt: ISO datetime,
        endedAt: ISO datetime?,
        isActive: boolean,
        matchCount: number,
        matchedUserIds: string[]
      }
    ],
    total: number
  }
```

#### 4.2 Match Queue API

```
POST /api/match/join
  Body: { mode: "video" | "text", sessionId: string }
  Response: { 
    success: true, 
    queuePosition: number,
    sessionId: string,
    previouslyMatchedCount: number  // How many users already matched in this session
  }

POST /api/match/leave
  Body: { sessionId?: string }
  Response: { success: true }

GET /api/match/status
  Query params:
    - sessionId?: string
  Response: { 
    inQueue: boolean,
    queuePosition?: number,
    matchId?: string,
    roomId?: string,
    sessionId?: string,
    previouslyMatchedUsers: string[]  // User IDs already matched in current session
  }
```

#### 4.3 Activity API

```
POST /api/activity/update
  Body: { status: "ONLINE" | "SEARCHING" | "IN_CALL" | "OFFLINE", mode?: "VIDEO" | "TEXT" }
  Response: { success: true }

GET /api/activity/stats
  Response: {
    totalOnline: number,
    searching: number,
    inCall: number,
    breakdown: {
      video: number,
      text: number
    }
  }

GET /api/activity/history?startTime=...&endTime=...
  Response: {
    timeline: [
      { timestamp: "...", onlineCount: 10, searchingCount: 3, inCallCount: 2 }
    ]
  }
```

#### 4.4 Match History API

```
GET /api/matches
  Query params:
    - userId?: string (filter by specific user, admin only)
    - startTime?: ISO datetime (filter matches from this time)
    - endTime?: ISO datetime (filter matches until this time)
    - status?: "ACTIVE" | "ENDED" | "SKIPPED" | "PENDING"
  Response: {
    matches: [
      {
        id: string,
        user1Id: string,
        user2Id: string,
        user1: { id, name, image, email },
        user2: { id, name, image, email },
        mode: "VIDEO" | "TEXT",
        status: "ACTIVE" | "ENDED" | "SKIPPED" | "PENDING",
        matchedAt: ISO datetime,    // When match was found
        startedAt: ISO datetime?,   // When call actually started
        endedAt: ISO datetime?,     // When call ended
        duration: number,           // Duration in seconds
        matchedTopics: string[]
      }
    ],
    total: number,
    timeRange: {
      start: ISO datetime,
      end: ISO datetime
    }
  }

GET /api/matches/:matchId
  Response: {
    match: {
      id: string,
      user1Id: string,
      user2Id: string,
      user1: { id, name, image, email },
      user2: { id, name, image, email },
      mode: "VIDEO" | "TEXT",
      status: "ACTIVE" | "ENDED" | "SKIPPED" | "PENDING",
      matchedAt: ISO datetime,
      startedAt: ISO datetime?,
      endedAt: ISO datetime?,
      duration: number,
      matchedTopics: string[],
      user1JoinedAt: ISO datetime?,
      user2JoinedAt: ISO datetime?
    }
  }

GET /api/matches/stats
  Query params:
    - startTime?: ISO datetime
    - endTime?: ISO datetime
  Response: {
    totalMatches: number,
    activeMatches: number,
    endedMatches: number,
    averageDuration: number,
    matchesByMode: {
      VIDEO: number,
      TEXT: number
    },
    matchesByTimeRange: [
      {
        time: ISO datetime,
        count: number
      }
    ]
  }
```

#### 4.5 Flagging/Reporting API

```
POST /api/flags
  Body: {
    flaggedUserId: string,  // User being flagged
    matchId: string,        // Match/call ID (optional but recommended)
    reason: string,         // User-provided reason (required)
    category?: "HARASSMENT" | "INAPPROPRIATE" | "SPAM" | "SCAM" | "HATE_SPEECH" | "VIOLENCE" | "OTHER"
  }
  Response: {
    success: true,
    flag: {
      id: string,
      flaggedById: string,
      flaggedUserId: string,
      matchId: string?,
      reason: string,
      category: string?,
      flaggedAt: ISO datetime,
      status: "PENDING"
    }
  }
  Note: This endpoint IMMEDIATELY saves the flag to database with timestamp

GET /api/flags
  Query params:
    - userId?: string (get flags created by or against this user, admin only)
    - matchId?: string (get flags for a specific match)
    - status?: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED"
  Response: {
    flags: [
      {
        id: string,
        flaggedById: string,
        flaggedBy: { id, name, email },
        flaggedUserId: string,
        flaggedUser: { id, name, email },
        matchId: string?,
        reason: string,
        category: string?,
        flaggedAt: ISO datetime,
        status: string,
        reviewedAt: ISO datetime?,
        adminNotes: string?
      }
    ],
    total: number
  }

PATCH /api/flags/:flagId
  Body: {
    status?: "REVIEWED" | "RESOLVED" | "DISMISSED",
    adminNotes?: string
  }
  Response: { success: true, flag: {...} }
  Note: Admin only endpoint for reviewing flags
```

---

### Phase 4.4: Match History Query Examples

**Use Cases for Match Tracking**:

1. **Query all matches for a specific user**:
   ```
   GET /api/matches?userId=user123
   ```
   Returns all matches where this user was either user1 or user2, with complete timeline.

2. **Query matches within a time range**:
   ```
   GET /api/matches?startTime=2024-01-01T00:00:00Z&endTime=2024-01-31T23:59:59Z
   ```
   Returns all matches that were created (matchedAt) within this range.

3. **Query active matches at a specific time**:
   ```
   GET /api/matches?startTime=2024-01-15T10:00:00Z&endTime=2024-01-15T11:00:00Z&status=ACTIVE
   ```
   Returns matches that were active during this time period.

4. **Get match statistics**:
   ```
   GET /api/matches/stats?startTime=2024-01-01T00:00:00Z&endTime=2024-01-31T23:59:59Z
   ```
   Returns aggregated statistics about matches in the time range.

**Database Queries (for direct DB access)**:

```sql
-- Find all matches for a specific user with timeline
SELECT 
  m.id,
  m."matchedAt",
  m."startedAt",
  m."endedAt",
  m.duration,
  m.status,
  m.mode,
  u1.name as user1_name,
  u2.name as user2_name
FROM "Match" m
JOIN "User" u1 ON m."user1Id" = u1.id
JOIN "User" u2 ON m."user2Id" = u2.id
WHERE (m."user1Id" = 'user123' OR m."user2Id" = 'user123')
ORDER BY m."matchedAt" DESC;

-- Find matches active at a specific time
SELECT * FROM "Match"
WHERE "startedAt" <= '2024-01-15 10:30:00'
  AND ("endedAt" IS NULL OR "endedAt" >= '2024-01-15 10:30:00')
  AND status = 'ACTIVE';

-- Count matches per hour
SELECT 
  DATE_TRUNC('hour', "matchedAt") as hour,
  COUNT(*) as match_count
FROM "Match"
WHERE "matchedAt" >= '2024-01-01'
GROUP BY hour
ORDER BY hour;

-- Find all matches in a specific session (to verify no duplicates)
SELECT 
  m.id,
  m."user1Id",
  m."user2Id",
  m."matchedAt",
  m."user1SessionId",
  m."user2SessionId"
FROM "Match" m
WHERE m."user1SessionId" = 'session123' OR m."user2SessionId" = 'session123'
ORDER BY m."matchedAt";

-- Verify no duplicate matches in a session
SELECT 
  "user1SessionId",
  "user2SessionId",
  "user1Id",
  "user2Id",
  COUNT(*) as match_count
FROM "Match"
WHERE "user1SessionId" = 'session123' OR "user2SessionId" = 'session123'
GROUP BY "user1SessionId", "user2SessionId", "user1Id", "user2Id"
HAVING COUNT(*) > 1;
-- This query should return 0 rows if duplicate prevention is working
```

---

### Phase 5: Frontend Integration

#### 5.1 Update Match Page

**Changes Needed**:
1. Replace simulated matching with real WebSocket connection
2. Integrate WebRTC for video calls
3. Add activity status indicators
4. Handle real match events
5. Add error handling and reconnection logic
6. **Add Flag/Report button and modal** (during active calls)

**New Hooks**:
- `useSocket()` - Manage Socket.io connection
- `useWebRTC()` - Manage WebRTC peer connection
- `useActivity()` - Track and update activity status
- `useFlag()` - Handle flagging functionality

**Flag Button Implementation**:
- Add flag button in call controls (next to mute, video, skip, end call)
- When clicked:
  1. **IMMEDIATELY** save flag to database (with current matchId, flaggedUserId, flaggedById, timestamp)
  2. Show modal/dialog asking for reason
  3. User enters reason (required text field)
  4. Optional: Select category (dropdown)
  5. Submit → Update flag record with reason and category
  6. Show confirmation message
  7. Optionally end the call automatically after flagging

**Flag Modal Component**:
```tsx
<FlagModal
  isOpen={showFlagModal}
  onClose={() => setShowFlagModal(false)}
  flaggedUserId={matchedUserId}
  matchId={currentMatchId}
  onFlagSubmit={handleFlagSubmit}
/>
```

**Flag Button in Controls**:
- Position: In the call controls bar (alongside mute, video, skip, end)
- Icon: Flag/warning icon
- Color: Red/orange to indicate reporting
- Behavior: 
  - Click → Immediately save flag → Show modal
  - After submission → Show success message
  - Optionally auto-end call

**Flagging Flow (Step-by-Step)**:
1. User clicks flag button during active call
2. **IMMEDIATE ACTION**: 
   - Extract `matchId` from current match
   - Extract `flaggedUserId` (the other user in the call)
   - Extract `flaggedById` (current user from session)
   - Call `POST /api/flags` with minimal data:
     ```json
     {
       "flaggedUserId": "user2-id",
       "matchId": "match-id",
       "reason": "" // Empty initially
     }
     ```
   - **Flag is saved to database immediately** with `flaggedAt` timestamp
3. Show modal/dialog asking for reason
4. User enters reason (required, min 10 characters)
5. User optionally selects category
6. User clicks "Submit"
7. Update flag record with reason and category:
   - Call `PATCH /api/flags/:flagId` with reason and category
8. Show success message: "Report submitted. Thank you for keeping our community safe."
9. Optionally: Auto-end the call and return to idle state
10. Flagged user is added to a review queue (for admin/moderation)

**Why Immediate Save?**
- Ensures flag is recorded even if user closes modal/browser
- Timestamp is accurate (when flag button was clicked, not when reason was submitted)
- Prevents data loss if connection drops
- Provides audit trail of when flagging occurred relative to call timeline

#### 5.2 Activity Dashboard (Optional)

Create admin/analytics page to view:
- Real-time active user count
- Activity timeline (users active over time)
- Match statistics
- Peak usage times

---

## Implementation Order

### Step 1: Database Schema (30-45 min)
1. Update `schema.prisma` with new models:
   - `UserSession` model
   - `Match` model (with session tracking fields)
   - `UserActivity` model
2. Create migration
3. Run migration

### Step 2: Session Management (1-2 hours)
1. Create session API routes (`/api/session/start`, `/api/session/end`, `/api/session/current`)
2. Implement session creation and tracking logic
3. Add session validation middleware
4. Test session lifecycle (start → active → end)

### Step 3: Activity Tracking (1-2 hours)
1. Create activity API routes
2. Add activity update on match page load/leave
3. Create activity stats endpoint
4. Test activity tracking

### Step 4: WebSocket Server Setup (2-3 hours)
1. Install Socket.io
2. Create Socket.io server route
3. Set up connection handling
4. Add basic event handlers (connect, disconnect)
5. Integrate session management with WebSocket connections

### Step 5: Matching Queue with Duplicate Prevention (2-3 hours)
1. Implement queue data structure (in-memory or Redis)
2. Create matching algorithm with duplicate prevention:
   - Load user's session and `matchedUserIds`
   - Filter queue to exclude previously matched users
   - Implement bidirectional check (user A matched with B, so B can't match with A)
3. Add join/leave queue handlers
4. Update session `matchedUserIds` when match is found
5. Test matching logic and verify no duplicates in same session

### Step 6: WebRTC Integration (3-4 hours)
1. Set up WebRTC signaling via WebSocket
2. Create `useWebRTC` hook
3. Integrate with match page
4. Test video call flow

### Step 7: Match Database Integration (1-2 hours)
1. Create match records on match found
2. Update match status during call
3. Store call duration
4. Create match history API

### Step 8: Flagging/Reporting System (2-3 hours)
1. Create Flag model and migration
2. Create flagging API endpoints (`POST /api/flags`, `GET /api/flags`)
3. Implement immediate save on flag button click (before modal)
4. Create FlagModal component with reason input
5. Add flag button to call controls
6. Integrate with match page
7. Test flagging flow (immediate save → modal → reason submission)
8. Add admin endpoints for reviewing flags (optional for MVP)

### Step 9: Polish & Error Handling (2-3 hours)
1. Add reconnection logic
2. Handle edge cases (user disconnects, etc.)
3. Add loading states
4. Add error messages
5. Test end-to-end

---

## Technical Decisions

### WebRTC Library Choice
- **Option A**: Native WebRTC API (more control, more code)
- **Option B**: `simple-peer` library (easier, less control)
- **Recommendation**: Start with `simple-peer` for faster development

### Queue Storage
- **Option A**: In-memory (simple, but lost on server restart)
- **Option B**: Redis (persistent, scalable)
- **Recommendation**: Start with in-memory, migrate to Redis later if needed

### Activity Tracking Granularity
- **Option A**: Real-time updates (more accurate, more DB writes)
- **Option B**: Periodic snapshots (less accurate, fewer writes)
- **Recommendation**: Hybrid - real-time for current status, periodic snapshots for history

---

## Security Considerations

1. **WebSocket Authentication**
   - Verify session token on connection
   - Reject unauthorized connections

2. **Rate Limiting**
   - Limit match requests per user
   - Prevent queue spam

3. **Match Validation**
   - Verify users exist and are onboarded
   - Prevent self-matching
   - Check for blocked users
   - Validate session IDs to prevent session hijacking
   - Ensure session belongs to authenticated user

4. **WebRTC Security**
   - Use TURN/STUN servers for NAT traversal
   - Validate room IDs
   - Prevent unauthorized room access

5. **Flagging Security**
   - Verify user is in an active call with flagged user before allowing flag
   - Prevent self-flagging
   - Rate limit flag submissions (e.g., max 5 flags per hour per user)
   - Validate matchId belongs to the user making the flag
   - Sanitize reason text to prevent XSS
   - Log all flag submissions for audit trail

---

## Testing Strategy

1. **Unit Tests**
   - Matching algorithm
   - Activity tracking logic
   - Session management (create, update, end)
   - Duplicate prevention logic
   - Flagging logic (immediate save, reason validation)

2. **Integration Tests**
   - WebSocket connection flow
   - Match creation flow
   - WebRTC signaling flow
   - Session-based duplicate prevention
   - Flag creation flow (immediate save → reason submission)

3. **Manual Testing**
   - Two browser windows for end-to-end testing
   - Test disconnect scenarios
   - Test multiple concurrent matches
   - **Test duplicate prevention**: Match user A with user B, then try to match again in same session (should fail)
   - Test new session allows re-matching with previously matched users
   - **Test flagging**: 
     - Click flag button → Verify immediate save to DB
     - Enter reason → Verify update to flag record
     - Verify flag appears in admin view
     - Test rate limiting (try to flag multiple times)
     - Test self-flagging prevention

---

## Future Enhancements (Post-MVP)

1. **STUN/TURN Servers** for better NAT traversal
2. **Screen sharing** support
3. **Text chat** during video calls
4. **Match preferences** (filter by seniority, topics)
5. **Match history** UI
6. **Activity analytics dashboard**
7. **Push notifications** for match found
8. **Mobile support** (responsive design)

---

## Questions to Resolve

1. **STUN/TURN Servers**: Do we need them initially, or can we use free public STUN servers?
2. **Activity History Retention**: How long to keep activity logs? (GDPR considerations)
3. **Match History**: Should users see their match history, or keep it anonymous?
4. **Concurrent Matches**: Can a user be in multiple matches simultaneously? (Probably no)
5. **Queue Timeout**: How long should a user wait before giving up? (Show message?)
6. **Session Duration**: Should sessions have a maximum duration? (e.g., 2 hours, then auto-end)
7. **Session Persistence**: Should sessions survive page refresh, or start fresh? (Recommend: start fresh for simplicity)
8. **Flagging Behavior**: Should flagging automatically end the call, or allow user to continue? (Recommend: auto-end for safety)
9. **Flagging UI**: Should flag button be always visible or hidden in a menu? (Recommend: visible but styled as warning/alert)
10. **Flag Review**: Who reviews flags? (Admin dashboard needed, or automated actions?)

---

## Estimated Timeline

- **Step 1**: 30-45 min (Database Schema)
- **Step 2**: 1-2 hours (Session Management)
- **Step 3**: 1-2 hours (Activity Tracking)
- **Step 4**: 2-3 hours (WebSocket Server Setup)
- **Step 5**: 2-3 hours (Matching Queue with Duplicate Prevention)
- **Step 6**: 3-4 hours (WebRTC Integration)
- **Step 7**: 1-2 hours (Match Database Integration)
- **Step 8**: 2-3 hours (Flagging/Reporting System)
- **Step 9**: 2-3 hours (Polish & Error Handling)
- **Total**: ~15-23 hours of development

---

## Next Steps

1. **Review this plan** and confirm approach
2. **Decide on technical choices** (WebRTC library, queue storage)
3. **Start with Phase 1** (Database schema)
4. **Iterate and test** each phase before moving to next

