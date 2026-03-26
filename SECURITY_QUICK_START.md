# Security Quick Start Guide

## 🔐 Immediate Security Steps

### 1. Set Up Admin Password (REQUIRED)

The admin page is now password-protected. You **must** set a password before deploying.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set a strong password:
   ```env
   VITE_ADMIN_PASSWORD=your-strong-password-here
   ```

3. **Use a strong password:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Use a password manager to generate it
   - Example: `Kj8#mN2$pQ9&wL4@`

### 2. Verify Security Features

✅ **Authentication:** Admin page now requires password
✅ **Input Sanitization:** All user input is sanitized
✅ **Input Validation:** Form fields have length limits
✅ **Rate Limiting:** Contact form limited to 5 submissions/minute
✅ **CSV Protection:** Export function protected against injection
✅ **Security Headers:** Added to prevent common attacks

### 3. Test the Admin Login

1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin`
3. You should see a login screen
4. Enter the password from your `.env` file
5. You should now see the admin dashboard

## ⚠️ Important Security Notes

### Before Going to Production:

1. **Change Default Password:**
   - The default dev password is `admin123`
   - **NEVER use this in production**
   - Always set `VITE_ADMIN_PASSWORD` in your production environment

2. **Enable Supabase Row Level Security:**
   - Go to your Supabase dashboard
   - Enable RLS on the `contact_submissions` table
   - Restrict SELECT to authenticated users only

3. **Review Security Headers:**
   - Check `index.html` for CSP settings
   - Adjust if needed for your specific use case

4. **Set Up HTTPS:**
   - Required for production
   - Never deploy without SSL/TLS encryption

## 📋 Security Checklist

- [ ] Created `.env` file from `.env.example`
- [ ] Set strong `VITE_ADMIN_PASSWORD`
- [ ] Tested admin login
- [ ] Verified contact form still works
- [ ] Enabled Supabase RLS (if using Supabase)
- [ ] Plan for HTTPS in production
- [ ] Read full `SECURITY.md` documentation

## 🆘 Troubleshooting

### "Admin password not configured" Error
- Make sure `.env` file exists in the `project` directory
- Make sure `VITE_ADMIN_PASSWORD` is set in `.env`
- Restart your dev server after creating/modifying `.env`

### Can't Access Admin After Login
- Check browser console for errors
- Make sure sessionStorage is enabled in your browser
- Try clearing browser cache and logging in again

### Contact Form Not Working
- Security changes shouldn't break the form
- Check browser console for validation errors
- Verify rate limiting isn't blocking legitimate submissions

## 📚 More Information

For detailed security documentation, see:
- `SECURITY.md` - Full security guide
- `HOW_TO_ACCESS_ADMIN.md` - Updated admin access guide

---

**Next Steps:** After setting up basic security, read `SECURITY.md` for production recommendations.
















