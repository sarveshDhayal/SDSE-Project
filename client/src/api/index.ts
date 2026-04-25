import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Default local backend port
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
