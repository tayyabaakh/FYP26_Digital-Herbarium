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

export const submissionApi = async (formData) => {
  const response = await axiosInstance.post('/submissions', formData);
  return response.data;
}

export const draftSubmissionApi = async (formData) => {
  const response = await axiosInstance.post('/submissions/draft', formData);
  return response.data;
}
export const getMySubmissionsApi = async () => {
    const response = await axiosInstance.get("/submissions/my");
    return response.data;
};

// =====================================================
// ADMIN VERIFICATION APIS
// =====================================================

// GET /api/submissions/admin/all?status=pending
export const getAllSubmissionsAdminApi = async (status = 'pending') => {
  const response = await axiosInstance.get(`/submissions/admin/all`, {
    params: { status },
  });
  return response.data;
};

// PUT /api/submissions/admin/approve/:id
export const approveSubmissionApi = async (id, comments = '') => {
  const response = await axiosInstance.put(`/submissions/admin/approve/${id}`, {
    comments,
  });
  return response.data;
};

// PUT /api/submissions/admin/reject/:id
export const rejectSubmissionApi = async (id, comments = '') => {
  const response = await axiosInstance.put(`/submissions/admin/reject/${id}`, {
    comments,
  });
  return response.data;
};