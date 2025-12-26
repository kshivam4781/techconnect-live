# Railway Environment Variables Fix

## Problem
Some environment variables are empty in Railway, which will cause runtime errors.

## Required Environment Variables

Set these in Railway dashboard → Variables:

```
DATABASE_URL=postgresql://postgres:password@host:5432/database
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://vinamah.com
HOSTNAME=0.0.0.0
NODE_ENV=production
```

## Critical: Set These Values

### 1. NEXTAUTH_URL
**MUST BE SET TO:**
```
https://vinamah.com
```

**Why:** NextAuth needs this to generate correct callback URLs. Without it, authentication won't work. This should match your production domain.

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

