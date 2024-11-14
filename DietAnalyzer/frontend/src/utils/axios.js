import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to extract data
api.interceptors.response.use(
  (response) => {
    if (response.data.data) {
      return response.data.data;
    }
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;