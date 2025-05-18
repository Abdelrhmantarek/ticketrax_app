import axios from 'axios';

/**
 * Django REST Framework Auth Integration
 * 
 * This service handles authentication with the Django backend,
 * including CSRF handling for state-changing requests.
 */

// API base URL (should be environment variable in production)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with baseURL and credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies (CSRF token)
});

/**
 * Helper to read the CSRF token from cookie
 */
function getCsrfToken(): string | undefined {
  const name = 'csrftoken';
  const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
  return match ? match.pop() : undefined;
}

// Add request interceptor to include Token auth and CSRF header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    // Attach CSRF token for unsafe HTTP methods
    const unsafeMethods = ['post', 'put', 'patch', 'delete'];
    if (config.method && unsafeMethods.includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interfaces
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login/', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout/');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    localStorage.removeItem('token');
  }
};

/**
 * Get current user data
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get('/auth/user/');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user', error);
    throw error;
  }
};

/**
 * Check if user is authenticated (token exists and is valid)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    await api.get('/auth/user/');
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

// Export API instance for use in other services
export { api };

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
