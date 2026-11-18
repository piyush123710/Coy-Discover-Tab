# Coy — Discover Tab

A mobile-first, privacy-focused swipe discovery application built with **React (JSX)**, **Tailwind CSS**, **Motion**, **Axios**, **Node.js**, and **Express.js** for the **Coy SDE Intern Assignment**.

Coy’s core promise is double-opt-in privacy: incoming likes are stored strictly on the server and **never revealed** unless both users mutually like each other.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots & UI Walkthrough](#screenshots--ui-walkthrough)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Frontend & Backend Architecture](#frontend--backend-architecture)
  - [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Data Persistence & Privacy Model](#data-persistence--privacy-model)
- [Testing Checklist & Verification](#testing-checklist--verification)
- [GitHub Publishing Instructions](#github-publishing-instructions)

---

## Project Overview

This standalone application models Coy’s navigation with two primary tabs:

1. **Home** — A clean placeholder tab representing Coy’s existing home surface.
2. **Discover** — The complete discovery and matching experience:
   - Single-card stack displaying **32 seeded profiles** with photo, name, age, location/college, bio, and interests.
   - Smooth touch/mouse drag gestures (`Motion`) with real-time **LIKE** / **PASS** stamps, desktop Pass/Like buttons, and keyboard shortcuts (`ArrowLeft` / `ArrowRight`).
   - Real mutual matching powered by a persistent JSON file database (`server/data/db.json`).
   - Celebratory **"It’s a match!"** modal and a dedicated **Matches** view.

---

## Features

- **Mobile-First & Responsive Desktop Layout**
  - Fixed bottom tab navigation (`Home` / `Discover`) and compact sticky header (`Swipe` / `Matches`) on mobile.
  - Three-zone top navigation bar and two-column workspace (Swipe Deck + Soft Lavender Mutual Matches panel) on desktop.
- **Tactile Card Swiping**
  - Drag right to **Like** or left to **Pass** with spring-return physics when released early.
  - Real-time directional stamp feedback (`LIKE` in pink, `PASS` in slate) during drag.
  - Expandable profile sheet (`Info` button) to read full bios without cluttering the card photo.
- **Strict Mutual Matching & Privacy**
  - A match is created **only** when both users like each other.
  - Passing never creates a match—even if the other person had already liked the current user.
  - Unmatched incoming likes are never exposed in `/api/feed` or `/api/matches` payloads.
- **No Repeat Cards & Duplicate Prevention**
  - Swiped profiles are persisted immediately and never reappear across browser reloads or server restarts.
  - Duplicate swipes on the same profile return `409 Conflict` and duplicate matches are prevented.
- **Complete UI States**
  - Loading skeleton while fetching feed and matches.
  - Dismissible error alert with retry action.
  - Empty discovery state with mutual match count and a **Reset Discovery Feed** button for repeated demos.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 19 (JSX), Vite, JavaScript (ES Modules) |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Motion (`motion/react`) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | Persistent JSON file storage (`server/data/db.json`) |

---

## Project Structure

```text
coy-discover/
├── server/
│   ├── controllers/
│   │   └── discoverController.js   # Request validation and HTTP handlers
│   ├── data/
│   │   ├── db.json                 # Auto-generated persistent JSON store
│   │   └── seed.js                 # 32 mock profiles + server-only incomingLikes
│   ├── routes/
│   │   ├── feed.js                 # GET /api/feed
│   │   ├── matches.js              # GET /api/matches
│   │   └── swipe.js                # POST /api/swipe
│   └── services/
│       └── dbService.js            # Serialized atomic JSON read/write & matching logic
├── src/
│   ├── assets/images/              # Local portrait assets
│   ├── components/
│   │   ├── MatchesList.jsx         # Mutual matches list + match detail modal
│   │   ├── MatchModal.jsx          # "It's a match!" celebration modal
│   │   ├── Navigation.jsx          # Desktop top bar + mobile sticky top/bottom bars
│   │   ├── ProfileImage.jsx        # Image wrapper with initials fallback
│   │   └── SwipeCard.jsx           # Draggable card with LIKE/PASS overlays
│   ├── hooks/
│   │   └── useDiscover.js          # Feed, swipe, match, loading & error state hook
│   ├── pages/
│   │   ├── DiscoverPage.jsx        # Swipe deck, empty/error states & matches panel
│   │   └── HomePage.jsx            # Minimal placeholder Home tab
│   ├── services/
│   │   └── api.js                  # Axios API client
│   ├── App.jsx                     # Root navigation & tab state
│   ├── index.css                   # Tailwind CSS v4 & typography setup
│   └── main.jsx                    # React DOM entry point
├── index.html                      # HTML entry point & Google Fonts
├── server.js                       # Express server + Vite middleware on port 3000
├── vite.config.js                  # Vite configuration
├── package.json
└── README.md
```

---

## Screenshots & UI Walkthrough

| Screen / State | Description |
| --- | --- |
| **Discover — Swipe Deck** | Crisp white canvas with soft lavender accents, stacked profile cards, `LIKE` / `PASS` drag stamps, bio preview, and tactile Pass (`✕`) / Like (`♥`) buttons. |
| **Discover — Match Modal** | Pops up immediately upon a mutual like with both users' portraits, names, shared match card details, and `"Keep Discovering"` / `"View All Matches"` actions. |
| **Discover — Mutual Matches** | Lists confirmed mutual matches sorted newest-first; clicking any match opens their full bio and interests. Includes Coy's privacy notice. |
| **Discover — Empty State** | Shown after all 32 profiles are swiped, summarizing total mutual matches with a `"Reset Discovery Feed"` option for re-running demos. |
| **Home Tab** | Clean blank placeholder tab with a direct `"Open Discover"` action. |

> **Tip for GitHub submission:** Capture screenshots of the running app into a `docs/screenshots/` folder and embed them in this table using standard Markdown (`![Discover Swipe Deck](./docs/screenshots/discover.png)`).

---

## Installation & Setup

### Prerequisites

- **Node.js** v20+ (recommended v22+)
- **npm** v9+

### Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/coy-discover.git
   cd coy-discover
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the application (Backend + Frontend together on port 3000)**

   ```bash
   npm run dev
   ```

4. **Open in your browser**

   Visit [http://localhost:3000](http://localhost:3000).

### Frontend & Backend Architecture

- **Development (`npm run dev`)**: `server.js` starts the Express API server and mounts Vite in middleware mode, serving both `/api/*` endpoints and the React app on `http://localhost:3000` with zero CORS issues.
- **Production (`npm run build && npm start`)**:
  ```bash
  npm run build
  NODE_ENV=production npm start
  ```
  `npm run build` compiles the React frontend into `dist/`, and `server.js` serves the static production bundle alongside the Express API routes.

### Environment Configuration

No paid services, external databases, or API keys are required. Optional environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port for the Express + Vite server |
| `NODE_ENV` | `development` | Set to `production` to serve built assets from `dist/` |

---

## API Documentation

All API routes are mounted under `/api/*` (with `/feed`, `/swipe`, and `/matches` root aliases also available).

### 1. `GET /api/feed`

Returns all profiles that the logged-in user has not yet swiped on. Never exposes private `incomingLikes`.

**Response (`200 OK`)**
```json
{
  "profiles": [
    {
      "id": "prof_01",
      "name": "Maya Chen",
      "age": 22,
      "photo": "/src/assets/images/portrait_maya_chen_1794992217115.jpg",
      "bio": "Architecture senior who spends weekends hunting down sunlit espresso bars and shooting 35mm film around West Village.",
      "location": "NYU · Greenwich Village",
      "interests": ["35mm Film", "Specialty Coffee", "Architecture", "Ceramics"]
    }
  ],
  "currentUser": {
    "id": "user_claire",
    "name": "Claire Vance",
    "age": 22,
    "location": "Columbia University · NYC",
    "photo": "/src/assets/images/current_user_avatar_1794992222737.jpg"
  },
  "totalProfiles": 32,
  "remainingCount": 32
}
```

---

### 2. `POST /api/swipe`

Records a `like` or `pass` swipe for a profile, prevents duplicate swipes, and creates a mutual match only if both users have liked each other.

**Request Body**
```json
{
  "profileId": "prof_01",
  "action": "like"
}
```

**Response (`200 OK` — Mutual Match)**
```json
{
  "success": true,
  "profileId": "prof_01",
  "action": "like",
  "isMatch": true,
  "match": {
    "id": "match_prof_01",
    "profile": {
      "id": "prof_01",
      "name": "Maya Chen",
      "age": 22,
      "photo": "/src/assets/images/portrait_maya_chen_1794992217115.jpg",
      "bio": "...",
      "location": "NYU · Greenwich Village",
      "interests": ["35mm Film", "Specialty Coffee", "Architecture", "Ceramics"]
    },
    "matchedAt": "2026-11-18T09:00:00.000Z"
  },
  "remainingCount": 31
}
```

**Response (`200 OK` — One-Sided Like or Pass)**
```json
{
  "success": true,
  "profileId": "prof_02",
  "action": "like",
  "isMatch": false,
  "match": null,
  "remainingCount": 30
}
```

**Error Responses**
- `400 Bad Request` — Missing `profileId` or invalid `action` (must be `"like"` or `"pass"`).
- `404 Not Found` — `profileId` does not exist.
- `409 Conflict` — Profile has already been swiped (`{ "error": "...", "alreadySwiped": true }`).

---

### 3. `GET /api/matches`

Returns all confirmed mutual matches sorted newest-first. Unmatched incoming likes are never returned.

**Response (`200 OK`)**
```json
{
  "matches": [
    {
      "id": "match_prof_01",
      "profile": { "...": "..." },
      "matchedAt": "2026-11-18T09:00:00.000Z"
    }
  ]
}
```

---

### 4. `POST /api/reset`

Clears `swipes` and `matches` in `server/data/db.json` while preserving the 32 seeded profiles and `incomingLikes` so demos can be re-run cleanly.

---

## Data Persistence & Privacy Model

- **Atomic Writes**: `server/services/dbService.js` serializes all mutations through an in-process write queue and writes to a temporary file before atomically renaming it to `server/data/db.json`.
- **Automatic Seeding**: On startup, if `server/data/db.json` does not exist, it is created automatically from `server/data/seed.js`. Existing swipes and matches are preserved across server restarts.
- **Demo Incoming Likes**: 12 seeded profiles (`prof_01`, `prof_03`, `prof_05`, `prof_07`, `prof_09`, `prof_12`, `prof_15`, `prof_18`, `prof_21`, `prof_24`, `prof_27`, `prof_30`) have pre-seeded incoming likes on the server so mutual matches can be demonstrated immediately.

---

## Testing Checklist & Verification

Start the server with `npm run dev` and verify all 12 assignment requirements:

| # | Scenario | How to Verify | Expected Result |
| --- | --- | --- | --- |
| 1 | Feed contains >= 30 profiles | `curl http://localhost:3000/api/feed` | Returns 32 profiles |
| 2 | Like records a swipe | Like card `prof_02` in UI or via `POST /api/swipe` | Swipe saved in `db.json` |
| 3 | Pass records a swipe | Pass card `prof_04` in UI or via `POST /api/swipe` | Swipe saved in `db.json` |
| 4 | Swiped profiles never reappear | Call `GET /api/feed` after swiping | Swiped IDs are excluded |
| 5 | Mutual likes create a match | Like `prof_01` (pre-liked user) | `"isMatch": true` + match modal appears |
| 6 | One-sided likes don't match | Like `prof_02` | `"isMatch": false`, not in Matches |
| 7 | Pass never creates a match | Pass `prof_03` (pre-liked user) | `"isMatch": false`, never matches |
| 8 | Incoming likes stay hidden | Inspect `GET /api/feed` & `GET /api/matches` | No `incomingLikes` or unmatched likes exposed |
| 9 | Matches page shows mutual only | Open Matches panel / tab | Only mutual matches listed |
| 10 | Browser reload preserves state | Refresh browser after swiping | Remaining feed & matches persist |
| 11 | Server restart preserves state | Stop & restart `npm run dev` | `db.json` retains all swipes & matches |
| 12 | Duplicate swipes blocked | `POST /api/swipe` twice for `prof_01` | Second call returns `409 Conflict` |

### Quick `curl` Verification

```bash
# 1. Inspect initial feed count (32)
curl -s http://localhost:3000/api/feed | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log('Profiles:', d.profiles.length, 'Leaks incomingLikes:', 'incomingLikes' in d);"

# 2. Trigger a mutual match (prof_01)
curl -s -X POST http://localhost:3000/api/swipe -H "Content-Type: application/json" -d '{"profileId":"prof_01","action":"like"}'

# 3. Verify pass never matches even on an incoming like (prof_03)
curl -s -X POST http://localhost:3000/api/swipe -H "Content-Type: application/json" -d '{"profileId":"prof_03","action":"pass"}'

# 4. Verify duplicate swipe protection (returns 409)
curl -i -s -X POST http://localhost:3000/api/swipe -H "Content-Type: application/json" -d '{"profileId":"prof_01","action":"like"}'

# 5. Check mutual matches
curl -s http://localhost:3000/api/matches

# 6. Reset demo data
curl -s -X POST http://localhost:3000/api/reset
```

---

## GitHub Publishing Instructions

1. **Create a new public repository** on GitHub (e.g., `coy-discover`).
2. **Initialize Git, commit, and push**:

   ```bash
   git init
   git add .
   git commit -m "Build Coy Discover tab with swipe deck, mutual matching, and JSON persistence"
   git branch -M main
   git remote add origin https://github.com/<your-username>/coy-discover.git
   git push -u origin main
   ```
