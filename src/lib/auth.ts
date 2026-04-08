/**
 * Simple authentication utilities for Admin page
 */

const ADMIN_PASSWORD_KEY = 'admin_auth_token';

/**
 * Sets admin authentication token
 */
export function setAdminAuth(password: string): void {
  const token = btoa(`${password}_${Date.now()}`);
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, token);
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
 */
export function getAdminPassword(): string {
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  if (envPassword) {
    return envPassword;
  }
  
  if (import.meta.env.DEV) {
    return 'admin123';
  }
  
  throw new Error('Admin password not configured. Set VITE_ADMIN_PASSWORD environment variable.');
}
