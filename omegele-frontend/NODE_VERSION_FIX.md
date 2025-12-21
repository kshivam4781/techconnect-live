# Fix Node.js Version Issue

## Problem
Railway is using Node.js 18, but Next.js 16 requires Node.js >= 20.9.0.

## Solution

I've added three files to force Railway to use Node.js 20:

1. **`.nvmrc`** - Specifies Node.js 20
2. **`nixpacks.toml`** - Explicitly tells Nixpacks to use Node.js 20
3. **`package.json` engines** - Specifies minimum Node.js version

## Files Created/Updated

### 1. `.nvmrc`
```
20
```

### 2. `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm-10_x", "openssl"]
```

### 3. `package.json` (updated)
Added engines field:
```json
"engines": {
  "node": ">=20.9.0",
  "npm": ">=10.0.0"
}
```

## Next Steps

1. **Commit and push:**
   ```bash
   git add omegele-frontend/.nvmrc omegele-frontend/nixpacks.toml omegele-frontend/package.json
   git commit -m "Fix: Use Node.js 20 for Next.js 16 compatibility"
   git push origin main
   ```

2. **Railway will automatically redeploy** with Node.js 20

3. **Verify in logs:**
   - Should see Node.js 20.x in build logs
   - Build should complete successfully

## Why This Works

- **`.nvmrc`**: Standard way to specify Node.js version (Railway/Nixpacks reads this)
- **`nixpacks.toml`**: Explicitly tells Nixpacks which Node.js version to use
- **`package.json` engines**: Documents the requirement and helps tools detect it

Railway/Nixpacks will prioritize `nixpacks.toml`, then `.nvmrc`, then `package.json` engines.

