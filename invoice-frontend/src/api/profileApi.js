import axiosInstance from "./axiosInstance";


export const getUserProfile = () => axiosInstance.get('/users/me');
export const updateProfile = (payload) => axiosInstance.patch('/users/me/profile', payload);
export const updateSignature = (payload) => axiosInstance.patch('/users/me/signature', payload);
export const updateNotification = (payload) => axiosInstance.patch('/users/me/notifications', payload);
export const updatePassword = (payload) => axiosInstance.patch('/users/me/password', payload);

