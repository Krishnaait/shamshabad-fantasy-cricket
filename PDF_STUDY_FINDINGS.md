# PDF Study Findings - Complete Implementation Guide

## Key Insights from PDF

### 1. **Website Structure (Part 5)**
The website should have:
- **Header Component** - Navigation with logo, links, auth buttons
- **Footer Component** - Quick links, legal pages, social media
- **Homepage** - Hero section + Match sections + Featured contests
- **Dashboard Page** - User dashboard with content placeholder
- **Matches Page** - Live, Upcoming, Completed match sections
- **Team Creation Page** - Complex UI for player selection

### 2. **Match Display Architecture (Part 5)**
Homepage structure:
```
<Header />
<main>
  <Hero section with title>
  <FeaturedContestSection />
  <LiveMatchesSection />
  <UpcomingMatchesSection />
  <CompletedMatchesSection />
</main>
<Footer />
```

### 3. **Cricket API Usage (Part 8)**
**Live Score Page Implementation:**
- Fetch match data from `/api/cricscore?matchId={matchId}`
- Auto-refresh every 30 seconds using `setInterval(fetchScore, 30000)`
- Display: Team names (t1, t2), Score (s), Status (ar)
- Toggle auto-refresh on/off with button

**Key API Fields:**
- `t1` - Team 1 name
- `t2` - Team 2 name
- `s` - Current score
- `ar` - Match status/result
- `ms` - Match status (fixture/live/result)

### 4. **Contest Sync System (Part 8)**
**Contest Sync API Logic:**
- Filter matches by status: `ms === "fixture"` (upcoming), `ms === "live"`, `ms === "result"`
- Auto-create contests for new upcoming matches
- Update contest status when match status changes
- Calculate fantasy points for completed matches

**Key Logic:**
```typescript
const upcomingMatchIds = matches.filter(m => m.ms === "fixture").map(m => m.id);
const liveMatchIds = matches.filter(m => m.ms === "live").map(m => m.id);
const completedMatchIds = matches.filter(m => m.ms === "result").map(m => m.id);

// Update contests based on match status
if (liveMatchIds.length > 0) {
  await db.update(contests).set({ status: "live" }).where(inArray(contests.matchId, liveMatchIds));
}
if (completedMatchIds.length > 0) {
  await db.update(contests).set({ status: "completed" }).where(inArray(contests.matchId, completedMatchIds));
}
```

### 5. **Cron Job for Contest Sync (Part 8)**
- Create endpoint: `/api/cron/sync-contests`
- Requires authorization header with CRON_SECRET
- Runs automatically to sync contest statuses
- Calculates points for completed matches

### 6. **Authentication Flow**
- Header should show different UI based on auth state
- Unauthenticated: Show Login/Register buttons
- Authenticated: Show user profile dropdown
- All CTA buttons should redirect to login if not authenticated

### 7. **Dynamic Content Requirements**
**Before Login (Unauthenticated):**
- Show all match sections (Live, Upcoming, Completed)
- CTA buttons: "Create Team" → Redirect to login
- "Join Contest" → Redirect to login
- Show login/register in header

**After Login (Authenticated):**
- Show all match sections with full functionality
- CTA buttons: "Create Team" → Navigate to team builder
- "Join Contest" → Open contest modal
- Show user profile in header

### 8. **Key Components to Create**
1. **Header** - Auth-aware navigation
2. **Footer** - Static footer with links
3. **LiveMatchesSection** - Display live matches
4. **UpcomingMatchesSection** - Display upcoming with countdown
5. **CompletedMatchesSection** - Display completed matches
6. **FeaturedContestsSection** - Display available contests
7. **Dashboard** - User dashboard
8. **TeamCreation** - Complex team builder UI

### 9. **API Endpoints to Implement**
- `GET /api/cricscore?matchId={id}` - Live score
- `GET /api/contests/sync` - Sync contest statuses
- `GET /api/cron/sync-contests` - Cron job endpoint
- Team creation endpoint (already exists)

### 10. **Critical Implementation Notes**
- **Auto-refresh**: Use 30-second intervals for live scores
- **Match Status**: Use `ms` field to determine live/fixture/result
- **Contest Sync**: Should run automatically via cron
- **Point Calculation**: Complex logic requiring detailed scorecard data
- **Dynamic UI**: All buttons must check auth state before action

## Issues to Fix

1. **API Timeout**: Current implementation tries to fetch from 100 series sequentially
   - **Solution**: Use fast caching with 5-minute TTL
   - **Solution**: Fetch only current matches + next 5 series

2. **Match Display**: Showing 0 matches
   - **Solution**: Use correct API response fields (ms, t1, t2, s, ar)
   - **Solution**: Implement proper filtering by status

3. **Dynamic Content**: Not showing different UI before/after login
   - **Solution**: Use useAuth() hook to check authentication
   - **Solution**: Conditionally render CTA buttons

4. **CTA Buttons**: Not redirecting to login
   - **Solution**: Check auth state in button onClick
   - **Solution**: Redirect to /login if not authenticated
