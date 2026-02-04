import axios from 'axios';

const API_BASE_URL = 'http://localhost:24/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor for authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('authToken');
    }
    const customError = {
      message: error.response?.data?.message.message || "An unexpected error occurred",
      status: error.response?.status,
      fields: error.response?.data?.error
    };
    return Promise.reject(customError);
  }
);

export default apiClient;