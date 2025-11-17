# 🤖 PolyCaster - AI-Powered Polymarket Analytics Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.7.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-MIT-orange)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**Real-time Polymarket analytics with AI-powered insights and seamless Web3 integration**

🎉 **Currently Running:** Backend (Port 8000) ✅ | Frontend (Port 3000) ✅

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture)

</div>

---

## 🎯 **What is PolyCaster?**

PolyCaster is a modern web application that provides real-time analytics and AI-powered insights for Polymarket prediction markets. Built with Next.js and TypeScript, it offers a seamless experience for discovering, analyzing, and trading prediction markets.

### **Core Features** 🚀

- 🔍 **Real-Time Search**: Instant market search powered by Polymarket API
- 📊 **Category Filtering**: Browse markets by Sports, Crypto, Politics, Tech, Science, and Culture
- ⭐ **Watchlist**: Save up to 10 favorite markets with notes
- 🔔 **Price Alerts**: Set alerts for price movements with email notifications
- 🤖 **AI Analysis**: Premium institutional-grade market analysis ($0.30 USDC per analysis)
- 💰 **ROI Calculator**: Calculate potential returns on market positions
- 📜 **Signal History**: Track all purchased AI analysis signals
- 💼 **Unified Web3 Integration**: EVM (Base Sepolia) & Solana wallet support via Thirdweb X402 (single framework for both chains)
- 📧 **Email Notifications**: Receive alerts via verified email addresses
- 🎓 **Onboarding Tour**: Interactive tutorial for new users
- 📚 **Help & FAQ**: Comprehensive documentation and support
- 📈 **Visual Analytics**: Interactive probability bars and market statistics
- ⚡ **Live Updates**: Recently active markets with real-time data
- 📱 **Mobile Optimized**: Fully responsive design with touch-friendly UI
- 🔗 **Unified Multi-Chain Payments**: Pay with USDC on Base Sepolia (EVM) or Solana via Thirdweb X402 facilitator
- 📊 **Enhanced Market Display**: Load More functionality for Trending, Live, and All Markets sections
- 📈 **Market Statistics**: Total Volume tracking and display in header

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    POLYCASTER PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Next.js    │ ◄────►│  TypeScript  │ ◄────►│ Supabase│ │
│  │   Frontend   │      │    Backend   │      │ Database│ │
│  └──────┬───────┘      └──────┬───────┘      └──────────┘ │
│         │                     │                             │
│         │                     │                             │
│         ▼                     ▼                             │
│  ┌────────────────────────────────────────┐               │
│  │         SERVICE LAYER                   │               │
│  │                                          │               │
│  │  • Polymarket Service (live markets)    │               │
│  │  • AI Engine (market analysis)          │               │
│  │  • Search Service (keyword matching)    │               │
│  │  • Category Filtering (keyword-based)   │               │
│  │  • Wallet Service (Thirdweb X402)        │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
  │  ┌────────────┐      ┌────────────┐      ┌────────────┐  │
  │  │ Polymarket │      │  Thirdweb   │      │  X402       │  │
  │  │  Gamma API │      │   X402      │      │  Facilitator│  │
  │  └────────────┘      └────────────┘      └────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Current Status**

### **Services Running** ✅

| Service | Status | Port | URL |
|---------|--------|------|-----|
| **Backend API** | 🟢 Running | 8000 | http://localhost:8000 |
| **Frontend** | 🟢 Running | 3000 | http://localhost:3000 |
| **Supabase** | 🟢 Connected | - | Database Active |
| **Polymarket API** | 🟢 Connected | - | Markets Fetching |
| **AI Engine** | 🟢 Healthy | - | OpenAI gpt-4o / Ollama Fallback |
| **Facilitator** | 🟢 Healthy | - | Thirdweb X402 (EVM + Solana) |

### **Quick Health Check**

```bash
# Verify all services
curl http://localhost:8000/health

# Expected output:
{
  "status": "healthy",
  "services": {
    "api": "running",
    "polymarket": "healthy",
    "ai_engine": "healthy",
    "facilitator": "healthy",
    "database": "healthy"
  },
  "timestamp": "2025-11-01T12:44:18.291Z"
}
```

### **Known Warnings** ⚠️

The following warnings are **safe to ignore**:
- ⚠️ `pino-pretty` module not found - Optional logging dependency
- ⚠️ Next.js workspace root detection - Multiple lockfiles detected
- ⚠️ Unsupported metadata viewport - Next.js config recommendation

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 16.0.1** - React framework with App Router
- **TypeScript 5.3** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Icon library
- **Thirdweb 5.110+** - Unified Web3 wallet integration & X402 payment facilitator (EVM + Solana)
- **React 19** - Latest React features

### **Backend**
- **Express.js 4.18** - Node.js web framework
- **TypeScript 5.3** - Type-safe server code
- **Axios 1.6** - HTTP client for API calls
- **tsx 4.6** - TypeScript execution with watch mode
- **OpenAI API** - GPT-4o for AI analysis (primary)
- **Ollama 0.5** - Local AI inference (fallback)

### **Database**
- **Supabase** - PostgreSQL database
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live updates

### **Blockchain**
- **Thirdweb X402 Facilitator** - Unified payment facilitator for both EVM and Solana
- **Thirdweb SDK** - Wallet connection for EVM (MetaMask, Coinbase, Trust Wallet, In-App Wallet)
- **Thirdweb Solana Support** - Native Solana wallet support (Phantom auto-detected)
- **Phantom Auto-Connect** - Automatically connects Phantom to Solana when connected as EVM
- **Multi-Chain Payments** - USDC transactions on Base Sepolia (EVM) and Solana via single facilitator
- **Chain Tracking** - Database tracks which chain was used for each signal purchase

### **External APIs**
- **Polymarket Gamma API** - Real-time market data
- **Market Search** - Keyword-based filtering
- **Category Endpoints** - Structured market data
- **Resend** - Email delivery service for notifications

### **Additional Services**
- **Email Service** - Resend integration for price alerts and verification
- **Alert Checker** - Background service monitoring price triggers
- **Database Migrations** - Supabase schema management

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm
- Supabase account
- Thirdweb API key

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/PolyCaster.git
cd PolyCaster

# Install frontend dependencies
cd polycasterz
npm install

# Install backend dependencies
cd ../backend-ts
npm install
```

### **Environment Variables**

**Frontend (`polycasterz/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x... (EVM server wallet)
NEXT_PUBLIC_SOLANA_SERVER_WALLET=... (Solana server wallet)
NEXT_PUBLIC_SOLANA_RPC_URL=https://... (Solana RPC endpoint - Helius, QuickNode, etc.)
```

**Backend (`backend-ts/.env`):**
```env
# Supabase
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Polymarket
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets

# Server
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

# OpenAI (for AI analysis - primary)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o

# Blockchain (EVM - BNB Chain / BSC)
BNB_RPC_URL=https://public-bsc-mainnet.fastnode.io
USDC_CONTRACT_ADDRESS=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d
SERVER_WALLET=0x...
MIN_PAYMENT_AMOUNT=0.3

# Blockchain (Solana - Thirdweb X402)
SOLANA_SERVER_WALLET=... (Solana facilitator wallet address)
# Note: Thirdweb X402 facilitator handles both EVM and Solana payments
# Note: BNB Chain USDC uses 18 decimals (not 6!)
```

### **Run the Application**

**Terminal 1 - Backend:**
```bash
cd backend-ts
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd polycasterz
npm run dev
```

Visit `http://localhost:3000` to see the app! 🎉

### **Verify Services**

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

Expected backend response:
```json
{
  "status": "healthy",
  "services": {
    "api": "running",
    "polymarket": "healthy",
    "ai_engine": "healthy",
    "facilitator": "healthy",
    "database": "healthy"
  }
}
```

---

## 🔧 **Troubleshooting**

### **Port Already in Use**

If you see `Error: listen EADDRINUSE: address already in use :::8000`:

```bash
# Kill processes on port 8000
lsof -ti:8000 | xargs kill -9

# Kill processes on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Then restart the servers
```

### **Missing Dependencies**

```bash
# If you see "pino-pretty" warnings (safe to ignore)
# Or install it explicitly:
cd polycasterz
npm install --save-dev pino-pretty

# Reinstall all dependencies
npm install
```

### **Environment Variables Not Loading**

Make sure your `.env` files are in the correct locations:
- Backend: `/backend-ts/.env`
- Frontend: `/polycasterz/.env.local`

```bash
# Verify environment files exist
ls -la backend-ts/.env
ls -la polycasterz/.env.local
```

### **Database Connection Issues**

Verify your Supabase credentials:
```bash
# Test Supabase connection
curl -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  https://YOUR_PROJECT.supabase.co/rest/v1/
```

### **Frontend Not Loading Markets**

Check that backend is running and API_URL is correct:
```bash
# Verify backend is responding
curl http://localhost:8000/markets?limit=5

# Check .env.local in polycasterz
cat polycasterz/.env.local | grep API_URL
```

---

## ✨ **Features**

### **1. Real-Time Market Search** 🔍
- Search markets by keywords (e.g., "Bitcoin", "Trump", "Sports")
- Debounced API calls (500ms) for optimal performance
- Searches both questions and descriptions
- Returns only active, open markets
- Advanced filters: Status, Price Range, Volume Range
- Sorting options: Price, Liquidity, Time
- Load More functionality for progressive market loading

### **2. Smart Category Filtering** 📂
- **All** - Recently active markets across all categories (up to 100 markets, with Load More)
- **Sports** - Sports betting and predictions (150 markets fetched, 9 shown initially)
- **Crypto** - Cryptocurrency and DeFi markets (150 markets fetched, 9 shown initially)
- **Politics** - Political events and elections (150 markets fetched, 9 shown initially)
- **Tech** - Technology and AI markets (150 markets fetched, 9 shown initially)
- **Science** - Scientific breakthroughs and research (150 markets fetched, 9 shown initially)
- **Culture** - Entertainment, media, and culture (150 markets fetched, 9 shown initially)
- **Economics** - Economic indicators and trends (150 markets fetched, 9 shown initially)
- **Trending Markets** - 20 high-volume markets (6 shown initially, Load More available)
- **Live Markets** - 40 active markets from API (8 shown initially, Load More available)

### **3. Enhanced Market Cards** 📊
- **Visual Probability Bars** - Green (YES) vs Red (NO) split
- **Separate YES/NO Pricing** - Clear odds display
- **Analytics Grid** - Volume, Liquidity, Last Update, Market Age
- **24h Price Change** - Trending indicators
- **Time Remaining** - Countdown to market close
- **Active Status** - Live market badges
- **Compact Design** - Optimized card sizes for better UX
- **Quick Actions** - One-click save, alert, and analysis

### **4. Watchlist / Saved Markets** ⭐
- Save up to 10 favorite markets (Free tier)
- Add custom notes to saved markets
- Quick access via header navigation
- Dedicated watchlist page (`/watchlist`)
- Remove and update saved markets
- Empty state with helpful guidance

### **5. Price Alerts** 🔔
- Create up to 5 active alerts (Free tier)
- Alert conditions: Above, Below, or Equals target price
- Email notifications when alerts trigger
- In-app toast notifications with badge count
- Alert management page (`/alerts`)
- Tabs: Active, Triggered, Cancelled
- Smart notification tracking (shows once per alert)
- Email verification flow

### **6. AI-Powered Analysis** 🤖
- **Premium Analysis** - Institutional-grade reports worth $100+
- **11 Detailed Sections**:
  - Executive Summary
  - Market Context
  - Fundamental Analysis
  - Technical Analysis
  - Market Microstructure
  - Key Factors (6 quantitative insights)
  - Opportunity Analysis
  - Price Analysis
  - Risk Assessment
  - Competitive Analysis
  - Action Plan
- **Recommendations**: BUY/SELL/HOLD with confidence scores
- **Price Targets**: Fair value estimates with methodology
- **Risk Levels**: LOW/MEDIUM/HIGH assessment
- **Payment**: $0.30 USDC per analysis via Thirdweb X402 facilitator (EVM or Solana)
- **History**: Track all purchased signals (`/history`)

### **7. ROI Calculator** 💰
- Calculate potential returns on market positions
- Investment amount input
- Position selection (YES/NO)
- Real-time profit/loss calculation
- Accurate fee structure (0% Polymarket fees)
- Gas cost considerations
- Modal integration for easy access

### **8. Signal Purchase History** 📜
- View all purchased AI analysis signals
- Filter by recommendation type (BUY/SELL/HOLD)
- Sort by date, confidence, or price target
- Signal statistics dashboard
- Detailed signal cards with full analysis
- Export capabilities (coming soon)

### **9. Unified Multi-Chain Web3 & Authentication** 💼
- **EVM Wallets**: MetaMask, Coinbase Wallet, Trust Wallet, In-App Wallet (via Thirdweb)
- **Solana Wallets**: Phantom (auto-detected), other Solana wallets (via Thirdweb)
- **Phantom Auto-Connect**: Automatically connects Phantom to Solana when connected as EVM
- **Manual Solana Connect**: Button to manually connect Phantom to Solana if needed
- **Email Login**: Thirdweb In-App Wallet (EVM)
- **Social Login**: Google, Apple, Facebook (via Thirdweb)
- **Unified Payments**: Thirdweb X402 facilitator handles both EVM and Solana payments
- **Chain Detection**: Automatic detection of wallet type (EVM vs Solana)
- **Chain Tracking**: Database tracks which chain was used for each signal purchase
- **Email verification** for notifications
- **User profile tracking** with primary chain preference

### **10. Email Notifications** 📧
- Email alerts when price triggers
- Email verification flow
- Resend integration
- Email settings management
- Verified email badge
- Unsubscribe options

### **11. Onboarding & Help** 🎓
- **Welcome Modal**: First-time visitor experience
- **Interactive Tour**: 8-step guided tour of key features
- **Help Button**: Quick access to restart tour
- **FAQ Page**: Comprehensive help documentation (`/help`)
- **Search**: Find answers quickly
- **Categories**: Organized by feature/topic
- **Contact Section**: Get support

### **12. Landing Page** 🏠
- **Hero Section**: Compelling value proposition
- **What Is Section**: Platform explanation
- **Use Cases Section**: Real-world applications
- **Conditional Display**: Shows only to first-time visitors
- **Skip Option**: For returning users

### **13. Responsive Design** 📱
- **Mobile-First**: Fully optimized for mobile devices
- **Touch-Friendly**: 44px minimum tap targets
- **Dark/Light Mode**: Theme toggle with persistence
- **Smooth Animations**: Framer Motion transitions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Graceful error messages
- **Empty States**: Helpful guidance when no data

### **14. Performance Optimizations** ⚡
- **React Query Caching**: 5-minute stale time
- **Optimized API Calls**: 70% reduction in requests
- **Tab Visibility API**: Smart polling only when tab is active
- **Debounced Search**: 500ms delay
- **Manual Refresh**: User-controlled data updates
- **Code Splitting**: Smaller bundle sizes
- **Lazy Loading**: Components load on demand

---

## 📊 **API Endpoints**

### **Health & Status**
```bash
# Health check (returns all service statuses)
GET http://localhost:8000/health
```

### **Markets**
```bash
# Get all markets (default 20)
GET http://localhost:8000/markets?limit=50

# Get markets by category
GET http://localhost:8000/markets/category/:category?limit=100&fromDays=180

# Search markets by keyword
GET http://localhost:8000/markets/search?q=bitcoin&limit=20

# Get market by ID
GET http://localhost:8000/markets/:id

# Get active markets
GET http://localhost:8000/markets/active?limit=20

# Get recent markets
GET http://localhost:8000/markets/recent?limit=20

# Get trending markets (high volume)
GET http://localhost:8000/markets/trending?limit=20

# Get market overview (active + recent + trending)
GET http://localhost:8000/markets/overview?limit=10

# Get available categories
GET http://localhost:8000/markets/categories

# Get category analytics
GET http://localhost:8000/markets/category/:category/analytics?limit=20
```

**Supported Categories:**
- `all` - All markets
- `crypto` - Cryptocurrency markets
- `politics` - Political events
- `sports` - Sports betting
- `tech` - Technology & AI
- `science` - Scientific research
- `culture` - Entertainment & culture
- `economics` - Economic indicators

### **AI Analysis**
```bash
# Analyze a market (requires payment verification)
POST http://localhost:8000/ai/analyze/:marketId
Body: {
  "payment_verified": true,
  "user_wallet": "0x..." or "SolanaAddress...",
  "chain": "evm" or "solana",
  "transaction_hash": "0x..." or "SolanaSignature..."
}

# Response:
{
  "success": true,
  "signal": {
    "id": "...",
    "recommendation": "BUY|SELL|HOLD",
    "confidence_score": 0.85,
    "risk_level": "LOW|MEDIUM|HIGH",
    "price_target": 0.75,
    "reasoning": "...",
    "executive_summary": "...",
    "market_context": "...",
    "fundamental_analysis": "...",
    "technical_analysis": "...",
    "market_microstructure": "...",
    "key_factors": ["...", "..."],
    "opportunity_analysis": "...",
    "price_analysis": "...",
    "risk_assessment": "...",
    "competitive_analysis": "...",
    "action_plan": "..."
  }
}
```

### **Users**
```bash
# Create user
POST http://localhost:8000/users
Body: { "wallet_address": "0x..." }

# Get user by wallet
GET http://localhost:8000/users/:walletAddress

# Get user stats
GET http://localhost:8000/users/:walletAddress/stats

# Get user signals history
GET http://localhost:8000/users/:walletAddress/signals?limit=10

# Update user email
PATCH http://localhost:8000/users/:walletAddress/email
Body: { "email": "user@example.com" }

# Verify email
GET http://localhost:8000/users/verify-email?token=verification_token
```

### **Watchlist**
```bash
# Get user watchlist
GET http://localhost:8000/watchlist/:walletAddress

# Add to watchlist
POST http://localhost:8000/watchlist
Body: {
  "wallet_address": "0x...",
  "market_id": "market_id",
  "notes": "Optional notes"
}

# Update watchlist item
PATCH http://localhost:8000/watchlist/:id
Body: { "notes": "Updated notes" }

# Remove from watchlist
DELETE http://localhost:8000/watchlist/:id
```

### **Price Alerts**
```bash
# Get user alerts
GET http://localhost:8000/alerts/:walletAddress?status=active

# Create alert
POST http://localhost:8000/alerts
Body: {
  "wallet_address": "0x...",
  "market_id": "market_id",
  "target_price": 0.75,
  "condition": "above|below|equals",
  "notes": "Optional notes"
}

# Update alert
PATCH http://localhost:8000/alerts/:id
Body: { "target_price": 0.80, "notes": "Updated" }

# Cancel alert
DELETE http://localhost:8000/alerts/:id
```

### **Payment & Facilitator**
```bash
# Settle payment via Thirdweb X402 facilitator (EVM or Solana)
POST http://localhost:8000/api/payment/settle
Body: {
  "resourceUrl": "...",
  "paymentData": {...},
  "price": "$0.30",
  "chain": "evm" or "solana" (optional, defaults to "evm")
}

# Get supported payment methods
GET http://localhost:8000/api/payment/methods?chainId=8453&chain=evm
GET http://localhost:8000/api/payment/methods?chain=solana
```

---

## 🎨 **UI Components**

### **Market Header**
- Logo and branding with improved visibility
- Search bar with real-time filtering
- Category navigation (8+ categories)
- Unified wallet connection (EVM & Solana via Thirdweb)
- Market statistics display (Total Markets)
- Navigation menu (Watchlist, Alerts, History, FAQ)
- Notification badge on Alerts icon
- Help button with tour restart
- Pro features dropdown (Points & Rewards - Coming Soon)

### **Market Card (Full)**
- Market question and description
- Visual probability bar (YES/NO split)
- Separate YES/NO price cards
- 2x2 Analytics grid:
  - Volume 24h
  - Liquidity
  - Last Update (time ago)
  - Market Age (time ago)
- Time remaining indicator
- Active status badge
- Get AI Analysis button

### **Market Card (Compact)**
- Question and price change
- Visual probability bar
- Volume and liquidity
- Quick analyze button

### **AI Facilitator Modal**
- Unified wallet connection prompt (EVM or Solana via Thirdweb)
- Payment processing ($0.30 USDC) via Thirdweb X402 facilitator (EVM or Solana)
- Phantom auto-connect to Solana when connected as EVM
- Manual "Connect Solana" button for Phantom users
- Automatic chain detection based on connected wallet
- Premium analysis display with 11 detailed sections
- Executive summary, market context, fundamental/technical analysis
- Key factors, opportunity analysis, price analysis
- Risk assessment, competitive analysis, action plan
- Signal cards with recommendations and chain badge (EVM/Solana)
- Full analysis history tracking with chain information

### **Watchlist Page** (`/watchlist`)
- Grid view of saved markets
- Market notes display and editing
- Remove markets functionality
- Empty state with helpful message
- Quick access from header

### **Alerts Page** (`/alerts`)
- Tabbed interface (Active/Triggered/Cancelled)
- Alert creation form
- Alert management (edit/cancel)
- Email settings and verification
- Notification badge count
- Empty states for each tab

### **History Page** (`/history`)
- Signal purchase history with chain tracking
- Filter by recommendation type
- Sort by date, confidence, price target
- Signal statistics dashboard
- Detailed signal cards with chain badges (EVM/Solana)
- Full analysis display
- Total spent calculation ($0.30 USDC per signal)

### **Help/FAQ Page** (`/help`)
- Search functionality
- Category filters
- Accordion UI for questions
- Contact section
- Comprehensive documentation

### **Footer Component**
- Brand information
- Quick links (FAQ, GitHub, Twitter)
- Social media icons
- Copyright notice

---

## 🔧 **Development**

### **Project Structure**

```
PolyCaster/
├── polycasterz/          # Next.js frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   │   ├── market/   # Market-related components
│   │   │   ├── wallet/   # Wallet components
│   │   │   └── ai/       # AI analysis components
│   │   ├── lib/          # Utilities and helpers
│   │   │   ├── categories/ # Category definitions
│   │   │   ├── api.ts    # API client
│   │   │   ├── utils.ts  # Helper functions
│   │   │   └── thirdweb.ts # Web3 config
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
│
└── backend-ts/           # Express.js backend
    ├── src/
    │   ├── index.ts      # Main server file
    │   ├── services/     # Business logic
    │   │   ├── polymarket.ts # Polymarket API service
    │   │   ├── ai-engine.ts  # AI analysis service
    │   │   ├── database.ts   # Supabase database service
    │   │   ├── facilitator.ts # Thirdweb X402 payment facilitator (EVM + Solana)
    │   │   ├── alert-checker.ts # Background alert monitoring
    │   │   └── email.ts   # Resend email service
    │   └── types/        # TypeScript types
    ├── migrations/       # Database migrations
    │   ├── 000_users.sql
    │   ├── 001_watchlist.sql
    │   ├── 002_price_alerts.sql
    │   └── 003_add_user_email.sql
    └── package.json
```

### **Key Functions**

**Backend (`backend-ts/src/services/polymarket.ts`):**
- `getMarketsByCategory(category, limit)` - Fetch markets by category
- `searchMarkets(searchTerm, limit)` - Search markets by keyword
- `transformMarket(market)` - Transform Polymarket data
- `getTrendingMarkets()` - Get high-volume markets

**Frontend (`polycasterz/src/lib/utils.ts`):**
- `formatPrice(price)` - Format price in cents
- `formatVolume(volume)` - Format with K/M suffixes
- `formatTimeAgo(date)` - Convert to "X hours ago"
- `formatTimeRemaining(date)` - Convert to "Xd Yh"

**Frontend Hooks (`polycasterz/src/hooks/`):**
- `useWatchlist()` - Watchlist management
- `useAlerts()` - Price alerts management
- `useActiveAccount()` - Wallet connection state
- `useAlertNotifications()` - Alert notification polling
- `useSignals()` - Signal purchase history
- `useMarketFilters()` - Market filtering logic
- `useOnboarding()` - Onboarding tour state

**Backend Services (`backend-ts/src/services/`):**
- `DatabaseService` - Supabase database operations
- `PolymarketService` - Polymarket API integration
- `AIEngineService` - OpenAI GPT-4o AI analysis generation (Ollama fallback)
- `FacilitatorService` - Thirdweb X402 payment processing (EVM + Solana)
- `AlertCheckerService` - Background price alert monitoring
- `EmailService` - Resend email delivery

---

## 🚀 **Deployment**

### **Frontend Deployment (Vercel)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd polycasterz
vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
# NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
```

### **Backend Deployment (Vercel/Railway/Render)**

```bash
# Deploy backend to Railway/Render
# Set environment variables:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - PORT=8000
# - NODE_ENV=production

# Build command:
npm run build

# Start command:
npm start
```

### **Environment Variables Checklist**

**Frontend (Production):**
- ✅ `NEXT_PUBLIC_API_URL` - Backend API URL
- ✅ `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` - Thirdweb client ID
- ✅ `NEXT_PUBLIC_SERVER_WALLET` - EVM server wallet address
- ✅ `NEXT_PUBLIC_SOLANA_SERVER_WALLET` - Solana server wallet address
- ✅ `NEXT_PUBLIC_SOLANA_RPC_URL` - Solana RPC endpoint (Helius, QuickNode, etc.)

**Backend (Production):**
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Public anon key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)
- ✅ `PORT` - Server port (default 8000)
- ✅ `NODE_ENV=production` - Production mode
- ✅ `FRONTEND_URL` - Frontend URL for CORS (e.g., https://your-frontend.vercel.app)
- ✅ `RESEND_API_KEY` - Resend API key for email service
- ✅ `EMAIL_FROM` - Verified sender email address
- ✅ `OPENAI_API_KEY` - OpenAI API key for AI analysis
- ✅ `BASE_RPC_URL` - Base Sepolia RPC endpoint
- ✅ `USDC_CONTRACT_ADDRESS` - USDC contract on Base Sepolia
- ✅ `SERVER_WALLET` - EVM server wallet address (Base Sepolia)
- ✅ `SOLANA_SERVER_WALLET` - Solana server wallet address (for Thirdweb X402)
- ✅ `OPENAI_MODEL` - OpenAI model (default: gpt-4o)

### **Production Checklist**

- [ ] Update CORS origins in backend to match frontend domain
- [ ] Set up SSL/HTTPS for both frontend and backend
- [ ] Configure rate limiting for API endpoints
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure logging service
- [ ] Set up database backups
- [ ] Test all payment flows
- [ ] Review and secure environment variables

---

## 📈 **Roadmap**

### **✅ Completed (v2.7.0) - FREE TIER - 100% Complete**
- ✅ Next.js 16 frontend with TypeScript
- ✅ TypeScript backend with Express.js
- ✅ Real-time market search with debouncing
- ✅ Category-based filtering (8+ categories)
- ✅ Advanced filters (Status, Price Range, Volume Range)
- ✅ Sorting options (Price, Liquidity, Time)
- ✅ Enhanced market cards with visual probability
- ✅ Thirdweb wallet integration
- ✅ Email & social login (Thirdweb In-App Wallet)
- ✅ AI analysis modal with premium reports
- ✅ Watchlist feature (save up to 10 markets)
- ✅ Price alerts with email notifications
- ✅ ROI calculator
- ✅ Signal purchase history
- ✅ Email verification flow
- ✅ Onboarding tour (8 steps)
- ✅ Help & FAQ page
- ✅ Landing page with hero section
- ✅ Footer component
- ✅ Mobile responsive design
- ✅ Dark/Light mode toggle
- ✅ Performance optimizations (React Query caching)
- ✅ Smart notification system
- ✅ Brand visibility improvements
- ✅ Unified Thirdweb X402 facilitator (EVM + Solana)
- ✅ Phantom auto-connect to Solana
- ✅ OpenAI GPT-4o integration (primary AI model)
- ✅ Updated analysis fee to $0.30 USDC
- ✅ Removed PayAI facilitator (migrated to Thirdweb X402)

### **🚧 In Progress / Planned (v3.0) - PRO TIER**
- 📝 Portfolio Tracking
- 📝 Market Scanner
- 📝 Market Compare Tool
- 📝 Signal Leaderboard
- 📝 Enhanced Alerts (Unlimited, Advanced Conditions)
- 📝 Browser Push Notifications
- 📝 Data Export (CSV/JSON)
- 📝 API Access
- 📝 Points & Rewards System

### **📝 Future Enhancements (v3.5+)**
- 📝 Trading bot integration
- 📝 Advanced charts and analytics
- 📝 Social trading features
- 📝 NFT membership tiers
- 📝 Mobile app (React Native)
- 📝 SMS/WhatsApp notifications
- 📝 Community features

---

## 🧪 **Testing**

### **Backend API Tests**

```bash
# Test backend health
curl http://localhost:8000/health

# Should return:
# {
#   "status": "healthy",
#   "services": {
#     "api": "running",
#     "polymarket": "healthy",
#     "ai_engine": "healthy",
#     "facilitator": "healthy",
#     "database": "healthy"
#   }
# }

# Search markets
curl "http://localhost:8000/markets/search?q=bitcoin&limit=5"

# Get crypto markets
curl "http://localhost:8000/markets/category/crypto?limit=10"

# Get trending markets
curl "http://localhost:8000/markets/trending?limit=5"

# Get all categories
curl http://localhost:8000/markets/categories

# Get market overview
curl "http://localhost:8000/markets/overview?limit=5"
```

### **Frontend Tests**

```bash
# Test frontend is running
curl http://localhost:3000

# Check specific routes (returns HTML)
curl http://localhost:3000/
```

### **Integration Tests**

```bash
# Test full flow - search from frontend to backend
# 1. Open http://localhost:3000
# 2. Type "bitcoin" in search bar
# 3. Should see filtered crypto markets
# 4. Click "Get AI Analysis" on any market
# 5. Should prompt for wallet connection
```

---

## 🤝 **Contributing**

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Write clean, documented code
- Test your changes thoroughly
- Update README if needed

---

## 📄 **License**

MIT License - See [LICENSE](LICENSE) file for details

---

## 🔗 **Links**

- **Polymarket**: [polymarket.com](https://polymarket.com)
- **Thirdweb**: [thirdweb.com](https://thirdweb.com)
- **Supabase**: [supabase.com](https://supabase.com)
- **Next.js**: [nextjs.org](https://nextjs.org)

---

## 🙏 **Acknowledgments**

- **Polymarket** - Real-time prediction market data
- **Thirdweb** - Unified Web3 wallet infrastructure & X402 payment facilitator (EVM + Solana)
- **Supabase** - PostgreSQL database with Row Level Security
- **Resend** - Email delivery service
- **OpenAI** - GPT-4o AI model for market analysis (primary)
- **Ollama** - Local AI inference for market analysis (fallback)
- **Vercel** - Frontend hosting
- **Next.js Team** - Amazing framework

---

## ⚡ **Performance & Optimization**

### **Frontend Optimizations**
- ✅ Debounced search (500ms) - Reduces API calls
- ✅ React Server Components - Faster initial load
- ✅ Image optimization - Next.js automatic optimization
- ✅ Code splitting - Smaller bundle sizes
- ✅ Lazy loading - Components load on demand

### **Backend Optimizations**
- ✅ Efficient API calls - Batch requests where possible
- ✅ Market caching - Reduces external API calls
- ✅ Connection pooling - Database performance
- ✅ Error handling - Graceful fallbacks
- ✅ Health monitoring - Service status tracking

### **Best Practices**
- Search is debounced (500ms) to avoid overwhelming the API
- Markets are fetched in batches (default 20, max 150)
- Category filters use keyword matching for speed
- AI analysis requires payment ($0.30 USDC) to prevent abuse
- OpenAI GPT-4o used for primary AI analysis (Ollama as fallback)
- Thirdweb X402 facilitator handles both EVM and Solana payments
- Phantom wallet automatically connects to Solana when connected as EVM
- React Query caching (5min stale time) reduces API calls by 70%
- Alert polling only runs when tab is visible (Tab Visibility API)
- Manual refresh buttons give users control over data updates
- Email notifications use Resend for reliable delivery
- Database migrations ensure schema consistency
- Row Level Security (RLS) policies protect user data

---

## 📞 **Support**

Need help? Have questions?

- 📧 **Issues**: Open an issue on GitHub
- 💻 **Development**: Check the troubleshooting section
- 📚 **Documentation**: Review API endpoints above
- 🤝 **Contributing**: See contributing guidelines

---

<div align="center">

Made with ❤️ by the PolyCaster Team

**PolyCaster - AI-Powered Polymarket Analytics**

[⭐ Star us on GitHub](https://github.com/isaac-richie/casterz)

**Social Links:**
- 🐦 [Twitter/X](https://x.com/polycaster)
- 💻 [GitHub](https://github.com/isaac-richie/casterz)

</div>
