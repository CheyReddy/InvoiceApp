import axiosInstance from './axiosInstance.js';

export const getInvoices = () => axiosInstance.get('/invoices');
export const getInvoice = (id) => axiosInstance.get(`/invoices/${id}`);
export const createInvoice = (data) => axiosInstance.post('/invoices', data);
export const deleteInvoice = (id) => axiosInstance.delete(`/invoices/${id}`);
export const sendInvoice = (id) => axiosInstance.post(`/invoices/${id}/send`);

export const downloadInvoicePdf = async (id, invoiceNumber) => {
  const response = await axiosInstance.get(`/invoices/${id}/pdf`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${invoiceNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
