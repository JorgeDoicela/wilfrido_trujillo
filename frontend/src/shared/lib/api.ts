import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor para inyectar token Bearer desde localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wt_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para normalizar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[]; error?: string; statusCode?: number }>) => {
    if (error.response?.status === 401) {
      // Limpiar token si expiró o es inválido
      localStorage.removeItem('wt_auth_token');
    }
    return Promise.reject(error);
  },
);
