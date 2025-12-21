# Step-by-Step Deployment to Railway

## Prerequisites
- ✅ GitHub account
- ✅ Railway account (railway.app)
- ✅ Supabase database (already set up)
- ✅ GitHub OAuth app created

## Step 1: Prepare Code for Production

### 1.1 Update server.ts (Already done)
- Changed hostname to `0.0.0.0` for Railway

### 1.2 Create Railway config (Already done)
- `railway.json` created

### 1.3 Update package.json (Already done)
- Added `postinstall` script for Prisma
- Added `migrate` script

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
cd omegele-frontend
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Production-ready matching system"

# Create GitHub repository, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Set Up Railway Project

### 3.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your repository

### 3.2 Configure Environment Variables

In Railway dashboard, go to your service → Variables tab, add:

```
DATABASE_URL=postgresql://postgres:RightWing%402026@db.ebbxawwtvsjbswdpmbip.supabase.co:5432/postgres
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://your-app-name.railway.app
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
NODE_ENV=production
HOSTNAME=0.0.0.0
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3.3 Update GitHub OAuth Settings

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Edit your OAuth app
3. Update "Authorization callback URL" to:
   ```
   https://your-app-name.railway.app/api/auth/callback/github
   ```

## Step 4: Configure Railway Service

### 4.1 Build Settings
Railway should auto-detect, but verify:
- **Build Command**: `npm run build && npx prisma generate`
- **Start Command**: `npm run start`

### 4.2 Run Migrations
After first deploy, run migrations:
1. Go to Railway service → Deployments
2. Click on latest deployment → "View Logs"
3. Or use Railway CLI:
   ```bash
   railway run npm run migrate
   ```

## Step 5: Deploy

Railway will automatically:
1. Clone your repo
2. Install dependencies (`npm install`)
3. Run `postinstall` (generates Prisma client)
4. Build Next.js app (`npm run build`)
5. Start server (`npm run start`)

## Step 6: Verify Deployment

1. **Check Railway Logs**
   - Should see: `> Ready on http://0.0.0.0:PORT`
   - No errors about database connection

2. **Test Your App**
   - Visit your Railway URL
   - Test sign-in
   - Test matching (open two browser windows)

3. **Check Database**
   - Verify migrations ran
   - Check that tables exist

## Step 7: (Optional) Add Redis for Production Queue

### Why Redis?
- Current queue is in-memory (lost on server restart)
- Redis makes queue persistent and scalable

### Add Redis to Railway:
1. Railway dashboard → New → Add Redis
2. Get `REDIS_URL` from Redis service
3. Add to environment variables
4. Update matching code to use Redis (future enhancement)

## Troubleshooting

### Issue: Build fails
- Check Railway logs
- Verify all dependencies in `package.json`
- Ensure `tsx` is in dependencies (not just devDependencies)

### Issue: Database connection fails
- Verify `DATABASE_URL` is correct
- Check Supabase allows connections from Railway IPs
- Test connection locally first

### Issue: Socket.io not connecting
- Check `NEXTAUTH_URL` matches your Railway domain
- Verify CORS settings in `server.ts`
- Check browser console for WebSocket errors

### Issue: Migrations not running
- Run manually: `railway run npm run migrate`
- Or add to build script

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Environment variables set
- [ ] GitHub OAuth callback URL updated
- [ ] Migrations run successfully
- [ ] App accessible via Railway URL
- [ ] Sign-in works
- [ ] Matching works (test with two browsers)
- [ ] WebSocket connections work
- [ ] Database queries work

## Next Steps (Post-Deployment)

1. **Add Custom Domain** (Optional)
   - Railway → Settings → Domains
   - Add your domain
   - Update `NEXTAUTH_URL` and GitHub OAuth callback

2. **Set Up Monitoring**
   - Railway provides basic logs
   - Consider Sentry for error tracking

3. **Add Redis** (For production scale)
   - Add Redis service in Railway
   - Update matching queue to use Redis

4. **Set Up TURN Server** (For WebRTC)
   - Use Twilio, Cloudflare, or similar
   - Update WebRTC config

5. **Enable HTTPS**
   - Railway provides HTTPS automatically
   - Verify certificate is active

