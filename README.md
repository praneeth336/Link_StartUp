# LinkStart — Venture Creation & Matching Platform

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite_Offline-green.svg)](https://www.sqlite.org/)

**LinkStart** is a next-generation venture creation platform designed to connect **Idea Creators**, **Skilled Co-Founders**, and **Investors** to turn early concepts into scalable, venture-backed startups.

---

## 🚀 Key Features

### 1. 3-Sided Venture Ecosystem
* **Idea Creators**: Publish domain concepts, specify required co-founder skillsets (React Native, AI/ML, PyTorch, Sales), and set target funding goals.
* **Skilled Co-Founders**: Discover vetted startup ideas, view required execution skills, and join teams as equal co-founders with equity alignment.
* **Investors & Angels**: Access pre-vetted deal flow and evaluate teams based on empirical **proof-of-work velocity** rather than raw unvalidated cold pitches.

### 2. Strict Privacy Architecture
* **Guarded Profile Data**: Public profiles display display name, avatar, bio, skills, and domain interests.
* **Concealed Contact Info**: Personal phone numbers and email addresses are strictly concealed until a mutual **Double Opt-In** connection is accepted by both parties.

### 3. Double Opt-In Matching Engine
* Send introductory connection requests with custom pitch notes.
* Receivers inspect profiles and accept or decline requests.
* Accepting a connection unlocks the shared **Collaboration Workspace** and unhides verified contact email addresses.

### 4. In-App Collaboration Suite (`/workspace`)
* **Direct Messaging / Chat**: Private real-time messaging between matched creators, co-founders, and investors.
* **Pitch Room & Document Sharing**: Upload, organize, and view pitch decks, architecture specifications, and financial models.
* **Trial Sprint Milestone Board**: Kanban task management (`To Do`, `In Progress`, `Completed`) for 14- to 30-day proof-of-work trials before formal legal incorporation.
* **Co-Founder Equity Calculator**: Interactive *Slicing Pie* equity split calculator based on risk-adjusted hours contributed, alongside FAST advisor term templates and vesting guides.

### 5. Instant Test Profile Switcher
* Built-in navbar switcher allows instant testing across 3 sample roles:
  * **Priya Sharma** (*Idea Creator*)
  * **Alex Rivera** (*Skilled Technical Co-Founder*)
  * **Marcus Vance** (*Angel Investor / Micro VC*)

---

## 💾 Offline Database Architecture

LinkStart runs **100% offline with zero external account, cloud subscription, or API key requirement**.

1. **SQLite File Database (`server/database.sqlite`)**:
   * Powered by `better-sqlite3` and Express.
   * Auto-creates a local single-file database (`database.sqlite`) on disk.
   * Stores relational tables for `users`, `ideas`, `connections`, `messages`, `documents`, and `milestones`.
2. **Browser IndexedDB Engine (`src/db/indexedDB.ts`)**:
   * Powered by `Dexie.js`.
   * Provides zero-config, browser-native offline storage fallback if running standalone without starting the Node backend server.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, Radix UI primitives.
* **State Management**: React Context, LocalStorage, Dexie IndexedDB.
* **Backend API**: Node.js, Express, CORS.
* **Database**: SQLite (`better-sqlite3`).

---

## 📦 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/praneeth336/Link_StartUp.git
   cd Link_StartUp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

### Option A: Complete App (Frontend + Local SQLite Server)

1. **Start the Local SQLite Backend** (Port 3001):
   ```bash
   npm run server
   ```

2. **Start the Vite Frontend** (Port 8080):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080/
   ```

### Option B: Standalone Frontend (Auto-fallback to IndexedDB)

```bash
npm run dev
```

---

## 📁 Project Structure

```
linkstart/
├── server/
│   ├── server.js          # Express REST API & SQLite table initialization
│   └── database.sqlite    # Single-file SQLite database (auto-generated)
├── src/
│   ├── components/        # UI components (Navbar, IdeaCard, PrivacyBadge, UserProfileModal, UI primitives)
│   ├── context/           # AppContext for state, connection matching, and DB hydration
│   ├── data/              # Seed data for users, ideas, connections, documents, and milestones
│   ├── db/                # Dexie.js browser IndexedDB database configuration
│   ├── hooks/             # Custom React hooks (use-toast)
│   ├── pages/             # Route pages (Index, Explore, CoFounders, Investors, Connections, Workspace, IdeaDetail)
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main router & provider setup
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind CSS styles
├── package.json           # Dependencies and run scripts
├── tailwind.config.ts     # Tailwind configuration
└── vite.config.ts         # Vite build configuration
```

---

## 📄 Scripts Summary

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:8080/` |
| `npm run server` | Starts offline SQLite Node backend API at `http://localhost:3001/` |
| `npm run build` | Builds production distribution files to `dist/` |

---

*Developed for LinkStart — Empowering early-stage venture creation.*
