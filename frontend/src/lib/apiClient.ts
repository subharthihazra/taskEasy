import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true, 
});

// Handle token refresh
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token by hitting refresh endpoint
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, {
          withCredentials: true
        });

        // Retry original request after refreshing tokens
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed, redirecting to login.');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
