import axios from 'axios';

// Use environment variable if provided, otherwise default to relative path leveraging Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const storedAuth = localStorage.getItem('credxai_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth from localStorage in request interceptor', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized (expired or invalid token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials if token is invalid or expired
      const isAuthRequest = error.config?.url?.includes('/api/auth/');
      if (!isAuthRequest) {
        localStorage.removeItem('credxai_auth');
        // Dispatch custom event so AuthContext can cleanly trigger unauthenticated state
        window.dispatchEvent(new CustomEvent('credxai:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
