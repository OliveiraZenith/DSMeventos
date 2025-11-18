// Authentication utilities for token management and validation

/**
 * Decodes a JWT token without verification
 * @param {string} token - JWT token to decode
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function decodeToken(token) {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if token is expired or invalid
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Gets the token from localStorage
 * @returns {string|null} Token or null if not found
 */
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Validates the current token and returns it if valid
 * @returns {string|null} Valid token or null if expired/invalid
 */
export function getValidToken() {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }
  return token;
}

/**
 * Logs out the user by clearing all auth data
 * @param {object} router - Next.js router object for redirection
 * @param {string} redirectPath - Path to redirect after logout (default: '/login')
 */
export function logout(router = null, redirectPath = '/login') {
  if (typeof window === 'undefined') return;

  // Clear all auth-related data
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to login if router is provided
  if (router) {
    router.push(redirectPath);
  } else if (typeof window !== 'undefined') {
    window.location.href = redirectPath;
  }
}

/**
 * Validates token and redirects to login if expired
 * Use this in useEffect hooks on protected pages
 * @param {object} router - Next.js router object
 * @returns {boolean} True if token is valid, false otherwise
 */
export function validateTokenOrRedirect(router) {
  const token = getValidToken();

  if (!token) {
    logout(router);
    return false;
  }

  return true;
}
