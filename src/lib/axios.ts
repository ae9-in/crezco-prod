import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.token) {
                    // Use .set() for better compatibility with newer Axios versions
                    if (config.headers) {
                        config.headers.set('Authorization', `Bearer ${user.token}`);
                    }
                }
            } catch (err) {
                console.error('Failed to parse user from localStorage:', err);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;


