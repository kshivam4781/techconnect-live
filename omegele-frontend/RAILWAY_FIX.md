# Fix Railway Build Error

## Problem
Railway is trying to `cd omegele-frontend` but the directory doesn't exist in the build context.

## Solution: Set Root Directory in Railway

### Step 1: Set Root Directory in Railway Dashboard

1. Go to Railway dashboard
2. Select your service (`techconnect-live-production`)
3. Click **Settings** tab
4. Scroll down to **Root Directory**
5. Set it to: `omegele-frontend`
6. Click **Save**

This tells Railway to:
- Change into `omegele-frontend/` directory before running any commands
- Use `package.json` from that folder
- Build from that directory

### Step 2: Update railway.json (Already Done)

I've updated `railway.json` to remove the `cd` commands since Railway will automatically be in the `omegele-frontend/` directory when Root Directory is set.

**Before:**
```json
"buildCommand": "cd omegele-frontend && npm run build && npx prisma generate"
```

**After:**
```json
"buildCommand": "npm run build && npx prisma generate"
```

### Step 3: Commit and Push

```bash
git add omegele-frontend/railway.json
git commit -m "Fix Railway build: remove cd commands, use root directory"
git push origin main
```

### Step 4: Redeploy

Railway will automatically redeploy. The build should now work because:
- Railway changes to `omegele-frontend/` directory (via Root Directory setting)
- Runs `npm run build` from that directory
- Runs `npx prisma generate` from that directory
- Starts with `npm run start` from that directory

## Alternative: If Root Directory Setting Doesn't Work

If Railway doesn't have a Root Directory setting, you can create a `Dockerfile` in the repo root:

```dockerfile
FROM node:18

WORKDIR /app/omegele-frontend

COPY omegele-frontend/package*.json ./
RUN npm ci

COPY omegele-frontend/ ./

RUN npm run build
RUN npx prisma generate

CMD ["npm", "run", "start"]
```

But the Root Directory setting is the cleaner solution.

## Verify

After setting Root Directory and pushing:
1. Check Railway logs
2. Should see: `npm run build` running successfully
3. Should see: `npx prisma generate` running
4. Should see: `> Ready on http://0.0.0.0:PORT`

