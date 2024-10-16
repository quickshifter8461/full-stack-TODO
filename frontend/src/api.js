// frontend/src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
