<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,25,27&height=180&section=header&text=Joya&fontSize=60&fontColor=fff&fontAlignY=35&animation=fadeIn&desc=Discover%20•%20Host%20•%20Experience&descSize=20&descAlignY=55"/>

<div align="center">

### 🏨 A Modern Full-Stack Travel Booking Platform

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Tejaswarupsurya/Joya-React)

[![CI](https://github.com/Tejaswarupsurya/Joya-React/actions/workflows/ci.yml/badge.svg)](https://github.com/Tejaswarupsurya/Joya-React/actions/workflows/ci.yml)
[![CD](https://github.com/Tejaswarupsurya/Joya-React/actions/workflows/cd.yml/badge.svg)](https://github.com/Tejaswarupsurya/Joya-React/actions/workflows/cd.yml)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

<br/>

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

<br/>

![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

<br/>

**A production-ready travel accommodation platform rebuilt from EJS to a modern React + TypeScript SPA, featuring a fully decoupled REST API backend, Stripe payments, OTP-based email verification, interactive Mapbox maps, CI/CD with GitHub Actions, and Docker deployment on AWS EC2.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Monorepo Structure](#-monorepo-structure)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Authentication System](#-authentication-system)
- [Payment Integration](#-payment-integration)
- [Email System](#-email-system)
- [Search & Filtering](#-search--filtering)
- [Testing](#-testing)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Joya** is a comprehensive travel listing platform that enables users to discover, book, and review unique accommodations worldwide. The platform has been completely **migrated from an EJS server-rendered application to a modern React + TypeScript Single Page Application (SPA)** with a fully decoupled Express REST API backend.

### ✨ What's New vs. Old EJS Version

| Area | Old (EJS) | New (React) |
|------|-----------|-------------|
| **Frontend** | Server-side EJS templates | React 19 + TypeScript SPA |
| **Build Tool** | None (plain HTML served) | Vite 8 with optimized bundle |
| **State Management** | Flash messages + sessions | TanStack Query v5 (server state) |
| **Routing** | Express server-side routing | React Router DOM v7 (client-side) |
| **Styling** | Bootstrap 5 | Bootstrap 5 + custom component CSS |
| **API Architecture** | Monolithic (views + API together) | Fully decoupled REST API (`/api/*`) |
| **Type Safety** | None | TypeScript 6 end-to-end |
| **Auth Flow** | Session-only with EJS flash | Passport sessions + typed API responses |
| **Maps** | Script-tag Mapbox in EJS | React component with dynamic lazy-load |

### ✨ Platform Highlights

| Feature | Description |
|---|---|
| 💳 **Real Payments** | Stripe Checkout with webhook confirmation & auto-expiry |
| 📧 **Transactional Emails** | OTP verification, booking confirmations, cancellations, welcome |
| 🔐 **Secure Auth** | Passport.js sessions + JWT OTP verification via email |
| 🗺️ **Interactive Maps** | Mapbox GL JS with globe projection, custom markers & popups |
| 👥 **Multi-Role System** | User, Host, and Admin with granular middleware guards |
| 🔍 **Smart Filtering** | Category, price range, facilities, sort — URL-param synced |
| 🔄 **Synonym Search** | Backend synonym expansion (e.g. "pool" → "swimming pool") |
| ❤️ **Wishlist** | Optimistic UI updates with TanStack Query cache mutations |
| ⭐ **Review System** | One-review-per-booking enforcement with star ratings |
| 🐳 **Containerized** | Multi-stage Docker build for lean production images |
| 🚀 **CI/CD Pipeline** | GitHub Actions: CI on GitHub runner, CD on self-hosted EC2 runner |

---

## 📂 Monorepo Structure

```
Joya-React/                   # Monorepo root
├── 📂 Joya-Frontend/         # React 19 + TypeScript SPA (Vite)
└── 📂 Joya-Backend/          # Express 5 REST API (Node.js 22)
```

Both applications live in the same Git repository and are deployed separately — the **Backend** runs in Docker on AWS EC2, and the **Frontend** is served as a static build (CDN / hosting of your choice).

---

## ✨ Key Features

### 🛏️ Accommodation Categories

<div align="center">

| 🏨 Hotel | 🏖️ Beach | 🏞️ Lakefront | 🏢 Resort | 🏡 Villa |
|:-:|:-:|:-:|:-:|:-:|
| 🏠 **Apartment** | 🏘️ **Homestay** | ⛰️ **Terrain** | 🛖 **Cottage** | ⛷️ **Ski Resort** |

</div>

### 🛎️ Available Facilities

```
Free Wi-Fi • Air Conditioning • Hot Water • TV • Security Cameras
Parking • Breakfast Included • Restaurant Onsite • Room Service
Swimming Pool • Pet Allowed • Wheelchair Accessible • Fire Safety
```

---

### 👤 For Guests

| Feature | Description |
|---|---|
| 🔍 **Smart Search** | Filter by category, keyword, price range, facilities & sort |
| 📍 **Interactive Map** | Mapbox GL JS map per listing with globe projection & animated marker |
| 📅 **Date Picker** | Flatpickr with booked-dates exclusion |
| 💳 **Stripe Checkout** | Hosted Stripe payment page with webhook confirmation |
| 📧 **Email Confirmations** | Booking details emailed on payment success |
| ❤️ **Wishlist** | Optimistic UI with instant cache updates |
| ⭐ **Reviews** | 1-5 star ratings, one per listing, can be deleted by author/host/admin |
| 👤 **User Dashboard** | Bookings, reviews, wishlist, profile management, change email/password |

### 🏠 For Hosts

| Feature | Description |
|---|---|
| 📝 **Host Application** | Upload avatar photo, fill KYC details, pending admin review |
| 🏠 **Listing Management** | Create, edit, delete listings with image upload (5MB limit) |
| 📸 **Cloudinary Images** | Direct Cloudinary upload via Multer, CDN delivery |
| 📊 **Host Dashboard** | Incoming bookings, earnings, listing overview |
| 🔄 **Re-Application** | Rejected hosts can re-apply |

### 🔧 For Admins

| Feature | Description |
|---|---|
| ✅ **Host Approvals** | Approve / reject host applications with email notification |
| 👥 **User Overview** | Platform-wide user and application listing |
| 📧 **Email Recovery** | Admin-triggered email recovery for locked-out users |
| 🔒 **Access Control** | `requireRole('admin')` middleware guard on all admin routes |
| 🏠 **Listing Moderation** | Edit or delete any listing |
| ⭐ **Review Moderation** | Delete any review |

---

## 🛠️ Tech Stack

### Frontend (`Joya-Frontend`)

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.7 | UI framework |
| **TypeScript** | 6.0.2 | Static typing |
| **Vite** | 8.1.1 | Build tool & dev server |
| **React Router DOM** | 7.18.1 | Client-side routing |
| **TanStack Query** | 5.101.4 | Server state management & caching |
| **Axios** | 1.18.1 | HTTP client |
| **Flatpickr** | 4.6.13 | Date picker |
| **Sonner** | 2.0.7 | Toast notifications |
| **Mapbox GL JS** | 3.0.1 | Interactive maps (CDN lazy-load) |
| **Bootstrap 5** | CDN | UI components & grid |

### Backend (`Joya-Backend`)

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 22.14.0 | Runtime |
| **Express** | 5.1.0 | Web framework |
| **MongoDB** | Atlas | Cloud database |
| **Mongoose** | 8.13.2 | ODM with schema validation |
| **Passport.js** | 0.7.0 | Session-based authentication |
| **passport-local-mongoose** | 8.0.0 | PBKDF2 password hashing |
| **JWT (jsonwebtoken)** | 9.0.3 | OTP token generation |
| **Stripe** | 20.1.0 | Payment processing |
| **Nodemailer** | 7.0.11 | Transactional emails (SMTP) |
| **Multer** | 2.0.0 | File upload middleware |
| **Cloudinary** | 1.41.3 | Image CDN storage |
| **Mapbox SDK** | 0.16.1 | Server-side geocoding |
| **Joi** | 17.13.3 | Request body validation |
| **Helmet** | 8.1.0 | HTTP security headers |
| **Compression** | 1.8.0 | Gzip response compression |
| **CORS** | 2.8.6 | Cross-origin resource sharing |
| **connect-mongo** | 5.1.0 | MongoDB session store |

### Cloud & DevOps

| Service / Tool | Purpose |
|---|---|
| **MongoDB Atlas** | Database hosting |
| **Cloudinary** | Image storage & CDN |
| **Mapbox** | Maps & geocoding |
| **Stripe** | Payment processing & webhooks |
| **SMTP (Gmail/TLS)** | Email delivery |
| **Docker** | Multi-stage containerization |
| **GitHub Actions** | CI/CD pipeline automation |
| **AWS EC2** | Production server |
| **Self-Hosted Runner** | CD deployment directly on EC2 |

### Testing

| Tool | Purpose |
|---|---|
| **Jest** | Testing framework |
| **Supertest** | HTTP endpoint assertions |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (SPA)                               │
│                   React 19 + TypeScript + Vite                           │
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │ React Router  │  │ TanStack Query│  │    Sonner     │               │
│  │  DOM v7 (CSR) │  │  (Data Cache) │  │   (Toasts)    │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│                                                                          │
│  Pages: Listings • Detail • Booking • Dashboards • Auth • Payment       │
│  Components: Navbar • CategoryBar • FilterModal • ListingMap • Cards    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP (Axios) – /api/*
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXPRESS 5 REST API                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                       MIDDLEWARE LAYER                            │   │
│  │  CORS • Helmet • Compression • Session • Passport • Joi Validate │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                         API ROUTES                                │   │
│  │  /api/auth  /api/listings  /api/listings/:id/reviews             │   │
│  │  /api/listings/:id/bookings  /api/wishlist  /api/payments        │   │
│  │  /api/dashboard  /api/apply  /api/host/dashboard                 │   │
│  │  /api/admin/*                                                     │   │
│  │  /payments/webhook  (raw body — Stripe webhook)                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        CONTROLLERS                                │   │
│  │  auth • listing • booking • payment • review • host • admin      │   │
│  │  user • wishlist                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────┬────────────────────────┬────────────────────────┘
                       │                        │
          ┌────────────┘                        └─────────────────────┐
          ▼                                                            ▼
┌──────────────────────┐   ┌─────────────────┐   ┌──────────────────────┐
│    MONGODB ATLAS     │   │  STRIPE         │   │  EXTERNAL SERVICES   │
│                      │   │                 │   │                      │
│  User • Listing      │   │  Checkout       │   │  Cloudinary (CDN)    │
│  Booking • Review    │   │  Session        │   │  Mapbox (Geocoding)  │
│  (TTL index for      │   │  Webhook        │   │  SMTP (Nodemailer)   │
│   expired bookings)  │   │  Signature      │   │                      │
└──────────────────────┘   └─────────────────┘   └──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (Backend tested on Node 22)
- **MongoDB Atlas** account — [Create free](https://www.mongodb.com/cloud/atlas)
- **Cloudinary** account — [Sign up](https://cloudinary.com/)
- **Mapbox** account — [Get token](https://www.mapbox.com/)
- **Stripe** account — [Dashboard](https://dashboard.stripe.com/)
- **Gmail App Password** (or any SMTP) for transactional emails

---

### Backend Setup

```bash
# 1. Enter the backend directory
cd Joya-Backend

# 2. Install dependencies
npm install

# 3. Configure environment (see Environment Variables section below)
cp .env.example .env   # or create .env manually

# 4. Start development server
npm run dev
# → http://localhost:3000
```

### Frontend Setup

```bash
# 1. Enter the frontend directory
cd Joya-Frontend

# 2. Install dependencies
npm install

# 3. Configure environment
# Create .env in Joya-Frontend/ with:
# VITE_MAPBOX_TOKEN=your_mapbox_public_token

# 4. Start dev server
npm run dev
# → http://localhost:5173

# 5. Production build
npm run build
# Output in dist/
```

> **CORS**: The backend is pre-configured to accept requests from `http://localhost:5173` in development. Update the `cors` origin in `app.js` to match your production frontend URL.

---

## 🔑 Environment Variables

### Backend (`Joya-Backend/.env`)

```env
# ═══════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/joya

# ═══════════════════════════════════════════════════════════
# SESSION & SECURITY
# ═══════════════════════════════════════════════════════════
SECRET=your-session-secret-min-32-chars
JWT_SECRET=your-jwt-secret-for-otp-tokens

# ═══════════════════════════════════════════════════════════
# CLOUDINARY (Image Storage)
# ═══════════════════════════════════════════════════════════
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# ═══════════════════════════════════════════════════════════
# MAPBOX (Server-side Geocoding)
# ═══════════════════════════════════════════════════════════
MAP_TOKEN=your-mapbox-secret-token

# ═══════════════════════════════════════════════════════════
# STRIPE (Payments)
# ═══════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Base URL used for Stripe success/cancel redirect URLs
BASE_URL=http://localhost:5173

# ═══════════════════════════════════════════════════════════
# EMAIL (SMTP via Nodemailer)
# ═══════════════════════════════════════════════════════════
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM="Joya" <noreply@joya.com>

# ═══════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════
PORT=3000
NODE_ENV=development
```

### Frontend (`Joya-Frontend/.env`)

```env
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token
```

---

## 📁 Project Structure

### Frontend (`Joya-Frontend/`)

```
Joya-Frontend/
├── 📄 index.html               # App shell
├── 📄 vite.config.ts           # Vite config
├── 📄 tsconfig.app.json        # TypeScript config
├── 📄 package.json
├── 📄 .env                     # VITE_MAPBOX_TOKEN
│
└── 📂 src/
    ├── 📄 main.tsx             # Entry: QueryClientProvider + BrowserRouter + Toaster
    ├── 📄 App.tsx              # Route tree (React Router DOM v7)
    ├── 📄 index.css            # Global resets
    │
    ├── 📂 api/                 # Axios API functions (typed)
    │   ├── axios.ts            # Axios instance (baseURL: /api)
    │   ├── auth.ts             # Login, logout, signup, OTP, forgot, change email/password
    │   ├── listings.ts         # CRUD + edit-prefill
    │   ├── bookings.ts         # Booking details, cancel, confirm
    │   ├── reviews.ts          # Add / delete review
    │   ├── wishlist.ts         # Add / remove
    │   ├── host.ts             # Apply as host
    │   ├── admin.ts            # Approve / reject host applications
    │   └── user.ts             # Dashboard data
    │
    ├── 📂 types/               # TypeScript type definitions
    │   ├── user.ts             # CurrentUser, AuthResponse, OTP flows, credentials
    │   ├── listing.ts          # Listing, ListingOwner, ListingGeometry
    │   ├── booking.ts          # Booking, BookingStatus, Stripe session types
    │   └── review.ts           # Review
    │
    ├── 📂 hooks/
    │   └── useAuth.ts          # Convenience hook for /api/auth/me query
    │
    ├── 📂 constants/
    │   ├── categories.ts       # Listing category list
    │   └── facilities.ts       # Facility options list
    │
    ├── 📂 schemas/             # Zod/validation schemas (client-side)
    │
    ├── 📂 layouts/
    │   └── MainLayout.tsx      # Wraps all routes: Navbar + <Outlet> + Footer
    │
    ├── 📂 components/
    │   ├── 📂 common/
    │   │   ├── Navbar.tsx      # Auth-aware nav with role-based menu items
    │   │   └── Footer.tsx
    │   ├── 📂 listings/
    │   │   ├── CategoryBar.tsx      # Category filter scroll bar
    │   │   ├── FilterModal.tsx      # Price, facilities, sort filter modal (URL-synced)
    │   │   ├── ListingCard.tsx      # Listing grid card with wishlist toggle
    │   │   ├── ListingGrid.tsx      # Responsive grid wrapper
    │   │   ├── ListingMap.tsx       # Mapbox GL JS with lazy script load
    │   │   ├── ListingSkeleton.tsx  # Skeleton loading state
    │   │   ├── ListingDetailSkeleton.tsx
    │   │   ├── EditListingSkeleton.tsx
    │   │   └── NoResults.tsx        # Empty state UI
    │   ├── 📂 bookings/        # Booking-related components
    │   ├── 📂 payments/        # Payment status components
    │   └── 📂 reviews/         # Review form & list components
    │
    └── 📂 pages/               # Route-level page components
        ├── ListingsPage.tsx         # Main listing index with search + filters
        ├── ListingDetailPage.tsx    # Single listing with map + reviews + booking CTA
        ├── NewListingPage.tsx       # Create listing form (Host only)
        ├── EditListingPage.tsx      # Edit listing form (Owner / Admin)
        ├── NewBookingPage.tsx       # Date selection + Stripe checkout initiation
        ├── BookingDetailPage.tsx    # Booking info + cancel
        ├── PaymentSuccessPage.tsx   # Post-payment confirmation
        ├── PaymentCancelPage.tsx    # Cancelled payment page
        ├── UserDashboardPage.tsx    # Bookings, reviews, wishlist, profile
        ├── HostDashboardPage.tsx    # Host listings, incoming bookings, earnings
        ├── AdminDashboardPage.tsx   # Host application management
        ├── ApplyHostPage.tsx        # Host KYC application form
        ├── LoginPage.tsx
        ├── SignupPage.tsx
        ├── VerifyEmailPage.tsx      # OTP entry after signup
        ├── ForgotPasswordPage.tsx   # Username + email → OTP → new password
        ├── UpdatePasswordPage.tsx   # Change password (logged-in)
        ├── ChangeEmailPage.tsx      # Change email (logged-in)
        ├── InfoComingSoonPage.tsx   # Placeholder for info sub-pages
        └── NotFoundPage.tsx         # 404 catch-all
```

### Backend (`Joya-Backend/`)

```
Joya-Backend/
├── 📄 app.js                   # Express app setup, middleware, route registration
├── 📄 middleware.js             # Auth guards, Joi validators, file filters
├── 📄 schema.js                 # Joi validation schemas
├── 📄 cloudConfig.js            # Cloudinary + Multer storage config
├── 🐳 Dockerfile               # Multi-stage build (builder → production)
├── 📄 package.json
│
├── 📂 .github/workflows/
│   ├── ci.yml                  # CI: test + Docker build (GitHub runner)
│   └── cd.yml                  # CD: Docker deploy to EC2 (self-hosted runner)
│
├── 📂 controllers/             # Business logic
│   ├── auth.js                 # Signup, login, logout, OTP, forgot, change email/password
│   ├── listing.js              # CRUD + search + geocoding
│   ├── booking.js              # Show, confirm, cancel bookings
│   ├── payment.js              # Stripe Checkout session + webhook
│   ├── review.js               # Add / delete review
│   ├── host.js                 # Apply + host dashboard
│   ├── admin.js                # Approve / reject / email recovery
│   ├── user.js                 # User dashboard data
│   └── wishlist.js             # Add / remove / get wishlist
│
├── 📂 models/                  # Mongoose schemas
│   ├── user.js                 # User (roles, host sub-doc, wishlist, OTP)
│   ├── listing.js              # Listing (geometry, facilities, image, TTL)
│   ├── booking.js              # Booking (status workflow, Stripe IDs)
│   └── review.js               # Review (rating, author ref)
│
├── 📂 routes/
│   ├── listing.js              # /api/listings CRUD
│   ├── review.js               # /api/listings/:id/reviews
│   ├── booking.js              # /api/listings/:id/bookings
│   ├── host.js                 # /api/apply, /api/host/dashboard
│   ├── admin.js                # /api/admin/*
│   ├── user.js                 # /api/dashboard
│   ├── wishlist.js             # /api/wishlist
│   ├── payment.js              # /api/payments/* + /payments/webhook
│   └── api/
│       └── auth.js             # /api/auth/* (login, signup, OTP, password)
│
├── 📂 utils/
│   ├── ExpressError.js         # Custom error class
│   ├── wrapAsync.js            # Async route wrapper
│   ├── jwtHelper.js            # JWT OTP generation & verification
│   ├── emailService.js         # Nodemailer SMTP functions
│   ├── emailTemplates.js       # HTML email templates (6 types)
│   ├── bookingCleanup.js       # Auto-expire unpaid bookings (TTL scheduler)
│   ├── constants.js            # Categories & facilities master list
│   ├── searchSynonyms.js       # Query synonym expansion
│   └── review.js               # Average rating calculator
│
├── 📂 scripts/
│   ├── set-admin.js            # Promote a user to admin role
│   └── optimize-search.js     # Create MongoDB text indexes
│
└── 📂 tests/
    ├── basic.test.js           # Jest test suite (7 tests)
    └── setup.js                # Test config (NODE_ENV=test)
```

---

## 🛣️ API Reference

All API routes are prefixed with `/api`. CORS is configured for the frontend origin.

### 🔐 Auth Routes — `/api/auth`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/me` | — | Get current session user + wishlist |
| `POST` | `/login` | — | Passport local login |
| `POST` | `/logout` | — | Destroy session |
| `POST` | `/signup` | — | Register (triggers OTP email) |
| `GET` | `/pending-verification` | — | Check pending OTP session |
| `POST` | `/verify-email` | — | Submit OTP code |
| `POST` | `/resend-otp` | — | Resend OTP (60s cooldown) |
| `POST` | `/send-forgot-otp` | — | Send password-reset OTP |
| `POST` | `/forgot-password` | — | Reset password with OTP |
| `POST` | `/update-password` | ✅ | Change password (logged-in) |
| `POST` | `/change-email` | ✅ | Change email (logged-in) |

### 🏠 Listing Routes — `/api/listings`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/` | — | List all with query filters (`q`, `category`, `minPrice`, `maxPrice`, `facilities`, `sortBy`) |
| `POST` | `/` | Host | Create listing (image upload) |
| `GET` | `/:id` | — | Get single listing (reviews populated) |
| `PUT` | `/:id` | Host / Admin | Update listing (optional image) |
| `DELETE` | `/:id` | Host / Admin | Delete listing |
| `GET` | `/:id/edit` | Host / Admin | Prefill data for edit form |

### 📅 Booking Routes — `/api/listings/:id/bookings`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/new` | ✅ | Booking form data (listing info + booked dates) |
| `GET` | `/:bookingId` | ✅ Owner | Get booking detail |
| `PUT` | `/:bookingId/confirm` | ✅ | Confirm booking |
| `PUT` | `/:bookingId/cancel` | ✅ Owner | Cancel booking |

### 💳 Payment Routes — `/api/payments` & `/payments`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/payments/create-checkout-session` | ✅ | Create Stripe Checkout session |
| `GET` | `/api/payments/success` | ✅ | Payment success handler |
| `GET` | `/api/payments/cancel` | ✅ | Payment cancel handler |
| `POST` | `/payments/webhook` | — | Stripe webhook (raw body, signature verified) |

### ⭐ Review Routes — `/api/listings/:id/reviews`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/` | ✅ | Add review (one per user per listing) |
| `DELETE` | `/:reviewId` | ✅ | Delete review (author / admin / host owner) |

### ❤️ Wishlist Routes — `/api/wishlist`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/:id/add` | ✅ | Add listing to wishlist |
| `DELETE` | `/:id/remove` | ✅ | Remove from wishlist |

### 🏠 Host Routes — `/api`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/apply` | ✅ User | Submit host application (avatar upload) |
| `GET` | `/host/dashboard` | ✅ Host | Host dashboard data |

### 🔧 Admin Routes — `/api/admin`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/admin/dashboard` | ✅ Admin | List all host applications |
| `POST` | `/admin/:userId/approve` | ✅ Admin | Approve host application |
| `POST` | `/admin/:userId/reject` | ✅ Admin | Reject host application |
| `POST` | `/admin/email-recovery` | ✅ Admin | Trigger email recovery for user |

### 👤 User Route — `/api`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/dashboard` | ✅ | User dashboard data (bookings, reviews, wishlist) |

---

## 🔐 Authentication System

Joya uses **Passport.js with express-session** for authentication, combined with **JWT-based OTP** for email verification and password resets.

### 📝 Registration Flow

```
Signup Form → POST /api/auth/signup
     │
     ▼
 OTP Generated (JWT, 10-min expiry)
 Email sent with 6-digit code
     │
     ▼
GET /api/auth/pending-verification (check OTP timer)
POST /api/auth/verify-email (submit OTP)
     │
     ▼
 User created in DB → Welcome email sent → Session established
```

### 🔑 Password Reset Flow

```
POST /api/auth/send-forgot-otp (username + email)
     │
     ▼
 OTP email sent (6-digit, JWT-signed, 10-min expiry, 60s resend cooldown)
     │
     ▼
POST /api/auth/forgot-password (username + email + code + new password)
     │
     ▼
 Password updated → "Password Updated" email sent
```

### 🛡️ Security Features

| Feature | Implementation |
|---|---|
| 🔑 **OTP Verification** | 6-digit code, JWT-signed, 10-minute expiration |
| ⏱️ **Rate Limiting** | 60-second cooldown between OTP requests |
| 🔐 **JWT Tokens** | Stateless OTP verification without extra DB storage |
| 🔒 **Password Hashing** | PBKDF2 via passport-local-mongoose |
| 🍪 **Session Security** | HTTP-only cookies, 7-day expiry, MongoDB store (encrypted) |
| ✅ **Input Validation** | Joi schema validation on every endpoint |
| 🔒 **Role Guards** | `isLoggedIn`, `isHost`, `isHostOrAdmin`, `requireRole('admin')` |
| 📁 **File Validation** | MIME type check + 5MB size limit on uploads |

---

## 💳 Payment Integration

Joya uses **Stripe Checkout** (hosted) for payments. All bookings go through the payment flow — direct creation is disabled.

### 💰 Booking → Payment Flow

```
Select Dates (Flatpickr) → POST /api/payments/create-checkout-session
         │
         ▼
   Stripe Checkout Page (hosted)
         │
    ┌────┴────┐
    │         │
 Success    Cancel
    │         │
    ▼         ▼
 Webhook    GET /api/payments/cancel
 confirms   (booking stays pending_payment)
    │
    ▼
 Booking status → "confirmed"
 Confirmation email sent to user
```

### 📊 Booking Statuses

| Status | Description |
|---|---|
| `pending_payment` | Created, awaiting Stripe payment |
| `confirmed` | Payment successful, booking active |
| `cancelled` | Cancelled by user (email notification sent) |
| `expired` | Auto-expired via `bookingCleanup.js` scheduler (24h TTL) |

### ✅ Payment Features

- ✅ **Stripe Checkout** — Hosted, PCI-compliant payment page
- ✅ **Webhook Verification** — Stripe signature validation on raw body
- ✅ **Raw Body Middleware** — `/payments/webhook` registered before `express.json()`
- ✅ **Auto-Expiration** — `bookingCleanup.js` runs a periodic scheduler to expire unpaid bookings
- ✅ **Confirmation Emails** — Sent on successful `payment_intent.succeeded` webhook event

---

## 📧 Email System

Complete transactional email system powered by **Nodemailer** over SMTP (Gmail TLS, port 587).

### 📨 Email Types

| Email | Trigger | Content |
|---|---|---|
| 📨 **OTP Verification** | Signup | 6-digit verification code + expiry |
| 🔑 **Password Reset OTP** | Forgot password | 6-digit reset code |
| ✅ **Password Updated** | Successful password change | Security confirmation |
| 📅 **Booking Confirmed** | Stripe webhook success | Full booking details & dates |
| ❌ **Booking Cancelled** | User cancellation | Cancellation confirmation |
| 👋 **Welcome** | After email verification | Welcome message |

### 📬 Template Features

- 🎨 Professional HTML design with gradient headers
- 📱 Responsive layout for all screen sizes
- 🏷️ Consistent Joya branding
- 🔗 Clear call-to-action buttons

---

## 🔍 Search & Filtering

### Backend Search

| Feature | Description |
|---|---|
| 📝 **Text Search** | MongoDB text index on title, description, location |
| 🔄 **Synonym Expansion** | `searchSynonyms.js` — "pool" matches "swimming pool" |
| 🏷️ **Category Filter** | Exact match on category field |
| 💰 **Price Range** | `$gte` / `$lte` filters on price |
| 🛎️ **Facilities** | `$all` filter on facilities array |
| 🔢 **Sort** | Price asc/desc or relevance score |

### Frontend Filtering

- **CategoryBar** — Horizontal scroll bar of category icons; syncs `?category=` URL param
- **FilterModal** — Price range, facilities checkboxes, sort — all sync via `useSearchParams`
- **Search Input** — Navbar search input; syncs `?q=` URL param; triggers new query

All filters are URL-param driven, making the state shareable and browser-back navigable.

---

## 🧪 Testing

### Backend Tests

```bash
# Run the basic test suite
npm test

# Run with coverage report
npm test -- --coverage

# Run all test files
npm run test:all
```

### Current Coverage (basic.test.js — 7 tests)

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   60.97 |    40.00 |   60.00 |   60.52 |
 schema.js          |   50.00 |     0.00 |    0.00 |   50.00 |
 utils/ExpressError |  100.00 |   100.00 |  100.00 |  100.00 |
 utils/constants    |  100.00 |   100.00 |  100.00 |  100.00 |
 utils/review       |   46.15 |    50.00 |   66.66 |   40.00 |
--------------------|---------|----------|---------|---------|
```

### Test Cases

- ✅ `getAvgRating` — correct average calculation
- ✅ `getAvgRating` — returns 0 for empty reviews
- ✅ `getAvgRating` — handles null/undefined input
- ✅ Required environment variables defined
- ✅ Listing schema validation (valid data)
- ✅ Listing schema validation (invalid data rejection)
- ✅ ExpressError constructor properties

---

## 🔄 CI/CD Pipeline

GitHub Actions powers a **hybrid runner** CI/CD strategy:

```
Push to main branch
        │
   ┌────┴────┐
   │         │
   ▼         ▼
CI Workflow  CD Workflow
(GitHub     (Self-Hosted
 Runner)     EC2 Runner)
   │              │
   │  1. Checkout │  1. Checkout
   │  2. Node 18  │  2. Docker build
   │  3. npm ci   │  3. Stop old container
   │  4. npm test │  4. Run new container
   │  5. Docker   │     (--env-file .env)
   │     build    │
   ▼              ▼
 Validation    Live at EC2
```

### 🧪 CI Workflow (`.github/workflows/ci.yml`)

- **Runner:** `ubuntu-latest` (GitHub-hosted)
- **Trigger:** Push to `main` or any Pull Request
- **Steps:** Checkout → Node 18 → `npm ci` → `npm test` → Docker build validation

### 🚀 CD Workflow (`.github/workflows/cd.yml`)

- **Runner:** `self-hosted` (AWS EC2 instance with GitHub Actions runner installed)
- **Trigger:** Push to `main` branch
- **Steps:** Checkout → Docker build → Stop old container → Run new container (port 3000, env file)

### 🎯 Key CI/CD Features

| Feature | Detail |
|---|---|
| 🔀 **Dual Runners** | GitHub-hosted for CI validation, self-hosted for CD deployment |
| 🐳 **Docker Build** | Multi-stage build in both pipelines |
| 🧪 **Auto Tests** | Jest suite on every push |
| 🔄 **Zero-Downtime swap** | Stop old → Start new container pattern |
| 🔐 **Secure Secrets** | `.env` file stored on EC2, not in repo |
| 📦 **npm cache** | Faster CI dependency installs |

---

## 🐳 Deployment

### 🐳 Docker (Backend)

The Dockerfile uses a **2-stage build** for a lean production image:

```dockerfile
# Stage 1: Builder — install only production deps
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Production — minimal runtime image
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]
```

**Manual Docker commands:**

```bash
# Build
docker build -t joya-app:latest .

# Run
docker run -d \
  --name joya-app \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  joya-app:latest

# Logs
docker logs -f joya-app
```

### 🖥️ AWS EC2 Setup

```bash
# 1. SSH into instance
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# 2. Install Docker
sudo apt update && sudo apt install docker.io -y
sudo usermod -aG docker ubuntu

# 3. Install GitHub Actions self-hosted runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L <runner-download-url>
tar xzf actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/Tejaswarupsurya/Joya-React --token <token>
sudo ./svc.sh install && sudo ./svc.sh start

# 4. Place environment file
nano /home/ubuntu/.env
# Paste all backend environment variables
```

### Frontend Deployment

The React SPA (`npm run build`) outputs a static `dist/` folder that can be deployed to:

- **Vercel** — `vercel --prod` (recommended, zero-config)
- **Netlify** — Drag & drop `dist/` or Git integration
- **AWS S3 + CloudFront** — For full AWS setup
- **Nginx** — Serve `dist/` as static files with `try_files $uri /index.html`

> **Important:** Set the production backend URL as a `VITE_API_BASE_URL` env var and update `src/api/axios.ts` accordingly. Also update the `cors` origin in `Joya-Backend/app.js` to match your production frontend domain.

### ✅ Production Checklist

- [x] Multi-stage Docker build
- [x] CI pipeline with automated tests
- [x] CD pipeline with self-hosted runner
- [x] CORS configured for frontend origin
- [x] Stripe webhook raw-body middleware ordering
- [x] Frontend TypeScript build passes (`tsc -b && vite build`)
- [ ] Set `NODE_ENV=production` in container env
- [ ] Set `BASE_URL` to production frontend URL (for Stripe redirects)
- [ ] Update `cors` origin in `app.js` to production frontend domain
- [ ] Configure Stripe **live** keys
- [ ] Register Stripe webhook endpoint in Stripe dashboard
- [ ] Configure production SMTP credentials
- [ ] Enable MongoDB Atlas IP whitelist / VPC peering
- [ ] Set strong `SECRET` and `JWT_SECRET` values
- [ ] Deploy frontend build to CDN / hosting
- [ ] (Optional) Nginx reverse proxy + SSL via Let's Encrypt

---

## 📜 NPM Scripts

### Backend

| Script | Command | Description |
|---|---|---|
| `start` | `node app.js` | Start production server |
| `dev` | `nodemon app.js` | Start development server |
| `test` | `jest tests/basic.test.js --runInBand` | Run basic tests |
| `test:all` | `jest` | Run all tests |
| `test:watch` | `jest --watch` | Watch mode |

### Frontend

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start Vite dev server |
| `build` | `tsc -b && vite build` | TypeScript check + production build |
| `lint` | `eslint .` | Run ESLint |
| `preview` | `vite preview` | Preview production build locally |

---

## 🛡️ Security Features

| Feature | Implementation |
|---|---|
| ✅ **Password Hashing** | PBKDF2 with salt (passport-local-mongoose) |
| ✅ **JWT OTP** | Stateless, short-lived tokens for email flows |
| ✅ **HTTP-Only Cookies** | Session cookie protected from XSS |
| ✅ **Input Validation** | Joi schema on every write endpoint |
| ✅ **MongoDB Injection** | Mongoose query sanitization |
| ✅ **Stripe Webhooks** | Signature verification via raw body |
| ✅ **Rate Limiting (OTP)** | 60-second resend cooldown |
| ✅ **Helmet** | HTTP security headers on all responses |
| ✅ **CORS** | Restricted to known frontend origin |
| ✅ **File Validation** | MIME type check + 5MB upload limit |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👤 Author

<div align="center">

**Tejaswarup Surya**

[![GitHub](https://img.shields.io/badge/GitHub-@Tejaswarupsurya-181717?style=for-the-badge&logo=github)](https://github.com/Tejaswarupsurya)

</div>

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

Made with ❤️ by [Tejaswarup Surya](https://github.com/Tejaswarupsurya)

</div>

<img width=100% src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,25,27&height=100&section=footer"/>
