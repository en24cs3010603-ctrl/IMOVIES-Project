# 🎬 IMovies – Movie Ticket Booking Made Simple

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=for-the-badge&logo=mongodb)](https://github.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express)](https://expressjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)

**IMovies** is an enterprise-grade full-stack MERN (MongoDB, Express.js, React 19, Node.js) movie ticket booking platform. It provides seamless movie discovery, real-time interactive cinema seat maps, atomic double-booking prevention, secure JWT authentication with Role-Based Access Control (RBAC), physical e-ticket receipts with barcode and tear notches, booking history management with scoped seat release, and an administrative console for movie catalog and show management.

---

## 📑 Table of Contents

- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Concurrency Safety](#-architecture--concurrency-safety)
- [Project Structure](#-project-structure)
- [Local Setup & Development](#-local-setup--development)
  - [Prerequisites](#prerequisites)
  - [Installation & Startup](#installation--startup)
  - [Environment Variables](#environment-variables)
  - [Database Seeding](#database-seeding)
- [REST API Documentation](#-rest-api-documentation)
- [Deployment Guide](#-deployment-guide)
  - [1. MongoDB Atlas](#1-mongodb-atlas)
  - [2. Backend (Render / Railway)](#2-backend-render--railway)
  - [3. Frontend (Vercel / Netlify)](#3-frontend-vercel--netlify)
- [Clean Export / Git Migration](#-clean-export--git-migration)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌟 Core Features

- 🔐 **JWT Authentication & RBAC**:
  - Secure registration and login with `bcryptjs` password hashing (salt factor 10).
  - Role-Based Access Control distinguishing regular `user` and `admin` permissions.
  - Persistent token management with automatic client Axios interceptors for authorization headers and 401 redirects.
  - Demo 1-click login quick-fill for testing (`alice@example.com` and `admin@imovies.com`).
- 🎬 **Movie Catalog & Live Search**:
  - Browse featured movies with poster artwork, synopsis, runtime, age ratings, and genre tags.
  - Live client-side keyword search and genre filter pills (All, Sci-Fi, Action, Animation, Drama).
- 🎟️ **Interactive Cinema Seat Matrix**:
  - Realistic curved projection screen indicator (`All Eyes This Way`).
  - 60-seat auditorium layout (Rows A–F, Columns 1–10).
  - Fluid mobile responsiveness down to 360px viewport widths with smooth horizontal scroll containment.
  - Instant micro-state transitions: Available (dark slate), Selected (luminous rose), and Booked (disabled slate).
- 🛡️ **Zero Double-Booking Guarantee (Atomic Operations)**:
  - High-concurrency safety using MongoDB atomic query locks:
    ```javascript
    await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: requestedSeats } },
      { $addToSet: { bookedSeats: { $each: requestedSeats } } },
      { new: true }
    );
    ```
  - Rejects reservations with HTTP 409 Conflict if any requested seat was claimed milliseconds earlier by another user.
- ⏰ **Past Showtime Protection**:
  - Blocks users from purchasing tickets for screenings that have already ended.
  - Displays `"Show Ended"` badge on movie listings and disables seat grid selection.
- 🎫 **Authentic Physical E-Ticket UI**:
  - Perforated cinema ticket card with semi-circular edge cutout notches and dashed tear-off line.
  - Monospace Booking Reference ID and simulated turnstile scan barcode.
  - One-click native print/save button (`window.print()`).
- 🔄 **Strict Scoped Seat Cancellation**:
  - Cancelling a booking releases seats **only** on the booked show via explicit `showId`, never by movie title or theater name string matching.
- ⚙️ **Admin Management Console**:
  - Protected dashboard (`/admin`) guarded by `ProtectedRoute` verifying `user.role === 'admin'`.
  - Add new movie listings with real-time field validation (runtime duration, 0–10 rating scale).
  - Delete movies and manage schedules.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React icons, React Router v7 |
| **Backend** | Node.js (v18+), Express.js 4.x, TypeScript, tsx runtime |
| **Database** | MongoDB Atlas / Local MongoDB via Mongoose ODM 9.x |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Axios request interceptors |
| **Dev Fallback** | Automatic in-memory mock store when `MONGO_URI` is disconnected |

---

## 🏛️ Architecture & Concurrency Safety

```text
[ React 19 Client SPA ] 
       │ (Axios + Bearer JWT Token Interceptor)
       ▼
[ Express.js REST API :3000 / :5000 ]
  ├── CORS & JSON Body Parser
  ├── Auth Middleware (verifyToken)
  ├── Admin Guard (requireAdmin)
  ├── Route Handlers (/api/auth, /api/movies, /api/shows, /api/bookings)
  └── Concurrency Engine ($addToSet & $nin atomic lock)
       │
       ▼
[ MongoDB Database ]
  ├── users      (name, email, passwordHash, role)
  ├── movies     (title, genre, duration, rating, poster, synopsis)
  ├── theatres   (name, location, screens)
  ├── shows      (movieId, theatreId, date, time, price, bookedSeats[])
  └── bookings   (userId, showId, movieId, theatreId, seats[], totalAmount, status)
```

---

## 📂 Project Structure

```text
imovies/
├── .env.example              # Root / frontend environment template
├── index.html                # HTML entry point with metadata and SEO tags
├── package.json              # Project dependencies & scripts (imovies-client)
├── server.ts                 # Express server mounting Vite dev middleware
├── server/
│   ├── .env.example          # Server environment template
│   ├── config/
│   │   └── db.ts             # Mongoose connection with fallback detection
│   ├── controllers/
│   │   ├── authController.ts # Register, login, current profile, demo fill
│   │   ├── movieController.ts# List movies, get by ID, add/delete movies
│   │   ├── showController.ts # Show listings, seat availability, future seeds
│   │   └── bookingController.ts # Atomic booking creation, past check, scoped cancel
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification & role authorization (verifyAdmin)
│   │   └── errorHandler.ts   # Centralized error formatter
│   ├── models/
│   │   ├── Booking.ts        # Booking schema (showId, movieId, theatreId, seats)
│   │   ├── Movie.ts          # Movie schema
│   │   ├── Show.ts           # Show schema with bookedSeats array
│   │   ├── Theatre.ts        # Theatre schema
│   │   └── User.ts           # User schema with bcrypt password hashing
│   └── seed/
│       └── seed.ts           # Database populator (movies, shows, demo accounts)
└── src/
    ├── App.tsx               # Route definitions & Toast provider
    ├── main.tsx              # React entry point
    ├── index.css             # Tailwind CSS v4 entry
    ├── api/
    │   └── client.ts         # Axios instance with JWT interceptor & 401 redirect
    ├── context/
    │   ├── AuthContext.tsx   # Auth state (user, token, login, logout, register)
    │   └── MovieContext.tsx  # Global movie, show, and booking data state
    ├── components/
    │   ├── Navbar.tsx        # Responsive navbar with mobile hamburger menu
    │   ├── Footer.tsx        # Cinema branding and copyright
    │   ├── MovieCard.tsx     # Movie card with ratings & book CTA
    │   ├── SeatGrid.tsx      # Interactive 60-seat theater matrix (360px safe)
    │   ├── ProtectedRoute.tsx# Role-based route guard
    │   └── Toast.tsx         # Notification toast system
    ├── pages/
    │   ├── Home.tsx          # Hero banner & trending titles
    │   ├── Movies.tsx        # Filterable catalog with search
    │   ├── MovieDetails.tsx  # Synopsis, cast, and screening time picker
    │   ├── SeatSelection.tsx # Real-time seat selection & checkout
    │   ├── BookingConfirmation.tsx # Physical e-ticket with barcode & print
    │   ├── MyBookings.tsx    # Order history & seat cancellation
    │   ├── Login.tsx         # Sign in with email validation & demo helper
    │   ├── Register.tsx      # Sign up with password strength check
    │   ├── AdminDashboard.tsx# Movie & schedule management console
    │   └── Docs.tsx          # Embedded developer specs and API reference
    ├── types/
    │   └── index.ts          # TypeScript interfaces (Movie, Show, Booking, User)
    └── utils/
        └── dateUtils.ts      # Showtime parsing & past-time comparison logic
```

---

## 🚀 Local Setup & Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- (Optional) A free **MongoDB Atlas** cluster URI. If omitted, the application runs seamlessly using its built-in in-memory cinema database.

### Installation & Startup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/imovies.git
   cd imovies
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the provided templates:
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```

4. **Seed Database (Optional for MongoDB mode)**:
   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Standard User** | `user@imovies.com` | `password123` | Book tickets, view history, cancel own bookings |
| **Cinema Admin** | `admin@imovies.com` | `admin123` | Full access + Admin Dashboard (`/admin`), create/delete movies |

---

## 📡 REST API Documentation

### Base URL: `/api`

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Public | Sign in and receive JWT token | `{ "email": "...", "password": "..." }` |
| `GET` | `/api/auth/me` | Protected | Fetch authenticated profile | Header: `Bearer <token>` |

### 2. Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Public | Retrieve all movies in catalog |
| `GET` | `/api/movies/:id` | Public | Retrieve detailed movie record |
| `POST` | `/api/movies` | Admin | Create movie (Requires `role: 'admin'`) |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie and associated shows |

### 3. Shows (`/api/shows`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/shows` | Public | Get all active screening schedules |
| `GET` | `/api/shows/:id` | Public | Get show details with current `bookedSeats` |
| `GET` | `/api/shows/movie/:movieId` | Public | Get upcoming screenings for a specific movie |

### 4. Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Protected | Atomically reserve seats | `{ "showId": "...", "seats": ["C4", "C5"] }` |
| `GET` | `/api/bookings/my` | Protected | Fetch current user's booking history | Header: `Bearer <token>` |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel booking & release seats on `showId` | None |

---

## 🌐 Deployment Guide

### 1. MongoDB Atlas
1. Register for a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Security → Database Access**, create a user (e.g. `imovies_admin`) with read/write privileges.
4. Under **Security → Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Render/Vercel.
5. In **Clusters → Connect → Drivers (Node.js)**, copy your connection string:
   ```text
   mongodb+srv://imovies_admin:<password>@cluster0.abcde.mongodb.net/imovies?retryWrites=true&w=majority
   ```

### 2. Backend (Render / Railway)
1. Link your GitHub repository to [render.com](https://render.com).
2. Choose **New Web Service**.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start` (or `node server.ts` via `tsx`)
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default for Render)
   - `MONGO_URI`: *Your MongoDB Atlas connection URI*
   - `JWT_SECRET`: *A secure random string*
   - `CLIENT_URL`: *Your Vercel frontend URL*

### 3. Frontend (Vercel / Netlify)
1. Import repository to [Vercel](https://vercel.com).
2. Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
4. For Single Page Application (SPA) routing, ensure a `vercel.json` rewrite is present:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 🧹 Clean Export / Git Migration

When downloading or pushing this codebase to your own GitHub account:
1. `metadata.json`: This file was used for sandbox provisioning. You may safely delete `metadata.json` in your local Git repository:
   ```bash
   git rm metadata.json
   ```
2. Ensure you initialize a fresh Git repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete MERN movie ticket booking platform (IMovies)"
   git branch -M main
   git remote add origin https://github.com/<your-username>/imovies.git
   git push -u origin main
   ```

---

## ❓ Troubleshooting & FAQ

- **Q: Double-booking test failed during simultaneous checkout?**
  - **A**: Confirm your database is connected to MongoDB Atlas. In-memory mode uses a synchronous JavaScript array lock (`some(...)`), whereas MongoDB mode utilizes `$addToSet` and `$nin` concurrency control.
- **Q: Seats are not released after cancellation?**
  - **A**: IMovies explicitly tracks `showId` directly on each booking record. The controller calls `$pull: { bookedSeats: { $in: booking.seats } }` exclusively targeting `booking.showId`.
- **Q: Cannot book a past showtime?**
  - **A**: This is intentional. The server utility `isPastShowtime()` verifies dates and 12-hour meridiem times against `Date.now()` and returns HTTP 400 Bad Request if the screening has concluded.

---

## 📄 License
Licensed under the [MIT License](LICENSE). Built for academic, demonstration, and enterprise evaluation.
