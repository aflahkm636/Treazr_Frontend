import axios from "axios";

export const URL  = "https://localhost:7138/api"


const api = axios.create({
  baseURL: URL, 
  withCredentials: true, 
});

// Optional: request interceptor to attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token refresh or other global error handling here
    return Promise.reject(error);
  }
);

export default api;