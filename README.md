# NewZealankans Marketplace Frontend

A modern, fast, and responsive React SPA (Single Page Application) powering the client interface of the **NewZealankans Marketplace** — a classifieds and advertising platform tailored for New Zealand.

Built with React 19, TypeScript, and Vite, the frontend delivers a highly polished user experience using a custom Vanilla CSS design system, state-driven client-side routing, and JWT-authenticated session flows.

---

## 🚀 Tech Stack

- **Core Library**: [React](https://react.dev/) (v19) & TypeScript
- **Build Tool**: [Vite](https://vite.dev/) (v8) for ultra-fast Hot Module Replacement (HMR)
- **Styling**: Vanilla CSS with custom properties (CSS variables) for design system scaling
- **State & Router**: Custom lightweight hooks-based router mapping URL state
- **HTTP Client**: Standard Fetch API with custom auth/interceptor middleware (`apiRequest`)

---

## ✨ Features

- **🏠 Interactive Homepage**:
  - Highlights featured ads and trending listings.
  - Dynamic navigation of main and sub-categories.
  - Quick regional search directory map.
- **🔍 Advanced Search & Filters**:
  - Search by query string and filter in real-time.
  - Multi-tier classification (filter by Category -> Subcategory, and Region -> City).
- **👤 User Center**:
  - Personal Dashboard summarizing active and watchlist counts.
  - **My Ads Panel**: Track your classified statuses (`PENDING`, `APPROVED`, `REJECTED`, `EXPIRED`).
  - **Watchlist**: Save listings and get real-time status change updates.
- **📢 Listing Publisher**:
  - Clean step-by-step forms to publish items.
  - Multi-image file uploads with file validation limits.
- **🔐 Secure Access Control**:
  - JWT token storage handled securely in local storage (`nzk_auth`).
  - Protected client routes using `RequireAuth` and `RequireAdmin` wrappers.
  - Email verification workflow and password recovery.
- **👑 Admin Portal**:
  - Review and approve pending advertisements before they go public.
  - Manage categories hierarchy, regional directories, users list, and sponsored banners.

---

## 📂 Project Structure

```
├── public/                # Static assets (favicons, fallback images)
├── src/
│   ├── assets/            # Global stylesheets, images, and fonts
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Buttons, inputs, modals, image fallbacks
│   │   └── layout/        # Header, Footer, and App shell
│   ├── data/              # Location and category static arrays
│   ├── features/          # Feature-specific state machines & helpers
│   │   ├── auth/          # Authentication context, hooks, and route guards
│   │   ├── listings/      # Listings logic and list hooks
│   │   └── profile/       # User profile details context
│   ├── hooks/             # Custom global hooks (e.g. useRoute)
│   ├── lib/               # Shared utilities
│   ├── pages/             # Route-mapped page components
│   │   ├── admin/         # Admin dashboards and moderation tools
│   │   ├── auth/          # Login, Register, Verification pages
│   │   ├── contact/       # Contact admin form
│   │   ├── home/          # Main landing dashboard
│   │   ├── listings/      # Search, details, create, edit pages
│   │   ├── static/        # Static pages (About, Terms, Privacy)
│   │   └── user/          # User dashboards, My Ads, settings
│   ├── routes/            # App navigation router definitions
│   ├── services/          # Fetch service modules for backend communication
│   ├── App.tsx            # Main app shell & layout renderer
│   ├── index.css          # Design system variables & base rules
│   └── main.tsx           # Entry point
```

---

## 🛠️ Local Development & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PNPM](https://pnpm.io/) package manager
- Running instance of [NewZealankans Marketplace Backend](https://github.com/Dashin-sanjana/New-Zealankanz-Backend)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the frontend folder:
```env
VITE_API_BASE_URL="http://localhost:3000/api"
```

### 3. Start Development Server
```bash
pnpm dev
```
The application will launch on: `http://localhost:5173/`

### 4. Build for Production
To bundle the frontend using Vite's optimal treeshaking compiler:
```bash
pnpm build
```
Output files will be generated under `/dist`, ready to deploy to static hosts like Vercel, Netlify, or AWS S3.
