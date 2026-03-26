# Supabase Database Setup for Contact Form

The contact form now uses a **hybrid approach** that stores submissions in a Supabase database AND sends email notifications via EmailJS.

## Why This Approach?

✅ **Database Storage Benefits:**
- All submissions are permanently stored and searchable
- Can build an admin dashboard to view/manage submissions
- Better for analytics and tracking
- No risk of losing data if emails fail
- Can export data for reporting

✅ **Email Notification Benefits:**
- Immediate notification when someone submits
- Works even if you don't check the database regularly
- Familiar workflow for team members

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com/
2. Sign up or log in
3. Create a new project
4. Wait for the project to finish setting up (takes ~2 minutes)

### 2. Create the Database Table

In your Supabase dashboard, go to **SQL Editor** and run this query:

```sql
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Add an index for faster queries by date
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Optional: Enable Row Level Security (RLS) if you want to restrict access
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from anyone (for the contact form)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy to allow reads only for authenticated users (optional)
-- CREATE POLICY "Allow authenticated reads" ON contact_submissions
--   FOR SELECT
--   TO authenticated
--   USING (true);
```

### 3. Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (under "Project API keys")

### 4. Configure Environment Variables

Create or update your `.env` file in the `project` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# EmailJS Configuration (keep existing)
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 5. Restart Development Server

```bash
npm run dev
```

## How It Works

1. **User submits form** → Data is stored in Supabase database
2. **Email notification sent** → You receive an email via EmailJS
3. **Success message shown** → User sees confirmation

If database storage fails, it still tries to send email.
If email fails but database succeeds, it still shows success (data is saved).

## Viewing Submissions

You have **3 ways** to view collected user information:

### Option 1: Admin Dashboard (Recommended) ⭐
**Access:** Navigate to `http://localhost:5173/admin` (or your domain + `/admin`)

**Features:**
- ✅ Beautiful, user-friendly interface
- ✅ View all submissions in one place
- ✅ Click to expand and read full messages
- ✅ Export to CSV for backup/analysis
- ✅ Statistics (total, this month, today)
- ✅ Refresh button to get latest submissions
- ✅ Click email addresses to send replies

**Note:** This page is accessible to anyone who knows the URL. For production, you should add authentication.

### Option 2: Supabase Dashboard
**Access:** Go to https://supabase.com/dashboard → Your Project → **Table Editor**

**Features:**
- ✅ View raw data in table format
- ✅ Edit/delete submissions
- ✅ Run SQL queries
- ✅ Export data
- ✅ See database structure

### Option 3: Email Inbox
**Access:** Check `tellexaiofficial@gmail.com` inbox

**Features:**
- ✅ Immediate email notifications
- ✅ Can reply directly from email
- ⚠️ Not searchable/organized like database

## Troubleshooting

- **"Database error" in console**: Check that your Supabase URL and key are correct
- **Submissions not appearing**: Check the Supabase dashboard → Table Editor
- **Email not sending**: Check EmailJS configuration (see EMAILJS_SETUP.md)
- **Both fail**: Check browser console for specific error messages

## Benefits Over EmailJS Only

| Feature | EmailJS Only | Database + EmailJS |
|---------|-------------|-------------------|
| Data Persistence | ❌ Lost if email deleted | ✅ Permanent storage |
| Searchable | ❌ Only in email inbox | ✅ Queryable database |
| Analytics | ❌ Manual counting | ✅ SQL queries, reports |
| Admin Dashboard | ❌ Not possible | ✅ Can build one |
| Backup | ❌ Email backup only | ✅ Database backups |
| Export Data | ❌ Manual copy/paste | ✅ Easy CSV/JSON export |

