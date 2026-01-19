import axios from "axios";
import { toast } from "sonner";
import { getSession, signOut } from "./actions/auth-actions";

/**
 * API instance for making requests to the backend
 * Includes automatic token management and error handling
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    const result = await getSession();
    const token = result?.session?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Preserve FormData - let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      // CRITICAL: Delete Content-Type to let browser set multipart/form-data with boundary
      delete config.headers['Content-Type'];
      // Also ensure we don't have any transformRequest that would modify FormData
      config.transformRequest = undefined;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific error statuses
    if (error.response?.status === 401) {
      // Handle unauthorized, clear local data
      localStorage.clear();
      await signOut();

      // Only redirect if not already on an auth page
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth/signin")) {
        window.location.href = "/auth/signin";
      }
      if (!currentPath.startsWith("/auth/signup")) {
        window.location.href = "/auth/signup";
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user is authenticated but doesn't have permission
      console.error(
        "Access forbidden:",
        error.response.data?.message ||
        "You don't have permission to access this resource"
      );
      toast.error(
        "Acesso negado: " + error.response.data?.message ||
        "Você não tem permissão para acessar este recurso"
      );
    }
    return Promise.reject(error);
  }
);


export default api;
