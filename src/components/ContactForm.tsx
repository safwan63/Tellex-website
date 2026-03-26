import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';
import { validateContactForm, sanitizeInput, checkRateLimit } from '../lib/security';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validate input
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setSubmitStatus('error');
      setErrorMessage(validation.errors.join('. ') + '.');
      setIsLoading(false);
      return;
    }

    // Check rate limiting (5 submissions per minute)
    const canSubmit = checkRateLimit('contact_form', 5, 60000);
    if (!canSubmit) {
      setSubmitStatus('error');
      setErrorMessage('Too many submissions. Please wait a minute before submitting again.');
      setIsLoading(false);
      return;
    }

    // Sanitize input before sending
    const sanitizedData = {
      name: sanitizeInput(formData.name.trim()),
      email: formData.email.trim().toLowerCase(), // Email doesn't need HTML sanitization
      subject: sanitizeInput(formData.subject.trim()),
      message: sanitizeInput(formData.message.trim()),
    };

    let dbSuccess = false;
    let emailSuccess = false;
    let dbError: any = null;
    let emailError: any = null;

    try {
      // Store in database first (if Supabase is configured)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (supabaseUrl) {
        try {
          const { error: dbErr } = await supabase
            .from('contact_submissions')
            .insert([
              {
                name: sanitizedData.name,
                email: sanitizedData.email,
                subject: sanitizedData.subject,
                message: sanitizedData.message,
                created_at: new Date().toISOString(),
              },
            ]);

          if (dbErr) {
            dbError = dbErr;
            console.error('Database error:', dbErr);
          } else {
            dbSuccess = true;
          }
        } catch (dbErr) {
          dbError = dbErr;
          console.error('Database storage failed:', dbErr);
        }
      }

      // Send email notification using EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: sanitizedData.name,
              from_email: sanitizedData.email,
              subject: sanitizedData.subject,
              message: sanitizedData.message,
              to_email: 'tellexaiofficial@gmail.com',
            },
            publicKey
          );
          emailSuccess = true;
        } catch (emailErr) {
          emailError = emailErr;
          console.error('Email sending failed:', emailErr);
        }
      } else {
        // EmailJS not configured
        console.warn('EmailJS is not configured. Missing environment variables.');
      }

      // If at least one method succeeded, show success
      if (dbSuccess || emailSuccess) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        // Both methods failed or not configured
        const errors: string[] = [];
        
        if (!supabaseUrl && (!serviceId || !templateId || !publicKey)) {
          // In development mode, log the form data to console as a fallback
          if (import.meta.env.DEV) {
            console.log('📧 Contact Form Submission (Development Mode - No Email/Database configured):', {
              name: sanitizedData.name,
              email: sanitizedData.email,
              subject: sanitizedData.subject,
              message: sanitizedData.message,
              timestamp: new Date().toISOString(),
            });
            console.log('💡 To enable email notifications, set up EmailJS. See QUICK_SETUP_EMAILJS.md for instructions.');
          }
          
          errors.push(
            'Neither database nor email is configured. ' +
            'Please set up EmailJS (quickest - see QUICK_SETUP_EMAILJS.md) or Supabase (see SUPABASE_SETUP.md). ' +
            'In development mode, form data has been logged to the console.'
          );
        } else if (dbError) {
          errors.push(`Database error: ${dbError.message || 'Failed to save to database'}`);
        } else if (emailError) {
          errors.push(`Email error: ${emailError.text || emailError.message || 'Failed to send email'}`);
        } else {
          errors.push('Failed to submit. Please check your configuration.');
        }

        setSubmitStatus('error');
        setErrorMessage(errors.join(' '));
      }
    } catch (error: any) {
      console.error('Form submission failed:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error.message || 
        'Failed to send message. Please try again later or contact us directly at tellexaiofficial@gmail.com'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset status when user starts typing
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-tellex-dark-green mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-tellex-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tellex-dark-green focus:border-transparent"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-tellex-dark-green mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={255}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-tellex-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tellex-dark-green focus:border-transparent"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-tellex-dark-green mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-tellex-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tellex-dark-green focus:border-transparent"
          placeholder="What is this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-tellex-dark-green mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          maxLength={5000}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-tellex-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tellex-dark-green focus:border-transparent resize-none"
          placeholder="Your message..."
        />
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle2 size={20} className="flex-shrink-0" />
          <span>Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start space-x-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Failed to send message</p>
            <p className="text-sm mt-1 whitespace-pre-line">{errorMessage}</p>
            {errorMessage.includes('Neither database nor email is configured') && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs font-medium mb-1">Quick Setup Options:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>EmailJS (5 min): See <code className="bg-red-100 px-1 rounded">QUICK_SETUP_EMAILJS.md</code></li>
                  <li>Supabase (10 min): See <code className="bg-red-100 px-1 rounded">SUPABASE_SETUP.md</code></li>
                </ul>
                <p className="text-xs mt-2 text-red-700">
                  💡 Tip: EmailJS is the fastest option to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-tellex-dark-green hover:bg-tellex-dark-green/90 disabled:bg-tellex-dark-green/50 disabled:cursor-not-allowed text-tellex-white px-5 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <span>Send Message</span>
            <Send size={18} />
          </>
        )}
      </button>
    </form>
  );
}
