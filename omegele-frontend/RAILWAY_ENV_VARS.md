# Railway Environment Variables Fix

## Problem
Some environment variables are empty in Railway, which will cause runtime errors.

## Required Environment Variables

Set these in Railway dashboard → Variables:

```
DATABASE_URL=postgresql://postgres.ebbxawwtvsjbswdpmbip:RightWing%402026@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
GITHUB_CLIENT_ID=Ov23lic2nlcrrq0iUZ6N
GITHUB_CLIENT_SECRET=92c83a648d8a3d3625d9c7133722d6c29af9b1c7
NEXTAUTH_SECRET=ec7adc6ba30a28abc8d0475265396427cca1ac1a6feb64a2edb86ccd21b48ea1
NEXTAUTH_URL=https://techconnect-live-production.up.railway.app
HOSTNAME=0.0.0.0
NODE_ENV=production
```

## Critical: Set These Values

### 1. NEXTAUTH_URL
**MUST BE SET TO:**
```
https://techconnect-live-production.up.railway.app
```

**Why:** NextAuth needs this to generate correct callback URLs. Without it, authentication won't work.

### 2. HOSTNAME
**SET TO:**
```
0.0.0.0
```

**Why:** Server needs to bind to 0.0.0.0 to accept connections from Railway's network.

### 3. NODE_ENV
**SET TO:**
```
production
```

**Why:** Tells Next.js to run in production mode (optimizations, no dev features).

## How to Set in Railway

1. Go to Railway dashboard
2. Select your service
3. Click **Variables** tab
4. For each empty variable:
   - Click **+ New Variable**
   - Enter the variable name
   - Enter the value
   - Click **Add**
5. Save

## After Setting Variables

Railway will automatically redeploy. The app should now work correctly.

## About the `--omit=dev` Warning

This is just a deprecation warning from npm. It's not an error - just npm telling you to use `--omit=dev` instead of `--production` flag. You can ignore it, or we can update the build command later if needed.

## Verify

After setting variables and redeploying:
1. Check Railway logs - should see server starting
2. Visit your app URL
3. Test sign-in - should work now

