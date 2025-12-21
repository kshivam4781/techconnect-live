# Production Deployment Guide

## Architecture Overview

### Current Setup (Monolithic Next.js App)
```
┌─────────────────────────────────────────┐
│         Railway Service                  │
│  ┌───────────────────────────────────┐  │
│  │  Next.js App (server.ts)          │  │
│  │  ├── Frontend (React/Next.js)      │  │
│  │  ├── API Routes (/api/*)          │  │
│  │  └── Socket.io Server              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │
           ├───> Supabase PostgreSQL (External)
           │    └── User data, matches, sessions, flags
           │
           └───> (Optional) Redis (For production queue)
                 └── Matching queue (currently in-memory)
```

### Components Breakdown

1. **Frontend** → `src/app/` (Next.js pages)
   - Match page, onboarding, profile, etc.
   - React components in `src/components/`
   - Hooks in `src/hooks/`

2. **Backend API** → `src/app/api/` (Next.js API routes)
   - `/api/session/*` - Session management
   - `/api/activity/*` - Activity tracking
   - `/api/matches/*` - Match history
   - `/api/flags/*` - Flagging system
   - `/api/auth/*` - Authentication

3. **WebSocket Server** → `src/lib/socket/` + `server.ts`
   - Real-time matching queue
   - WebRTC signaling
   - Match notifications

4. **Database** → Supabase PostgreSQL (External)
   - Already configured via `DATABASE_URL`
   - No changes needed

5. **Optional: Redis** → For production matching queue
   - Currently using in-memory queue
   - Can add Redis later for scalability

## Railway Deployment

### Step 1: Update Server for Production

The `server.ts` needs to bind to `0.0.0.0` instead of `localhost` for Railway.

### Step 2: Environment Variables

Set these in Railway dashboard:

**Required:**
- `DATABASE_URL` - Your Supabase PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your Railway app URL (e.g., `https://yourapp.railway.app`)
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `PORT` - Railway sets this automatically, but can override

**Optional:**
- `NODE_ENV=production`
- `REDIS_URL` - If you add Redis later

### Step 3: Railway Configuration

Railway will auto-detect Next.js, but we need to:
1. Use custom start command (our `server.ts`)
2. Run Prisma migrations on deploy
3. Build Next.js app

### Step 4: GitHub Repository Structure

```
omegele-frontend/          ← Push entire folder to GitHub
├── src/                   ← Frontend + Backend code
├── prisma/                ← Database schema & migrations
├── server.ts              ← Custom server with Socket.io
├── package.json           ← Dependencies
├── next.config.ts         ← Next.js config
└── railway.json           ← Railway config (we'll create)
```

## What Goes Where

### ✅ Single Repository (Current Setup)
- **Frontend**: `src/app/` (Next.js pages)
- **Backend API**: `src/app/api/` (Next.js API routes)
- **WebSocket**: `src/lib/socket/` + `server.ts`
- **Database**: Supabase (external, already configured)

### ✅ Single Railway Service
- Deploy everything as one service
- Railway runs `npm run start` which executes `server.ts`
- This starts both Next.js and Socket.io

### ✅ External Services
- **Database**: Supabase PostgreSQL (already set up)
- **Optional Redis**: Railway Redis addon (for production queue scaling)

## Production Improvements Needed

1. **Redis for Queue** (Recommended for production)
   - Currently: In-memory queue (lost on restart)
   - Production: Redis queue (persistent, scalable)
   - Can add later without breaking changes

2. **STUN/TURN Servers** (For WebRTC)
   - Currently: Free Google STUN servers
   - Production: Add TURN server (Twilio, Cloudflare, etc.)

3. **Environment Variables**
   - Move all secrets to Railway environment variables
   - Never commit `.env` files

4. **Error Monitoring**
   - Add Sentry or similar for production error tracking

5. **Logging**
   - Railway provides logs, but consider structured logging

## Deployment Checklist

- [ ] Update `server.ts` to bind to `0.0.0.0`
- [ ] Create `railway.json` for Railway config
- [ ] Create `.gitignore` (if not exists)
- [ ] Set environment variables in Railway
- [ ] Push to GitHub
- [ ] Connect Railway to GitHub repo
- [ ] Run Prisma migrations on Railway
- [ ] Test deployment

