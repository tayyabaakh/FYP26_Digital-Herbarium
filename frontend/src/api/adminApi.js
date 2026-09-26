import axiosInstance from './api';

// GET /api/admin/dashboard-stats
export const getDashboardStatsApi = async () => {
  const response = await axiosInstance.get('/admin/dashboard-stats');
  return response.data;
};

// GET /api/admin/applications?status=pending
export const getApplicationsApi = async (status = '') => {
  const params = status ? { status } : {};
  const response = await axiosInstance.get('/admin/applications', { params });
  return response.data;
};

// PUT /api/admin/applications/:id/approve
export const approveApplicationApi = async (id) => {
  const response = await axiosInstance.put(`/admin/applications/${id}/approve`);
  return response.data;
};

// PUT /api/admin/applications/:id/reject
export const rejectApplicationApi = async (id, rejection_reason = '') => {
  const response = await axiosInstance.put(
    `/admin/applications/${id}/reject`,
    { rejection_reason }
  );
  return response.data;
};

// adminApi.js
export const deleteApplicationApi = async (id) => {
  const response = await axiosInstance.delete(`/admin/applications/${id}`);
  return response.data;
};
// GET /api/admin/users
export const getAllUsersApi = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};