# Quick Start: Deploy to Railway

## 🎯 What Goes Where - Simple Answer

### ✅ **Single Repository (Everything Together)**
Push your entire `omegele-frontend/` folder to GitHub. It contains:
- Frontend (React/Next.js pages)
- Backend (API routes)
- WebSocket server (Socket.io)
- Database schema (Prisma)

### ✅ **Single Railway Service**
Deploy everything as **ONE service** on Railway. Railway will:
- Run `npm install` (installs dependencies)
- Run `npm run build` (builds Next.js)
- Run `npm run start` (starts server.ts with Socket.io)

### ✅ **External Services (Already Set Up)**
- **Database**: Supabase PostgreSQL (external, already configured)
- **OAuth**: GitHub (external, you configure)
- **Optional**: Redis (add later if needed for scaling)

## 📦 What I've Prepared

1. ✅ **server.ts** - Updated for Railway (binds to 0.0.0.0)
2. ✅ **railway.json** - Railway configuration
3. ✅ **package.json** - Added production scripts
4. ✅ **.gitignore** - Excludes sensitive files
5. ✅ **.env.example** - Template for environment variables

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
cd omegele-frontend
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Create Railway Project
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository

### 3. Set Environment Variables
In Railway dashboard → Variables:

```
DATABASE_URL=postgresql://postgres:RightWing%402026@db.ebbxawwtvsjbswdpmbip.supabase.co:5432/postgres
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.railway.app
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
NODE_ENV=production
HOSTNAME=0.0.0.0
```

### 4. Update GitHub OAuth
GitHub → Settings → Developer settings → OAuth Apps:
- Callback URL: `https://your-app.railway.app/api/auth/callback/github`

### 5. Deploy
Railway auto-deploys when you push to GitHub!

### 6. Run Migrations
After first deploy:
```bash
railway run npm run migrate
```
Or use Railway dashboard → Deployments → Run Command

## ✅ That's It!

Your app will be live at: `https://your-app.railway.app`

## 📋 Architecture Summary

```
GitHub Repo (omegele-frontend/)
    ↓
Railway Service (Single Service)
    ├── Frontend (Next.js pages)
    ├── Backend API (Next.js API routes)
    └── WebSocket (Socket.io)
         ↓
    Supabase PostgreSQL (External Database)
```

**Everything in one place = Simple deployment!**

## 🔍 Need More Details?

- See `DEPLOYMENT_STEPS.md` for detailed walkthrough
- See `ARCHITECTURE.md` for technical details
- See `DEPLOYMENT_GUIDE.md` for production considerations

