/**
 * Simple authentication utilities for Admin page
 * 
 * For production, consider using:
 * - Supabase Auth (recommended for this project)
 * - JWT tokens
 * - OAuth providers
 */

const ADMIN_PASSWORD_KEY = 'admin_auth_token';

/**
 * Sets admin authentication token
 */
export function setAdminAuth(password: string): void {
  // In production, this should hash the password and compare with server
  // For now, we use a simple approach with localStorage
  // Note: This is not secure for production - use proper authentication
  
  // Generate a simple token (in production, use secure token from server)
  const token = btoa(`${password}_${Date.now()}`);
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, token);
  
  // Also store timestamp for session expiry
  sessionStorage.setItem('admin_auth_time', Date.now().toString());
}

/**
 * Checks if user is authenticated
 */
export function isAdminAuthenticated(): boolean {
  const token = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
  const authTime = sessionStorage.getItem('admin_auth_time');
  
  if (!token || !authTime) {
    return false;
  }
  
  // Check if session is expired (24 hours)
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  const timeElapsed = Date.now() - parseInt(authTime, 10);
  
  if (timeElapsed > sessionDuration) {
    clearAdminAuth();
    return false;
  }
  
  return true;
}

/**
 * Clears admin authentication
 */
export function clearAdminAuth(): void {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
  sessionStorage.removeItem('admin_auth_time');
}

/**
 * Gets the admin password from environment variable
 * Falls back to a default if not set (for development)
 */
export function getAdminPassword(): string {
  const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (envPassword) {
    return envPassword;
  }
  
  // Default password for development (should be changed in production)
  if (process.env.NODE_ENV === 'development') {
    return 'admin123'; // CHANGE THIS IN PRODUCTION
  }
  
  // In production without password set, require environment variable
  throw new Error('Admin password not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD environment variable.');
}
















