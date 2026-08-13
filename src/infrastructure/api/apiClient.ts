import axios from 'axios';

export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response && err.response.status === 403) {
      localStorage.removeItem('token');
      window.location.href = `${window.location.origin}/login`;
    }
    return Promise.reject(err);
  }
);
