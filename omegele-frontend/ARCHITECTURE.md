# Architecture Overview

## Production Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Railway Service                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Next.js Application (Monolithic)           │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Frontend (React/Next.js)                   │  │  │
│  │  │  - Pages: /match, /onboarding, /profile    │  │  │
│  │  │  - Components: FlagModal, UserMenu          │  │  │
│  │  │  - Hooks: useSocket, useWebRTC              │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Backend API (Next.js API Routes)           │  │  │
│  │  │  - /api/session/*  → Session management     │  │  │
│  │  │  - /api/activity/* → Activity tracking     │  │  │
│  │  │  - /api/matches/*  → Match history          │  │  │
│  │  │  - /api/flags/*    → Flagging system        │  │  │
│  │  │  - /api/auth/*     → Authentication         │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  WebSocket Server (Socket.io)               │  │  │
│  │  │  - Real-time matching queue                 │  │  │
│  │  │  - WebRTC signaling                         │  │  │
│  │  │  - Match notifications                      │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  Custom Server (server.ts)                        │  │
│  │  - Runs Next.js + Socket.io together             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
           │
           │ HTTP/WebSocket
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Supabase PostgreSQL (Database)                 │   │
│  │  - Users, Sessions, Matches, Flags              │   │
│  │  - Already configured via DATABASE_URL          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  GitHub OAuth (Authentication)                   │   │
│  │  - User authentication                           │   │
│  │  - Configured via GITHUB_CLIENT_ID/SECRET      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  (Optional) Redis (Future Enhancement)          │   │
│  │  - Persistent matching queue                    │   │
│  │  - Currently using in-memory queue              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Component Locations

### Frontend Components
```
src/app/
├── match/page.tsx          → Main matching interface
├── onboarding/page.tsx     → User onboarding
├── profile/page.tsx        → User profile
└── page.tsx                → Homepage

src/components/
├── FlagModal.tsx           → Flagging/reporting modal
└── UserMenu.tsx            → User menu component

src/hooks/
├── useSocket.ts            → WebSocket connection hook
└── useWebRTC.ts           → WebRTC video call hook
```

### Backend API Routes
```
src/app/api/
├── session/
│   ├── start/route.ts      → Start new session
│   ├── end/route.ts        → End session
│   └── current/route.ts   → Get current session
├── activity/
│   ├── update/route.ts     → Update activity status
│   └── stats/route.ts     → Get activity statistics
├── matches/
│   ├── route.ts            → Get match history
│   ├── [matchId]/route.ts → Get specific match
│   └── stats/route.ts     → Get match statistics
├── flags/
│   ├── route.ts            → Create/get flags
│   └── [flagId]/route.ts  → Update flag
└── auth/
    └── [...nextauth]/route.ts → Authentication
```

### WebSocket Server
```
src/lib/socket/
├── handlers.ts             → Socket.io event handlers
├── matching.ts            → Matching queue logic
└── types.ts               → TypeScript types

server.ts                   → Custom server (Next.js + Socket.io)
```

### Database
```
prisma/
├── schema.prisma          → Database schema
└── migrations/            → Database migrations
```

## Data Flow

### Matching Flow
1. User clicks "Start" → Frontend calls `/api/session/start`
2. Session created in database
3. Frontend connects to WebSocket → `join-queue` event
4. User added to in-memory matching queue
5. Matching algorithm finds compatible user
6. Match created in database
7. Both users receive `match-found` event
8. Users join call → `call-started` event
9. WebRTC connection established
10. Call ends → `call-ended` event → Match updated in database

### Flagging Flow
1. User clicks flag button during call
2. Frontend immediately calls `/api/flags` (POST)
3. Flag saved to database with timestamp
4. Modal appears asking for reason
5. User submits reason → `/api/flags/[flagId]` (PATCH)
6. Flag updated with reason
7. Call optionally ends

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **WebSocket**: Socket.io 4.8
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (GitHub OAuth)
- **Video**: WebRTC (native browser API)
- **Deployment**: Railway
- **Runtime**: Node.js (via tsx)

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth encryption secret
- `NEXTAUTH_URL` - Your app URL
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

### Optional
- `PORT` - Server port (Railway sets automatically)
- `HOSTNAME` - Server hostname (default: 0.0.0.0)
- `NODE_ENV` - Environment (production/development)
- `REDIS_URL` - Redis connection (for future queue enhancement)

## Deployment Model

**Single Service Deployment:**
- Everything runs in one Railway service
- Next.js serves both frontend and API
- Socket.io runs alongside Next.js in same process
- No need to separate frontend/backend

**Why This Works:**
- Next.js is designed for full-stack apps
- Socket.io can run in same Node.js process
- Simpler deployment and scaling
- Lower latency (no network calls between frontend/backend)

**Future Scaling Options:**
- Add Redis for queue (if needed for high traffic)
- Add TURN server for WebRTC (if NAT traversal issues)
- Separate services only if needed (not required now)

