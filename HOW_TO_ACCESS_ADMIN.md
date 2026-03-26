# How to Access the Admin Page

## Step-by-Step Instructions

### Step 1: Start Your Development Server

Open your terminal in the `project` directory and run:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 2: Open the Admin Page

In your web browser, navigate to:

```
http://localhost:5173/admin
```

**OR** you can:
1. Go to the main site: `http://localhost:5173/`
2. Manually type `/admin` at the end of the URL
3. Press Enter

### Step 3: What You'll See

The admin page will display:

1. **Header Section:**
   - Title: "Contact Submissions"
   - Refresh button (to reload data)
   - Export CSV button (to download all submissions)

2. **Statistics Cards:**
   - Total Submissions
   - This Month's count
   - Today's count

3. **Submissions List:**
   - Each submission shows:
     - Name
     - Email (clickable to send email)
     - Date/Time
     - Subject
   - Click any submission to expand and see the full message

### Step 4: Using the Admin Page

**To View Full Message:**
- Click on any submission card
- The message will expand below
- Click again to collapse

**To Refresh Data:**
- Click the "Refresh" button in the top right
- This fetches the latest submissions from the database

**To Export Data:**
- Click the "Export CSV" button
- A CSV file will download with all submissions
- Open in Excel, Google Sheets, or any spreadsheet app

**To Reply to a Submission:**
- Click on the email address
- Your default email client will open with that email address

---

## Troubleshooting

### Problem: "Supabase is not configured" Error

**Solution:**
1. Make sure you've set up Supabase (see `SUPABASE_SETUP.md`)
2. Create a `.env` file in the `project` directory
3. Add these variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart the dev server (`Ctrl+C` then `npm run dev`)

### Problem: "No submissions yet" Message

**Solution:**
1. This is normal if no one has submitted the contact form yet
2. Test by:
   - Going to `/contact` page
   - Filling out and submitting the form
   - Then refresh the admin page

### Problem: Page Shows Loading Forever

**Solution:**
1. Check browser console for errors (F12 → Console tab)
2. Verify Supabase credentials are correct
3. Make sure the database table exists (see `SUPABASE_SETUP.md`)
4. Check your internet connection

### Problem: Can't Access `/admin` Route

**Solution:**
1. Make sure you're typing the exact URL: `http://localhost:5173/admin`
2. Check that the dev server is running
3. Try refreshing the page (F5)
4. Clear browser cache if needed

---

## Quick Test

To quickly test if everything works:

1. **Submit a test form:**
   - Go to `http://localhost:5173/contact`
   - Fill out the form with test data
   - Submit it

2. **Check admin page:**
   - Go to `http://localhost:5173/admin`
   - You should see your test submission appear
   - Click it to see the full message

---

## Visual Guide

```
┌─────────────────────────────────────────┐
│  Contact Submissions                    │
│  View and manage all contact form       │
│  submissions                            │
│                                         │
│  [Refresh] [Export CSV]                 │
└─────────────────────────────────────────┘

┌──────────┬──────────┬──────────┐
│  Total   │  This    │  Today   │
│    5     │  Month   │    2     │
│          │    3     │          │
└──────────┴──────────┴──────────┘

┌─────────────────────────────────────────┐
│ 👤 John Doe                            │
│ 📧 john@example.com                    │
│ 📅 Jan 15, 2024, 2:30 PM              │
│ Subject: Question about books          │
│                                         │
│ [Click to expand message...]           │
└─────────────────────────────────────────┘
```

---

## 🔐 Authentication Required

✅ **Security Update:** The admin page now requires password authentication!

### Setting Up Admin Password

1. **Create `.env` file** (if you haven't already):
   ```bash
   cp .env.example .env
   ```

2. **Set your admin password** in `.env`:
   ```env
   VITE_ADMIN_PASSWORD=your-strong-password-here
   ```

3. **Restart your dev server** after setting the password

### Logging In

When you navigate to `/admin`, you'll see a login screen. Enter the password you set in your `.env` file.

**Default Development Password:** `admin123` (if `VITE_ADMIN_PASSWORD` is not set)

⚠️ **IMPORTANT:** Change the default password before deploying to production!

### Security Features

- ✅ Password-protected access
- ✅ Session expires after 24 hours
- ✅ Logout button available in admin dashboard
- ✅ All user data is sanitized to prevent XSS attacks
- ✅ CSV exports are protected against injection attacks

For more security information, see `SECURITY.md` and `SECURITY_QUICK_START.md`.









