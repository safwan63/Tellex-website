# EmailJS Setup Instructions

The contact form is configured to send emails to `tellexaiofficial@gmail.com` using EmailJS.

## Setup Steps:

1. **Create an EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account (200 emails/month free)

2. **Add an Email Service**
   - In the EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail recommended)
   - Connect your Gmail account (tellexaiofficial@gmail.com)
   - Note your **Service ID**

3. **Create an Email Template**
   - Go to "Email Templates" in the dashboard
   - Click "Create New Template"
   - Use this template structure:
     ```
     From: {{from_name}} <{{from_email}}>
     To: tellexaiofficial@gmail.com
     Subject: {{subject}}
     
     Message:
     {{message}}
     
     ---
     Reply to: {{from_email}}
     ```
   - Set the "To Email" field to: `tellexaiofficial@gmail.com`
   - Note your **Template ID**

4. **Get Your Public Key**
   - Go to "Account" → "General"
   - Copy your **Public Key**

5. **Configure Environment Variables**
   - Create a `.env` file in the `project` directory
   - Add the following variables:
     ```
     VITE_EMAILJS_SERVICE_ID=your_service_id_here
     VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
     VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
     ```
   - Replace the placeholder values with your actual IDs and key

6. **Restart Your Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` again to load the new environment variables

## Testing

After setup, test the contact form by:
1. Filling out the form with test data
2. Submitting the form
3. Checking your email inbox (tellexaiofficial@gmail.com) for the message

## Troubleshooting

- If emails aren't sending, check the browser console for error messages
- Verify all environment variables are set correctly
- Make sure your EmailJS service is properly connected
- Check that your template includes all required variables: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`
























