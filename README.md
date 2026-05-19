# TELLEX Premium - Personal Book Discovery System

TELLEX is a modern, premium e-commerce platform designed to personalize the book-buying experience. By combining high-end aesthetics with powerful data-driven discovery flows and psychological profiling, TELLEX helps readers find their next favorite book through intuition and emotion.

## 🚀 The Vision
TELLEX moves away from static catalogs. It uses a **"Mystery Pick"** and **"Vibe Pick"** system where users share their current mood, life situation, and reading preferences. Our system then matches them with the perfect book, creating a unique moment of surprise and delight.

---

## ✨ New & Key Features

### 🧠 RIASEC Personalization Engine
- **Psychological Profiling:** Integrated Holland Occupational Themes (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) to understand user personalities.
- **Dynamic Matching:** Tailors book recommendations based on the user's RIASEC score profile, ensuring a deeper connection between the reader and the book.

### 💰 Smart Order Pricing & Management
- **Unified Pricing Logic:** Advanced calculation system that handles multiple budget tiers (₹349, ₹449, ₹689, ₹1299) and quantities correctly.
- **Volume-Based Calculation:** Real-time price updates for multi-book orders, ensuring transparency and accuracy.
- **Legacy Support:** Intelligent fallback logic to handle older orders while prioritizing new, explicitly stored budget data.

### 📦 Interactive Discovery Flows (`/flow`)
- **Guided Pick:** A step-by-step interactive journey that understands your current emotions (Happy, Anxious, Hopeful, etc.) and life transitions (New Beginnings, Seeking Growth).
- **Free Pick:** A minimalist interface where you can freely describe your "vibe" or a specific problem, allowing our system to interpret your needs.
- **Dynamic Summaries:** Real-time order previews with intelligent "Other" input handling.

### 🔐 Multi-Tier Admin HQ (`/admin`)
- **Manual Order Entry:** Admins can now manually create orders for customers, ideal for offline requests.
- **Customer Insights:** View generated "RIASEC Admin Insights" for each order to better understand customer needs.
- **Real-Time CRM:** Monitor, filter, and update order statuses (Pending, Confirmed, Delivered) instantly.
- **Safety Measures:** Confirmation prompts for destructive actions like deleting orders.

---

## 🛠️ Project Structure (Vite-Powered)

```text
/project
├── /src
│   ├── /pages          # Main application views (Dashboard, Admin, Orders, Flow)
│   ├── /components     # UI components and interactive discovery trays
│   ├── /context        # Global Auth & State Management
│   ├── /lib            # Firebase configuration and utilities
│   └── main.tsx        # Application entry point
├── /public             # Static assets (logos, icons)
├── package.json        # Project dependencies & scripts
└── vite.config.ts      # Vite configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Firebase Project (Firestore & Auth enabled)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🎨 Branding & Aesthetics
- **Primary Green:** `#0E462B` (Depth & Stability)
- **Secondary Cream:** `#FAF9F6` (Cozy & Warm)
- **Accent Gold:** `#e1cfbc` (Premium & Elegant)

---

Developed with ❤️ for **TELLEX AI**
