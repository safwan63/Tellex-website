/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return sanitized.replace(/[&<>"'/]/g, (char) => escapeMap[char] || char);
}

/**
 * Sanitizes text for CSV export
 */
export function sanitizeForCSV(input: string | number): string {
  if (input === null || input === undefined) return '';
  
  const str = String(input);
  
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str.replace(/['"]/g, '""');
  }
  
  return str.replace(/"/g, '""');
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ValidationResult {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }
  
  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  } else if (data.email.length > 255) {
    errors.push('Email must be 255 characters or less');
  }
  
  if (!data.subject || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  } else if (data.subject.length > 200) {
    errors.push('Subject must be 200 characters or less');
  }
  
  if (!data.message || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.length > 5000) {
    errors.push('Message must be 5000 characters or less');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting helper using localStorage
 */
export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const storageKey = `rate_limit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, resetAt: now + windowMs }));
      return true;
    }
    
    const data = JSON.parse(stored);
    
    if (now > data.resetAt) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, resetAt: now + windowMs }));
      return true;
    }
    
    if (data.count >= maxAttempts) {
      return false;
    }
    
    localStorage.setItem(storageKey, JSON.stringify({ count: data.count + 1, resetAt: data.resetAt }));
    return true;
  } catch (error) {
    console.warn('Rate limit check failed:', error);
    return true;
  }
}
