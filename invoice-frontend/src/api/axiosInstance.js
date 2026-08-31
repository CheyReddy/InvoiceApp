import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.response.use((response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.setItem('toastMessage', 'Your session has expired. Please log in again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  });


export default axiosInstance;
