# TELLEX Premium - Personal Book Discovery System

TELLEX is a modern, premium e-commerce platform designed to personalize the book-buying experience. By combining high-end aesthetics with powerful data-driven discovery flows, TELLEX helps readers find their next favorite book through intuition and emotion.

## 🚀 The Vision
TELLEX moves away from static catalogs. It uses a **"Mystery Pick"** and **"Vibe Pick"** system where users share their current mood, life situation, and reading preferences. Our system then matches them with the perfect book, creating a unique moment of surprise and delight.

---

## ✨ Key Features

### 📦 Interactive Discovery Flows (`/flow`)
- **Guided Pick:** A step-by-step interactive journey that understands your current emotions (Happy, Anxious, Hopeful, etc.) and life transitions (New Beginnings, Seeking Growth).
- **Free Pick:** A minimalist interface where you can freely describe your "vibe" or a specific problem, allowing our system to interpret your needs.
- **Dynamic Summaries:** Real-time order previews with intelligent "Other" input handling.
- **Selection Limits:** Optimized UX that prevents choice overload by capping selections at 3 items.

### 🔐 Secure Admin Dashboard (`/admin`)
- **Real-Time CRM:** A dedicated interface for the Tellex team to view, filter, and fulfill orders as they come in.
- **Strict Access Control:** Only authorized master admins (configured in Firestore) can access the HQ.
- **Order Management:** Capability to mark orders as processed or delete them with a safety confirmation prompt.

### 🛠️ Modern Tech Stack
- **Framework:** Next.js 14 (App Router) for speed and SEO.
- **Database & Auth:** Firebase (Firestore & Authentication) for a robust, real-time backend.
- **Styling:** Tailwind CSS with a custom premium palette (Forest Green & Cream).
- **Animations:** Framer Motion for smooth, cinematic transitions.
- **Form Handling:** React Hook Form + Zod for rock-solid data validation.

---

## 🛠️ Project Structure

```text
/project
├── /next-app           # Primary Next.js Application
│   ├── /src/app        # Next.js App Router (Routes & Layouts)
│   ├── /src/components # Reusable UI Components & Flows
│   ├── /src/context    # Global Global Auth & State Providers
│   └── /src/lib        # Firebase Configuration & Utilities
├── /src                # Legacy Vite Frontend (Marketing Site)
└── package.json        # Main dependencies
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Firebase Project (Firestore & Auth enabled)

### 2. Environment Variables
Create a `.env.local` inside the root or `next-app` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Run the Next.js app
npm run dev
```

---

## 🎨 Branding
- **Primary Green:** `#0E462B` (Depth & Stability)
- **Secondary Cream:** `#FAF9F6` (Cozy & Warm)
- **Accent Gold:** `#e1cfbc` (Premium & Elegant)

---

Developed with ❤️ for **TELLEX AI**
