import axiosInstance from './axiosInstance.js';

export const getDashboardStats = () => axiosInstance.get('/dashboard/stats');
