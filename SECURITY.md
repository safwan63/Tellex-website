# Security Guide

This document outlines the security measures implemented in this project and best practices for keeping it secure.

## 🔒 Security Features Implemented

### 1. Admin Page Authentication
- **Status:** ✅ Implemented
- **Location:** `/admin` route
- **Protection:** Password-based authentication using environment variable
- **Configuration:** Set `VITE_ADMIN_PASSWORD` in your `.env` file
- **Session:** 24-hour session expiration
- **Note:** For production, consider upgrading to Supabase Auth or JWT tokens

### 2. Input Sanitization
- **Status:** ✅ Implemented
- **Protection:** All user input is sanitized to prevent XSS attacks
- **Location:** `src/lib/security.ts`
- **Features:**
  - HTML tag removal
  - Special character escaping
  - CSV injection prevention

### 3. Input Validation
- **Status:** ✅ Implemented
- **Protection:** Form validation with length limits
- **Limits:**
  - Name: 100 characters max
  - Email: 255 characters max
  - Subject: 200 characters max
  - Message: 5000 characters max
- **Email Format:** Validated using regex pattern

### 4. Rate Limiting
- **Status:** ✅ Implemented (Client-side)
- **Protection:** 5 submissions per minute per user
- **Location:** Contact form
- **Note:** Client-side rate limiting can be bypassed. For production, implement server-side rate limiting via Supabase Edge Functions or your backend.

### 5. Security Headers
- **Status:** ✅ Implemented
- **Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy` (configured for this app)
- **Location:** `index.html`

### 6. CSV Export Protection
- **Status:** ✅ Implemented
- **Protection:** CSV injection prevention in admin export
- **Method:** Sanitizes formula injection characters (=, +, -, @)

## ⚠️ Security Considerations

### Environment Variables
- **Never commit `.env` files to version control** (already in `.gitignore`)
- Use `.env.example` as a template
- Rotate API keys and passwords regularly
- Use strong, unique passwords for admin access

### Supabase Security
1. **Enable Row Level Security (RLS):**
   ```sql
   ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
   
   -- Allow public inserts (for contact form)
   CREATE POLICY "Allow public inserts" ON contact_submissions
     FOR INSERT
     TO public
     WITH CHECK (true);
   
   -- Restrict reads to authenticated admin users only
   CREATE POLICY "Allow admin reads" ON contact_submissions
     FOR SELECT
     TO authenticated
     USING (true);
   ```

2. **Use Service Role Key Only on Server-Side:**
   - The anon key is exposed in client code (this is safe with proper RLS)
   - Never expose the service role key in client code

3. **Validate Data in Database:**
   - Add constraints in Supabase schema
   - Set up database triggers for additional validation

### EmailJS Security
- EmailJS public keys are safe to expose (they're designed for client-side use)
- Rate limiting is handled by EmailJS service
- Consider setting up EmailJS domain whitelist in dashboard

## 🚨 Known Limitations

### Client-Side Rate Limiting
- Current rate limiting uses localStorage and can be bypassed by clearing browser data
- **Recommendation:** Implement server-side rate limiting using:
  - Supabase Edge Functions
  - API gateway rate limiting
  - Backend service with Redis

### Admin Authentication
- Current implementation uses simple password check
- Session stored in sessionStorage (cleared on browser close)
- **Recommendation for Production:**
  - Implement Supabase Auth with email/password or OAuth
  - Use JWT tokens with proper expiration
  - Add multi-factor authentication (MFA)
  - Implement IP whitelisting

### XSS Protection
- React automatically escapes content rendered in JSX (like `{variable}`)
- Manual sanitization added as additional layer
- Still vulnerable to `dangerouslySetInnerHTML` - avoid using it

## 📋 Security Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Set strong `VITE_ADMIN_PASSWORD` in production environment
- [ ] Enable Supabase RLS policies
- [ ] Configure Supabase CORS settings
- [ ] Set up HTTPS (required for production)
- [ ] Implement server-side rate limiting
- [ ] Set up proper authentication (Supabase Auth recommended)
- [ ] Review and update Content Security Policy headers
- [ ] Set up error logging and monitoring
- [ ] Regularly update dependencies (`npm audit`)
- [ ] Rotate API keys and secrets regularly
- [ ] Set up database backups
- [ ] Configure email alerts for security events

## 🔍 Security Monitoring

### Regular Checks
1. **Dependency Audits:**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Check for Exposed Secrets:**
   - Review git history: `git log -p .env`
   - Use tools like `git-secrets` or `truffleHog`

3. **Monitor Supabase Logs:**
   - Check for unusual query patterns
   - Monitor failed authentication attempts

4. **Review Access Logs:**
   - Monitor admin page access
   - Check for brute force attempts

## 🛠️ Additional Security Recommendations

### For Enhanced Security:

1. **Add CSRF Protection:**
   - Implement CSRF tokens for form submissions
   - Use SameSite cookie attributes

2. **Implement CAPTCHA:**
   - Add reCAPTCHA or hCaptcha to contact form
   - Prevents automated spam submissions

3. **Add IP-based Rate Limiting:**
   - Track submissions by IP address
   - Block suspicious IPs

4. **Set up WAF (Web Application Firewall):**
   - Use Cloudflare or similar service
   - Filter malicious requests before they reach your app

5. **Regular Security Audits:**
   - Conduct penetration testing
   - Review code for security vulnerabilities
   - Stay updated with security best practices

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 🆘 Reporting Security Issues

If you discover a security vulnerability, please:
1. Do NOT create a public issue
2. Contact the project maintainer privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

---

**Last Updated:** December 2024
**Version:** 1.0
















