import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // List of endpoints that don't require authentication
    const publicEndpoints = [
      '/api/login/',
      '/api/register/',
      '/api/verify-otp/',
      '/api/resend-otp/',
      '/api/send-otp/',
    ];

    // Check if the current request URL matches any public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post(`${api.defaults.baseURL}/api/refresh-token/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('token', access);
          
          // Update the header for the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, logout via store
          useAuthStore.getState().logout();
          
          // Only redirect if not already on home page
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      } else {
        // No refresh token, logout via store
        useAuthStore.getState().logout();
        
        // Only redirect if not already on home page
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
