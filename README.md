# 🛂 AI Passport Social Media Scraper Dashboard

A production-ready MERN stack application that monitors passport-related social media posts, processes them with AI/NLP, and displays them in a beautiful real-time dashboard.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Complete Folder Structure](#-folder-structure)
4. [Prerequisites](#-prerequisites)
5. [Step-by-Step Setup in VS Code](#-step-by-step-setup-in-vs-code)
6. [Environment Variables Explained](#-environment-variables-explained)
7. [Running the Project](#-running-the-project)
8. [API Documentation](#-api-documentation)
9. [Features Guide](#-features-guide)
10. [Deployment Guide](#-deployment-guide)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

This dashboard automatically:
- Scrapes passport-related social media posts every 30 minutes
- Processes them with OpenAI (sentiment, category, summary, spam detection)
- Displays real-time analytics in a glassmorphism UI
- Supports translation into 10 languages
- Provides CSV/PDF export functionality

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State Management | Redux Toolkit |
| Charts | Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Real-time | Socket.io |
| AI/NLP | OpenAI GPT-3.5-turbo |
| Scraping | Reddit API, YouTube Data API |
| Auth | JWT |
| Logging | Winston + Morgan |
| Scheduling | node-cron |

---

## 📁 Folder Structure

```
project/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   │   └── Navbar.jsx       # Top navigation bar
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.jsx     # Individual post card
│   │   │   │   ├── FilterBar.jsx    # Post filters
│   │   │   │   └── SearchBar.jsx    # Search with debounce
│   │   │   ├── dashboard/
│   │   │   │   └── StatsCard.jsx    # Stat overview cards
│   │   │   ├── analytics/
│   │   │   │   └── AnalyticsChart.jsx # All chart components
│   │   │   └── common/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── LoadingSkeleton.jsx
│   │   │       ├── Pagination.jsx
│   │   │       ├── TranslationModal.jsx
│   │   │       └── ScrapeStatusBar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main overview page
│   │   │   ├── AllPosts.jsx         # Full posts list with filters
│   │   │   ├── Analytics.jsx        # Analytics & charts
│   │   │   ├── SavedPosts.jsx       # Bookmarked posts
│   │   │   ├── Settings.jsx         # User settings
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── Register.jsx         # Registration page
│   │   ├── redux/
│   │   │   ├── store.js             # Redux store config
│   │   │   └── slices/
│   │   │       ├── authSlice.js     # Auth state
│   │   │       ├── postsSlice.js    # Posts state
│   │   │       ├── analyticsSlice.js# Analytics state
│   │   │       └── uiSlice.js       # UI state (theme, modals)
│   │   ├── hooks/index.js           # Custom React hooks
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   └── socketService.js     # Socket.io client
│   │   ├── layouts/MainLayout.jsx   # Main app shell
│   │   ├── App.jsx                  # Router setup
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                          # Express backend
│   ├── index.js                     # Server entry point
│   ├── config/
│   │   ├── database.js              # MongoDB connection
│   │   ├── logger.js                # Winston logger
│   │   └── socket.js                # Socket.io config
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── postController.js        # Post CRUD + search
│   │   ├── analyticsController.js   # Analytics aggregations
│   │   ├── exportController.js      # CSV/PDF export
│   │   └── translationController.js # Translation
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── exportRoutes.js
│   │   ├── translationRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT middleware
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validate.js              # Input validation
│   ├── models/
│   │   ├── Post.js                  # Post schema
│   │   ├── User.js                  # User schema
│   │   ├── Analytics.js             # Analytics schema
│   │   └── Notification.js          # Notification schema
│   ├── ai/
│   │   └── aiService.js             # OpenAI integration
│   ├── scrapers/
│   │   ├── redditScraper.js         # Reddit API scraper
│   │   ├── youtubeScraper.js        # YouTube API scraper
│   │   ├── scraperService.js        # Orchestrator
│   │   └── mockDataGenerator.js     # Demo data (no API needed)
│   ├── jobs/
│   │   └── scraperJob.js            # Cron job scheduler
│   ├── utils/
│   │   └── seed.js                  # Database seeder
│   └── package.json
│
└── README.md
```

---

## ✅ Prerequisites

Before you start, install these on your computer:

### 1. Node.js (v18 or higher)
```
Download from: https://nodejs.org/en/download
Verify: node --version  (should show v18.x.x or higher)
Verify: npm --version   (should show 9.x.x or higher)
```

### 2. Git
```
Download from: https://git-scm.com/downloads
Verify: git --version
```

### 3. VS Code
```
Download from: https://code.visualstudio.com/download
```

### 4. VS Code Extensions (Recommended)
Install these from the VS Code Extensions panel (Ctrl+Shift+X):
- **ESLint** — Code linting
- **Prettier** — Code formatting
- **Tailwind CSS IntelliSense** — Tailwind class autocomplete
- **Thunder Client** — API testing inside VS Code

---

## 🚀 Step-by-Step Setup in VS Code

### STEP 1 — Open the Project in VS Code

```bash
# Option A: If you downloaded the zip
1. Unzip the project folder
2. Open VS Code
3. File → Open Folder → Select the "project" folder

# Option B: Clone from git
git clone <your-repo-url>
cd project
code .   # Opens VS Code
```

---

### STEP 2 — Set Up MongoDB Atlas (Free Database)

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** → Create account
3. Choose **Free Tier (M0)** cluster → Select region closest to you
4. Create a **database user**:
   - Database Access → Add New Database User
   - Username: `passportadmin`
   - Password: generate a secure password (save it!)
   - Role: **Atlas admin**
5. Allow network access:
   - Network Access → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
6. Get your connection string:
   - Clusters → Connect → Connect your application
   - Copy the string: `mongodb+srv://passportadmin:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password

---

### STEP 3 — Set Up the Backend (.env file)

In VS Code, navigate to the `server` folder.

Open the **Terminal** in VS Code: `` Ctrl+` `` (backtick)

```bash
cd server
cp .env.example .env
```

Now open `server/.env` in VS Code and fill in your values:

```env
PORT=5000
NODE_ENV=development

# Paste your MongoDB connection string here
MONGODB_URI=mongodb+srv://passportadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/passport_scraper?retryWrites=true&w=majority

# Change this to any random long string (used to sign JWT tokens)
JWT_SECRET=mySuper$ecretKey12345ChangeMeInProduction!
JWT_EXPIRES_IN=7d

# OpenAI (OPTIONAL - works without it, uses keyword-based fallback)
# Get key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-key-here

# Reddit API (OPTIONAL - get from: https://www.reddit.com/prefs/apps)
# Click "Create App" → "script" type
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=PassportScraper/1.0.0

# YouTube API (OPTIONAL - get from: https://console.cloud.google.com)
# Enable "YouTube Data API v3"
YOUTUBE_API_KEY=your_youtube_api_key

# Frontend URL
CLIENT_URL=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Cron schedule (every 30 minutes)
SCRAPE_INTERVAL=*/30 * * * *
```

> ⚠️ **IMPORTANT**: Even without any API keys (Reddit, YouTube, OpenAI), the app works perfectly using mock data and keyword-based AI fallbacks.

---

### STEP 4 — Set Up the Frontend (.env file)

```bash
cd ../client
cp .env.example .env
```

The `client/.env` file should contain:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

### STEP 5 — Install Dependencies

Open **two terminal windows** in VS Code (click the `+` icon in the terminal panel):

**Terminal 1 — Install server dependencies:**
```bash
cd server
npm install
```
This installs: express, mongoose, socket.io, openai, node-cron, pdfkit, csv-writer, etc.

**Terminal 2 — Install client dependencies:**
```bash
cd client
npm install
```
This installs: react, redux, tailwindcss, framer-motion, recharts, socket.io-client, etc.

---

### STEP 6 — Create logs directory (required by Winston)

```bash
cd server
mkdir logs
```

---

### STEP 7 — Seed the Database

This creates demo users and 50 sample passport posts so you can see the dashboard immediately:

```bash
cd server
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👤 Admin created: admin@passport-dashboard.com / admin123
👤 Demo user: demo@passport-dashboard.com / demo123
📝 Inserted 50 mock posts
✅ Database seeded successfully!
```

---

### STEP 8 — Start the Application

**Terminal 1 — Start the backend:**
```bash
cd server
npm run dev
```

Expected output:
```
🚀 Server running on port 5000 in development mode
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Running initial scrape...
✅ Scraping complete: 20 new posts
```

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 300 ms
  ➜  Local:   http://localhost:3000/
```

---

### STEP 9 — Open the Dashboard

1. Open your browser
2. Go to: **http://localhost:3000**
3. You'll see the login page
4. Use demo credentials:
   - **Admin**: `admin@passport-dashboard.com` / `admin123`
   - **Demo**: `demo@passport-dashboard.com` / `demo123`

🎉 **You're in!** The dashboard will show you 50 seeded posts with charts.

---

## 🔑 Environment Variables Explained

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWT tokens |
| `PORT` | No | Server port (default: 5000) |
| `OPENAI_API_KEY` | No | Enables AI summaries, sentiment analysis |
| `REDDIT_CLIENT_ID` | No | Enables Reddit scraping |
| `REDDIT_CLIENT_SECRET` | No | Reddit API secret |
| `YOUTUBE_API_KEY` | No | Enables YouTube scraping |
| `CLIENT_URL` | No | Frontend URL for CORS (default: localhost:3000) |
| `SCRAPE_INTERVAL` | No | Cron schedule (default: every 30 min) |

---

## 📡 API Documentation

### Authentication
```
POST /api/auth/register    — Create new account
POST /api/auth/login       — Login
GET  /api/auth/me          — Get current user (auth required)
PUT  /api/auth/preferences — Update preferences (auth required)
PUT  /api/auth/change-password — Change password (auth required)
```

### Posts
```
GET  /api/posts            — Get posts (supports filters as query params)
GET  /api/posts/stats      — Get stats summary
GET  /api/posts/saved      — Get saved posts (auth required)
GET  /api/posts/:id        — Get single post
POST /api/posts/search     — Search posts  { query, page, limit }
POST /api/posts/:id/save   — Toggle save post (auth required)
POST /api/posts/:id/summarize — Generate AI summary (auth required)
```

**Query params for GET /api/posts:**
```
?platform=twitter,reddit
?sentiment=positive,negative
?category=Tatkal
?language=en
?region=Mumbai
?startDate=2024-01-01
?endDate=2024-01-31
?sortBy=postedAt|engagementScore
?sortOrder=asc|desc
?page=1
?limit=20
```

### Analytics
```
GET /api/analytics/overview   — Full analytics (supports ?startDate & ?endDate)
GET /api/analytics/trending   — Trending hashtags & topics (last 6h)
```

### Export
```
GET /api/export/csv    — Export filtered posts to CSV (auth required)
GET /api/export/pdf    — Export filtered posts to PDF (auth required)
```

### Translation
```
POST /api/translate/text         — Translate text { text, targetLanguage }
POST /api/translate/:postId      — Translate a specific post { targetLanguage }
```

**Supported language codes:** `en`, `hi`, `pa`, `es`, `fr`, `de`, `ar`, `zh`, `ru`, `ja`

### Notifications
```
GET /api/notifications           — Get notifications (auth required)
PUT /api/notifications/:id/read  — Mark one as read
PUT /api/notifications/mark-all-read — Mark all as read
```

---

## 🎮 Features Guide

### Real-time Updates
- The dashboard uses Socket.io to receive live updates when new posts are scraped
- A banner appears at the top when new posts arrive — click to refresh

### Filters
Available on the **All Posts** page:
- Platform (Twitter, Reddit, YouTube, etc.)
- Sentiment (Positive, Negative, Neutral)
- Category (Passport Application, Tatkal, Visa, etc.)
- Language
- Sort by date or engagement

### Translation
On any PostCard, click the 🌐 icon to open the Translation Modal. Select a language and click Translate.

### Bookmarking
Click the 🔖 icon on any post to save it. View all saved posts in the **Saved Posts** page.

### Export
On the **All Posts** page, click **CSV** or **PDF** to export the current filtered results.

### Admin: Manual Scrape Trigger
If you're an admin, you can POST to `/api/posts/admin/scrape` to trigger scraping immediately.

---

## 🚢 Deployment Guide

### Deploy Backend on Render.com (Free)

1. Push your code to GitHub
2. Go to **https://render.com** → New Web Service
3. Connect your GitHub repo, select the `server` folder
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables (same as your `.env` file)
6. Deploy → Copy the URL (e.g., `https://your-app.onrender.com`)

### Deploy Frontend on Vercel (Free)

1. Go to **https://vercel.com** → New Project
2. Import your GitHub repo, set root directory to `client`
3. Add Environment Variable:
   - `VITE_API_URL` = `https://your-app.onrender.com`
   - `VITE_SOCKET_URL` = `https://your-app.onrender.com`
4. Deploy → Your app is live!

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `server/.env`
- Make sure you whitelisted `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify your password has no special characters that need URL encoding

### "Port 5000 already in use"
```bash
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Module not found" errors
```bash
# Delete node_modules and reinstall
cd server && rm -rf node_modules && npm install
cd client && rm -rf node_modules && npm install
```

### "No posts showing" after seed
```bash
# Re-run the seeder
cd server && npm run seed
```

### OpenAI API errors
- If you don't have an OpenAI API key, the app works with keyword-based fallbacks
- Check your API key starts with `sk-`
- Ensure you have credits on your OpenAI account

### Socket.io connection issues
- Make sure the backend is running on port 5000
- The Vite proxy in `vite.config.js` handles socket forwarding automatically

### "framer-motion not found"
```bash
cd client
npm install framer-motion
```

---

## 📞 Quick Reference

| Action | Command |
|--------|---------|
| Start backend | `cd server && npm run dev` |
| Start frontend | `cd client && npm run dev` |
| Seed database | `cd server && npm run seed` |
| Build frontend | `cd client && npm run build` |
| View logs | Check `server/logs/` folder |

**Default Ports:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

**Demo Login:**
- Admin: `admin@passport-dashboard.com` / `admin123`
- User: `demo@passport-dashboard.com` / `demo123`

---

## 📄 License

MIT License — free to use for personal and commercial projects.
