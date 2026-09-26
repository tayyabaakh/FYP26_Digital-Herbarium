

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://fyp26-digital-herbarium.onrender.com/api",
     baseURL: "http://localhost:4000/api" ,
    //  headers: { 'Content-Type': 'application/json' },
});

export const BACKEND_URL = new URL(axiosInstance.defaults.baseURL).origin;

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
},
(error)=>Promise.reject(error));

// ── Response Interceptor: handle 401 globally ─────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 401 during login means wrong credentials.
    // Let loginThunk/LoginPage handle this error.
    const isLoginRequest = url.includes("/auth/login");

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Don't use window.location.href here.
      // Let React Router handle navigation.
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

