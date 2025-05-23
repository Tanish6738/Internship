import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'https://internship-backend-lwhr.onrender.com' || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to headers if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
