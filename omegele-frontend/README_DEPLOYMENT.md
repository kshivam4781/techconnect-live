# Deployment Guide for techconnect-live

## Quick Reference

- **Railway URL**: https://techconnect-live-production.up.railway.app
- **GitHub Repo**: https://github.com/kshivam4781/techconnect-live.git
- **Code Folder**: `omegele-frontend/`

## Railway Setup

### 1. Configure Root Directory

In Railway dashboard:
1. Go to your service → **Settings**
2. Find **Root Directory**
3. Set to: `omegele-frontend`
4. Save

This tells Railway to run all commands from the `omegele-frontend/` folder.

### 2. Environment Variables

Set these in Railway → Variables:

```bash
DATABASE_URL=<your-supabase-url>
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://techconnect-live-production.up.railway.app
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
NODE_ENV=production
HOSTNAME=0.0.0.0
```

### 3. GitHub OAuth

Update callback URL to:
```
https://techconnect-live-production.up.railway.app/api/auth/callback/github
```

## Deployment Process

1. **Make changes locally** in `omegele-frontend/`
2. **Commit and push** from repo root:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. **Railway auto-deploys** (if connected to GitHub)
4. **Check logs** in Railway dashboard

## First Time Setup

After connecting Railway to GitHub:

1. **Set Root Directory** to `omegele-frontend`
2. **Set Environment Variables**
3. **Deploy** (automatic on push)
4. **Run Migrations**:
   ```bash
   railway run cd omegele-frontend && npm run migrate
   ```

## Testing

Visit: https://techconnect-live-production.up.railway.app

Test:
- ✅ Sign in with GitHub
- ✅ Onboarding flow
- ✅ Matching (open two browser windows)
- ✅ Video calls
- ✅ Flagging system

## Files Structure

```
techconnect-live/              ← GitHub repo root
└── omegele-frontend/          ← Your code (Railway root directory)
    ├── src/                   ← Frontend + Backend
    ├── prisma/                ← Database schema
    ├── server.ts              ← Custom server
    └── package.json           ← Dependencies
```

## Need Help?

- See `RAILWAY_SETUP.md` for detailed setup
- See `DEPLOYMENT_STEPS.md` for step-by-step guide
- Check Railway logs for errors

