# Railway Setup for techconnect-live

## Your Current Setup

- **Railway App**: `techconnect-live-production.up.railway.app`
- **GitHub Repo**: https://github.com/kshivam4781/techconnect-live.git
- **Code Location**: `omegele-frontend/` folder
- **Database**: Supabase PostgreSQL

## Railway Configuration

Since your code is in the `omegele-frontend/` subfolder, Railway needs to be configured to:

1. **Set Root Directory** in Railway dashboard
2. **Use correct build/start commands**

### Option 1: Set Root Directory in Railway (Recommended)

1. Go to Railway dashboard → Your service
2. Click **Settings** tab
3. Scroll to **Root Directory**
4. Set it to: `omegele-frontend`
5. Save

Then Railway will automatically:
- Run commands from `omegele-frontend/` directory
- Use `package.json` from that folder
- Build and start correctly

### Option 2: Use Custom Commands (If Root Directory doesn't work)

If Railway doesn't support root directory, update the build/start commands:

**Build Command:**
```bash
cd omegele-frontend && npm install && npm run build && npx prisma generate
```

**Start Command:**
```bash
cd omegele-frontend && npm run start
```

## Environment Variables in Railway

Make sure these are set in Railway dashboard → Variables:

```
DATABASE_URL=<your-supabase-connection-string>
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=https://techconnect-live-production.up.railway.app
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
```

**Important**: 
- `NEXTAUTH_URL` must match your Railway domain exactly
- No trailing slash: `https://techconnect-live-production.up.railway.app`

## GitHub OAuth Configuration

Update your GitHub OAuth app:

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Edit your OAuth app
3. Set **Authorization callback URL** to:
   ```
   https://techconnect-live-production.up.railway.app/api/auth/callback/github
   ```
4. Save

## Deployment Workflow

### 1. Make Changes Locally
```bash
cd omegele-frontend
# Make your changes
git add .
git commit -m "Your commit message"
```

### 2. Push to GitHub
```bash
# From root of repo (not omegele-frontend)
git push origin main
```

### 3. Railway Auto-Deploys
- Railway detects the push
- Runs build command
- Deploys automatically

### 4. Run Migrations (First Time or After Schema Changes)
```bash
# Using Railway CLI
railway run --service <your-service-name> cd omegele-frontend && npm run migrate

# Or in Railway dashboard:
# Deployments → Latest → Run Command → cd omegele-frontend && npm run migrate
```

## Verify Deployment

1. **Check Railway Logs**
   - Should see: `> Ready on http://0.0.0.0:PORT`
   - No database connection errors

2. **Test Your App**
   - Visit: https://techconnect-live-production.up.railway.app
   - Test sign-in
   - Test matching

3. **Check Database**
   - Verify tables exist in Supabase
   - Check that migrations ran

## Troubleshooting

### Issue: Build fails with "Cannot find module"
- **Solution**: Make sure Root Directory is set to `omegele-frontend` in Railway settings

### Issue: "Command not found: npm"
- **Solution**: Railway should auto-detect Node.js, but verify in Settings → Build

### Issue: Database connection fails
- **Solution**: 
  - Verify `DATABASE_URL` in Railway variables
  - Check Supabase allows connections from Railway IPs
  - Test connection string locally first

### Issue: Socket.io not connecting
- **Solution**:
  - Verify `NEXTAUTH_URL` matches your Railway domain exactly
  - Check CORS settings in `server.ts`
  - Check browser console for WebSocket errors

### Issue: GitHub OAuth not working
- **Solution**:
  - Verify callback URL in GitHub OAuth app matches Railway domain
  - Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Railway

## Quick Checklist

- [ ] Root Directory set to `omegele-frontend` in Railway (or custom commands configured)
- [ ] All environment variables set in Railway
- [ ] `NEXTAUTH_URL` = `https://techconnect-live-production.up.railway.app`
- [ ] GitHub OAuth callback URL updated
- [ ] Code pushed to GitHub
- [ ] Railway connected to GitHub repo
- [ ] Migrations run (if needed)
- [ ] App accessible at Railway URL
- [ ] Sign-in works
- [ ] Matching works

## Next Steps After Deployment

1. **Test Everything**
   - Sign in with GitHub
   - Complete onboarding
   - Test matching with two browsers
   - Test video calls
   - Test flagging

2. **Monitor Logs**
   - Check Railway logs for errors
   - Monitor database connections

3. **Set Up Custom Domain** (Optional)
   - Railway → Settings → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` and GitHub OAuth callback

