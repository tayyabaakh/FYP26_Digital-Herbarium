import axiosInstance from './api';

// POST /api/auth/login
export const loginApi = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

// GET /api/auth/me  (JWT auto-attached by interceptor)
export const getMeApi = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

// POST /api/auth/apply
export const applyAsBotanistApi = async (formData) => {
  const response = await axiosInstance.post('/auth/apply', formData);
  return response.data;
};