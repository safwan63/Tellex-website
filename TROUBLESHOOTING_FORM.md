# Troubleshooting: "Failed to Send Message" Error

If you're seeing "Failed to send message" when submitting the contact form, follow these steps:

## Quick Diagnosis

1. **Open Browser Console** (Press F12 → Console tab)
2. **Submit the form** and check for error messages
3. **Look for specific errors** like:
   - "EmailJS is not configured"
   - "Database error"
   - "Email sending failed"

---

## Common Issues & Solutions

### Issue 1: EmailJS Not Configured

**Symptoms:**
- Error: "Neither database nor email is configured"
- No EmailJS environment variables set

**Solution:**

1. **Check if EmailJS package is installed:**
   ```bash
   npm list @emailjs/browser
   ```
   
   If not installed, install it:
   ```bash
   npm install @emailjs/browser
   ```

2. **Set up EmailJS** (see `EMAILJS_SETUP.md` for detailed steps):
   - Create account at https://www.emailjs.com/
   - Get your Service ID, Template ID, and Public Key
   - Add to `.env` file:
     ```
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     ```

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

### Issue 2: Supabase Not Configured

**Symptoms:**
- Error: "Database error" or "Supabase is not configured"
- Submissions not appearing in admin page

**Solution:**

1. **Set up Supabase** (see `SUPABASE_SETUP.md`):
   - Create account at https://supabase.com/
   - Create a project
   - Create the `contact_submissions` table
   - Get your Project URL and Anon Key

2. **Add to `.env` file:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Restart dev server**

---

### Issue 3: Both EmailJS and Supabase Missing

**Symptoms:**
- Error: "Neither database nor email is configured"

**Solution:**
- You need **at least one** configured (EmailJS OR Supabase)
- Follow setup for either one (or both for best results)
- See `EMAILJS_SETUP.md` or `SUPABASE_SETUP.md`

---

### Issue 4: EmailJS Configuration Error

**Symptoms:**
- Error: "Email error: [specific message]"
- EmailJS env vars are set but still failing

**Check:**

1. **Verify environment variables:**
   ```bash
   # In your .env file, make sure you have:
   VITE_EMAILJS_SERVICE_ID=...
   VITE_EMAILJS_TEMPLATE_ID=...
   VITE_EMAILJS_PUBLIC_KEY=...
   ```

2. **Check EmailJS dashboard:**
   - Service is active
   - Template exists and has correct variables
   - Public key is correct

3. **Test EmailJS directly:**
   - Go to EmailJS dashboard → Test
   - Try sending a test email

4. **Check browser console** for specific error messages

---

### Issue 5: Supabase Database Error

**Symptoms:**
- Error: "Database error: [message]"
- Table doesn't exist or permissions issue

**Solution:**

1. **Create the table** (run in Supabase SQL Editor):
   ```sql
   CREATE TABLE contact_submissions (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     subject TEXT NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. **Set up Row Level Security:**
   ```sql
   ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Allow public inserts" ON contact_submissions
     FOR INSERT
     TO public
     WITH CHECK (true);
   ```

3. **Verify table exists:**
   - Go to Supabase Dashboard → Table Editor
   - Check if `contact_submissions` table appears

---

### Issue 6: Environment Variables Not Loading

**Symptoms:**
- Variables are set but form still fails
- Console shows `undefined` for env vars

**Solution:**

1. **Check `.env` file location:**
   - Must be in `project/` directory (same level as `package.json`)
   - Not in `project/src/` or root directory

2. **Check variable names:**
   - Must start with `VITE_` prefix
   - Example: `VITE_EMAILJS_SERVICE_ID` (not `EMAILJS_SERVICE_ID`)

3. **Restart dev server:**
   - Environment variables only load on server start
   - Stop (Ctrl+C) and run `npm run dev` again

4. **Verify in code:**
   ```javascript
   // Add temporarily to check
   console.log('EmailJS Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
   ```

---

## Testing Checklist

After fixing configuration, test:

- [ ] Form submits without error
- [ ] Success message appears
- [ ] Form fields reset after submission
- [ ] Email received (if EmailJS configured)
- [ ] Submission appears in admin page (if Supabase configured)
- [ ] No errors in browser console

---

## Quick Fix: Use Only Database (No Email)

If you just want to use the database without email:

1. **Set up Supabase only** (see `SUPABASE_SETUP.md`)
2. **Don't configure EmailJS** (or remove EmailJS env vars)
3. **Form will work** - submissions saved to database
4. **Check admin page** at `/admin` to see submissions

---

## Quick Fix: Use Only Email (No Database)

If you just want to use email without database:

1. **Set up EmailJS only** (see `EMAILJS_SETUP.md`)
2. **Don't configure Supabase** (or remove Supabase env vars)
3. **Form will work** - emails sent via EmailJS
4. **Check email inbox** for submissions

---

## Still Not Working?

1. **Check browser console** (F12) for detailed errors
2. **Check network tab** (F12 → Network) for failed requests
3. **Verify all environment variables** are set correctly
4. **Restart dev server** after changing `.env` file
5. **Clear browser cache** and try again

---

## Need Help?

Check the detailed setup guides:
- `EMAILJS_SETUP.md` - EmailJS configuration
- `SUPABASE_SETUP.md` - Database setup
- `WHERE_TO_COLLECT_DATA.md` - Where to view submissions
























