# LinkedIn OAuth Security Warning Fix

## Problem
Chrome was showing a "Dangerous site" warning when trying to log in with LinkedIn. This warning appears when Chrome detects potential security issues with a website.

## What Was Fixed

### 1. Added Security Headers
I've added comprehensive security headers to your Next.js application:

- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables browser XSS filtering
- **Content-Security-Policy (CSP)**: Restricts resource loading to prevent XSS attacks
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

### 2. Created Middleware
Added `src/middleware.ts` to:
- Enforce HTTPS redirects in production
- Add additional security headers as a middleware layer

### 3. Updated Next.js Config
Updated `next.config.ts` to include security headers for all routes.

## Files Changed

1. `next.config.ts` - Added security headers configuration
2. `src/middleware.ts` - Created new middleware for HTTPS enforcement and headers

## Additional Steps You May Need to Take

### 1. Verify LinkedIn OAuth App Configuration

Make sure your LinkedIn OAuth app has the correct redirect URI:

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Select your app
3. Go to **Auth** tab
4. Under **Redirect URLs**, ensure you have:
   ```
   https://vinamah.com/api/auth/callback/linkedin
   ```
5. Save changes

### 2. Check Google Safe Browsing Status

If the warning persists after deploying the security headers, your site might be flagged by Google Safe Browsing. To check and request a review:

1. Visit: https://transparencyreport.google.com/safe-browsing/search?url=vinamah.com
2. If flagged, you can request a review at: https://search.google.com/search-console

### 3. Verify SSL Certificate

Ensure your SSL certificate is valid:
- Visit: https://www.ssllabs.com/ssltest/analyze.html?d=vinamah.com
- Check for any certificate issues

### 4. Deploy the Changes

After these changes are deployed:

```bash
# Commit and push the changes
git add .
git commit -m "Add security headers to fix Chrome security warning"
git push origin main
```

Railway will automatically redeploy. After deployment, wait a few minutes and try the LinkedIn login again.

### 5. Clear Browser Cache

After deployment, users may need to:
- Clear browser cache
- Try in incognito/private mode
- Wait a few hours for Chrome's Safe Browsing cache to update

## Testing

After deployment, test:
1. Visit https://vinamah.com
2. Try logging in with LinkedIn
3. Check browser console for any CSP violations
4. Verify the callback URL works correctly

## If Warning Persists

If the warning still appears after deploying these changes:

1. **Check Safe Browsing**: The site might be flagged by Google's Safe Browsing service
2. **Request Review**: Submit your site for review at Google Search Console
3. **Check Certificate**: Verify SSL certificate is valid and not expired
4. **Wait**: Chrome's Safe Browsing cache can take 24-48 hours to update

## Security Headers Explained

The Content-Security-Policy allows:
- ✅ LinkedIn OAuth (`https://www.linkedin.com`, `https://api.linkedin.com`)
- ✅ Google Analytics (if you're using it)
- ✅ WebSocket connections (for Socket.io)
- ✅ Media streams (for WebRTC video calls)
- ✅ Self-hosted resources

This should resolve the Chrome security warning while maintaining all functionality.

