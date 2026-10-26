import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5001/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('healspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;