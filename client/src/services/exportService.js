import api from './api';

export const exportToCSV = async (filters = {}) => {
  const response = await api.get('/export/csv', {
    params: filters,
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = `passport_posts_${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPDF = async (filters = {}) => {
  const response = await api.get('/export/pdf', {
    params: filters,
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `passport_report_${Date.now()}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
};
