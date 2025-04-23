import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create API instance with base URL
const API: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  timeout: 10000, // 10 second timeout
});

// Request interceptor - adds auth token
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles token expiration
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Authentication error. Clearing token.');
      localStorage.removeItem('token');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
