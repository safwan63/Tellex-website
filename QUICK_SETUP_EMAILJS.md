# Quick Setup: EmailJS (5 Minutes)

This will get your contact form working in just a few minutes.

## Step 1: Create EmailJS Account (2 minutes)

1. Go to https://www.emailjs.com/
2. Click **"Sign Up"** (top right)
3. Sign up with Google or Email (free account gives 200 emails/month)
4. Verify your email if needed

## Step 2: Add Email Service (1 minute)

1. In EmailJS dashboard, click **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Choose **"Gmail"** (or your email provider)
4. Click **"Connect Account"** and authorize
5. **Copy the Service ID** (looks like: `service_xxxxx`)

## Step 3: Create Email Template (1 minute)

1. Click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. Use these settings:
   - **Template Name:** Contact Form
   - **To Email:** `tellexaiofficial@gmail.com` (or your email)
   - **From Name:** `{{from_name}}`
   - **From Email:** `{{from_email}}`
   - **Subject:** `{{subject}}`
   - **Content:**
     ```
     New Contact Form Submission
     
     Name: {{from_name}}
     Email: {{from_email}}
     Subject: {{subject}}
     
     Message:
     {{message}}
     
     ---
     Reply to: {{from_email}}
     ```
4. Click **"Save"**
5. **Copy the Template ID** (looks like: `template_xxxxx`)

## Step 4: Get Public Key (30 seconds)

1. Click **"Account"** → **"General"** (left sidebar)
2. Scroll to **"API Keys"**
3. **Copy the Public Key** (looks like: `xxxxxxxxxxxxx`)

## Step 5: Create .env File (30 seconds)

1. In your `project` folder, create a file named `.env` (not `.env.txt`)
2. Add these lines (replace with YOUR values):
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
   ```
3. **Save the file**

## Step 6: Restart Dev Server

1. **Stop the server** (Press `Ctrl+C` in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

## Step 7: Test It!

1. Go to `http://localhost:5173/contact`
2. Fill out the form
3. Submit it
4. You should see: ✅ "Message sent successfully!"
5. Check your email inbox for the message

## Troubleshooting

### Error: "Service ID not found"
- Make sure you copied the Service ID correctly
- Check for extra spaces in `.env` file

### Error: "Template ID not found"
- Make sure you copied the Template ID correctly
- Verify the template exists in EmailJS dashboard

### Error: "Invalid Public Key"
- Make sure you copied the Public Key (not the Private Key)
- Check for extra spaces

### Still not working?
1. Check browser console (F12) for specific errors
2. Make sure you restarted the dev server after creating `.env`
3. Verify `.env` file is in the `project/` folder (same level as `package.json`)

## Done! 🎉

Your contact form should now work. Every submission will:
- ✅ Send you an email notification
- ✅ Show success message to user

---

**Note:** You can also set up Supabase later for database storage. For now, EmailJS alone is enough to get the form working!
























