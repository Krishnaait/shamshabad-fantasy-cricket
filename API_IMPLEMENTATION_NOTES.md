# Cricket API Implementation Study - From PDF Guide

## Key Findings from PDF Documentation

### 1. Real-Time Match Data Fetching

**Cricket API Endpoints:**
- `eCricScore` - Current and upcoming matches with basic details
- `matches` - Comprehensive list of all matches
- `match_info` - Detailed information for a single match
- `match_squad` - List of players for both teams
- `match_scorecard` - Detailed scorecard with batting/bowling stats
- `match_points` - Fantasy points for each player

**Match States (ms field):**
- `fixture` - Upcoming matches
- `live` - Live matches for real-time updates
- `result` - Completed matches

### 2. API Base URL & Key
```
Base URL: https://api.cricapi.com/v1/
API Key: 1a822521-d7e0-46ff-98d3-3e51020863f3 (Paid - CricketData U)
```

### 3. Auto-Refresh Strategy
- Revalidate every 60 seconds for general data
- **15-second refresh for live matches** (user requirement)
- Use Next.js `next: { revalidate: 15 }` for ISR

### 4. Response Structure

**eCricScore Response:**
```json
{
  "id": "match-uuid",
  "dateTimeGMT": "2025-01-03T10:30:00Z",
  "matchType": "t20",
  "status": "human-readable status",
  "ms": "live|fixture|result",
  "t1": "Team 1 Name",
  "t2": "Team 2 Name",
  "t1img": "team1-logo-url",
  "t2img": "team2-logo-url",
  "series": "Series Name"
}
```

**Match Points Response:**
```json
{
  "innings": [
    {
      "inning": "Team Inning 1",
      "batting": [
        {
          "id": "player-uuid",
          "name": "Player Name",
          "points": 25
        }
      ],
      "bowling": [
        {
          "id": "player-uuid",
          "name": "Player Name",
          "points": 28
        }
      ]
    }
  ]
}
```

### 5. Implementation Phases

**Phase 1: API Client Module**
- Create `server/cricket-api.ts` with reusable functions
- Handle API key management and error handling
- Implement data parsing and caching

**Phase 2: tRPC Procedures**
- Create procedures for fetching matches by status
- Implement countdown timer logic
- Add real-time score updates

**Phase 3: Frontend Components**
- Live Matches section with auto-refresh every 15 seconds
- Upcoming Matches section with countdown timers
- Completed Matches section with final scores

**Phase 4: Auto-Refresh Mechanism**
- Use `setInterval` for 15-second polling
- Implement React hooks for data management
- Handle loading and error states

### 6. Key Implementation Details

**Countdown Timer:**
- Calculate time until match start
- Display in HH:MM:SS format
- Update every second

**Live Score Updates:**
- Fetch match_scorecard every 15 seconds
- Fetch match_points for fantasy calculations
- Show batting/bowling performance in real-time

**Completed Matches:**
- Fetch match_points for final scores
- Display match result and statistics
- Show player performance summary

### 7. Database Schema Integration

From PDF guide, schema includes:
- `users` - User accounts
- `user_teams` - Fantasy teams created by users
- `team_players` - Players in each team
- `contests` - Fantasy contests
- `contest_entries` - User entries in contests

### 8. Error Handling

- Graceful fallback if API is unavailable
- Retry logic with exponential backoff
- User-friendly error messages
- Loading states during data fetch

### 9. Performance Optimization

- Cache API responses where appropriate
- Lazy load match details
- Implement pagination for match lists
- Use React.memo for expensive components

### 10. Timezone Handling

- Store all times in UTC
- Convert to user's local timezone for display
- Use Asia/Kolkata for Indian users
- Format: `new Date(utcTimestamp).toLocaleString()`
