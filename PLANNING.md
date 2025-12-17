## Tech Professional Omegle – Planning Document

### Overview

You’re building a tech-focused “Omegle” for professionals, with **mandatory authentication via LinkedIn or GitHub** to ensure quality and accountability. This document outlines the product and technical plan in phases.

---

## Phase 1: Vision, Scope, and Requirements

- **Target users**
  - Tech professionals, students, founders, recruiters, content creators.
  - LinkedIn for broader professionals, GitHub for developers.

- **Core value proposition**
  - 1:1 random video/audio/text chats with **verified professional profiles**.
  - Optional profile enrichment (headline, skills, tech stack, interests).

- **Feature set (v1)**
  - OAuth login with LinkedIn and GitHub (no anonymous mode in v1).
  - Simple onboarding: choose topics/skills, seniority level, languages, time-zone.
  - Queue + matching for 1:1 sessions (text + optional video).
  - Basic reporting/blocking.
  - Minimal profile view (LinkedIn headline / GitHub bio, avatar, name).

- **Non-goals / v2 ideas**
  - No groups, no complex gamification, no advanced AI matching in v1.
  - V2: AI-based matching, conversation prompts, follow-up connection tools.

---

## Phase 2: System Architecture & Tech Stack

- **High-level architecture**
  - **Client**: Web app (React/Next.js or similar).
  - **Backend API**: Node.js/Express or NestJS (or Django/FastAPI if you prefer Python).
  - **Real-time layer**: WebSockets (Socket.io) for matching + in-chat messages; WebRTC for video.
  - **Database**: PostgreSQL (users, sessions, matches, bans, interests).
  - **Cache / queues**: Redis for matchmaking queues, rate limiting.
  - **Auth & identity**: OAuth 2.0 / OpenID Connect with LinkedIn and GitHub.

- **Key services**
  - `AuthService`: OAuth flows, session management, token refresh, user linking (same email).
  - `UserService`: profiles, preferences, moderation state.
  - `MatchService`: matchmaking algorithm, queues, timeouts.
  - `ModerationService`: reports, bans, abuse detection hooks.
  - `AnalyticsService`: basic metrics (matches/day, avg session length).

- **Security & compliance considerations**
  - HTTPS everywhere, secure cookies, JWT or opaque tokens.
  - Data minimization from LinkedIn/GitHub (only what you truly need).
  - GDPR-friendly: data deletion/export in future phases.

---

## Phase 3: Authentication & Identity (Solving Omegle’s Problem)

- **OAuth integration**
  - Register apps with LinkedIn and GitHub.
  - Implement **backend-only** OAuth (no secrets in front-end).
  - On first login:
    - Fetch minimal profile: ID, name, avatar URL, headline/bio, primary email.
    - Create user record with provider ID, provider type, and normalized email.
  - On repeat login:
    - Look up user by provider ID or verified email.
    - Handle linking if the same user logs in with both LinkedIn and GitHub.

- **Session management**
  - Use secure HTTP-only cookies for session IDs or JWT access/refresh tokens.
  - Session expiration, refresh logic, and logout endpoints.

- **Trust & verification**
  - Mark users with:
    - `verified_linkedin = true/false`
    - `verified_github = true/false`
  - Use these flags in the matching logic (e.g., prefer LinkedIn-verified for “career” chats).

- **Abuse prevention baseline**
  - Require successful OAuth to enter queues.
  - Store minimal logs of connections (who matched whom, when, duration).
  - Implement IP and account-level throttling & rate limits.

---

## Phase 4: User Experience & Flows

- **Onboarding flow**
  - Step 1: Choose login method (LinkedIn / GitHub).
  - Step 2: Minimal profile confirmation screen:
    - Show imported name, avatar, headline/bio.
    - Ask for: topics/interests (tags), languages, time zone, seniority.
  - Step 3: Safety + community guidelines acknowledgment.

- **Home / lobby**
  - “Start conversation” button.
  - Select: topic (e.g., “Backend”, “AI/ML”, “Career advice”, “Startup”), mode (text-first, video-enabled).
  - Show estimated wait time and current online count.

- **In-call experience**
  - Lightweight UI: participant video tiles (or chat), topic label, timer.
  - Controls: skip/next, mute, disable video, report, block, end.
  - Optional “Share LinkedIn/GitHub profile link” button (controlled, explicit).

- **Post-call**
  - Quick feedback: thumbs up/down, optional tags (helpful, spam, rude).
  - Use feedback to feed moderation and future matching.

---

## Phase 5: Matching & Real-Time Communication

- **Matching logic (v1)**
  - Basic algorithm:
    - Queue users by desired topic, language, and optionally seniority band.
    - Try matching:
      - Same topic → similar seniority → overlapping time zones.
    - Fallbacks after time threshold (relax constraints gradually).

- **Real-time infrastructure**
  - WebSocket server handling:
    - User online status.
    - Join/leave queue events.
    - Match found events (room ID and peer info).
  - WebRTC signaling via WebSockets:
    - Exchange offers/answers/ICE candidates.

- **Resilience**
  - Timeouts for unanswered match offers.
  - Detect disconnects and re-queue user (if appropriate).
  - Graceful handling when one user leaves early.

---

## Phase 6: Moderation, Safety & Community Guidelines

- **Policy definition**
  - Clear rules: no harassment, hate, spam, explicit content, scams.
  - Transparent consequences: temporary bans, permanent bans.

- **User tools**
  - Report button with reasons (harassment, spam, nudity, etc.).
  - One-click block; blocked users never matched again.
  - Optional text/image/video filters (longer term).

- **Backend moderation features**
  - Moderation dashboard (admin-only) to:
    - View reports, user histories, ban/unban.
    - See patterns: high report rate per user/IP.

- **Technical safeguards (incremental)**
  - Rate limiting on skips, reports, messages.
  - Auto-flag accounts with high report ratio.
  - Potential AI or service integration later for content analysis.

---

## Phase 7: Analytics, Metrics & Feedback Loops

- **Core metrics**
  - DAU/WAU/MAU.
  - Number of matches, average session duration.
  - Queue wait times.
  - Report rate, block rate, ban rate.
  - Provider split: LinkedIn vs GitHub.

- **Product feedback**
  - In-app survey after N sessions (NPS-style).
  - “What did you want but didn’t get?” free-text feedback.

- **Continuous improvement**
  - Tune matching rules based on feedback and metrics.
  - Identify abuse vectors and patch them.

---

## Phase 8: Infrastructure, Deployment & Scaling

- **Initial deployment**
  - Single-region cloud (AWS/Azure/GCP).
  - Managed Postgres, managed Redis.
  - CI/CD pipeline for backend + frontend.
  - Domain, HTTPS, monitoring (logs, uptime, error tracking).

- **Scaling plan**
  - Horizontal scaling of real-time servers.
  - Sticky sessions or WebSocket-aware load balancer.
  - DB indexing and read replicas if needed.
  - Quotas and graceful degradation (e.g., temporary text-only mode under load).

---

## Phase 9: Growth, Partnerships & Monetization (Future)

- **Growth**
  - Integrations with LinkedIn posts, GitHub profiles (badges like “Available for tech chats”).
  - Community events: scheduled “office hours” with mentors, founders, etc.

- **Monetization options**
  - Freemium: basic random matching free, premium filters (by company, region, seniority).
  - Sponsored “rooms” or themed nights with partners.
  - Job/recruiter-focused premium tools (careful to avoid spam).

---

## Next Steps (Actionable)

- **Step 1**: Lock in stack choices (React/Next + Node/Nest + Postgres + Redis).
- **Step 2**: Implement **LinkedIn and GitHub OAuth** end-to-end with a barebones UI.
- **Step 3**: Build minimal queue + matching just for text chat.
- **Step 4**: Add video (WebRTC), then moderation tools and analytics.


