import axios from 'axios';

const baseURL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('users/login') &&
      !error.config?.url?.includes('users/signup')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default api;