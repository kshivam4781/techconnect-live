# Testing Checklist

## Prerequisites
- ✅ Server running on http://localhost:3000
- ✅ Database connected and migrations applied
- ✅ User account created and onboarded

## Test Scenarios

### 1. Session Management
- [ ] Start a session via `/api/session/start`
- [ ] Check current session via `/api/session/current`
- [ ] End session via `/api/session/end`

### 2. Activity Tracking
- [ ] Update activity status via `/api/activity/update`
- [ ] Check activity stats via `/api/activity/stats`

### 3. Matching Flow (Single User)
- [ ] Navigate to `/match` page
- [ ] Click "Video Call" or "Text Chat"
- [ ] Verify "Finding your match..." screen appears
- [ ] Verify timer is counting up

### 4. Matching Flow (Two Users)
- [ ] Open two browser windows/tabs
- [ ] Sign in with different accounts in each
- [ ] Both users click "Start" (same mode)
- [ ] Verify both users get matched
- [ ] Verify match record created in database
- [ ] Verify both users transition to "in-call" state

### 5. Video Call (if VIDEO mode)
- [ ] Verify local video stream appears
- [ ] Verify remote video stream appears (after match)
- [ ] Test mute/unmute button
- [ ] Test video on/off button
- [ ] Verify WebRTC connection established

### 6. Call Controls
- [ ] Test "Skip" button (should end call with SKIPPED status)
- [ ] Test "End Call" button (should end call with ENDED status)
- [ ] Verify call duration is tracked
- [ ] Verify match status updated in database

### 7. Flagging/Reporting
- [ ] During an active call, click flag button
- [ ] Verify flag is immediately saved to database (check DB)
- [ ] Fill out flag modal with reason
- [ ] Submit flag
- [ ] Verify flag record updated with reason
- [ ] Verify call ends after flagging

### 8. Duplicate Prevention
- [ ] User A matches with User B
- [ ] End the call
- [ ] User A starts searching again
- [ ] Verify User A does NOT match with User B again (in same session)
- [ ] Start a new session for User A
- [ ] Verify User A can now match with User B again

### 9. Match History
- [ ] Query matches via `/api/matches`
- [ ] Verify all matches appear with correct timeline
- [ ] Check match details via `/api/matches/[matchId]`
- [ ] Verify match statistics via `/api/matches/stats`

### 10. Error Handling
- [ ] Disconnect during matching (should handle gracefully)
- [ ] Disconnect during call (should update match status)
- [ ] Try to flag without active match (should fail)
- [ ] Try to start match without session (should create session)

## Database Checks

After testing, verify in database:
- [ ] UserSession records created with correct `matchedUserIds`
- [ ] Match records have correct `matchedAt`, `startedAt`, `endedAt`
- [ ] Match records have correct `duration` calculated
- [ ] Flag records have correct `flaggedAt` timestamp
- [ ] UserActivity records show status changes

## Known Issues to Watch For

1. **Socket Connection**: If socket doesn't connect, check browser console for errors
2. **WebRTC**: May need to allow camera/mic permissions
3. **Matching**: If no matches found, check that both users are in queue and have compatible modes
4. **Database**: Ensure Prisma client is generated (`npx prisma generate`)

## Quick Test Commands

```bash
# Check if server is running
curl http://localhost:3000/api/activity/stats

# Check session (requires auth)
# Use browser dev tools Network tab to test authenticated endpoints
```

