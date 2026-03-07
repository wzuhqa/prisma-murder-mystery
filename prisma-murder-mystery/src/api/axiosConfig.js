import axios from 'axios';

// ─── Base URL ──────────────────────────────────────────────────────────────────
// Set VITE_API_URL in your .env file:  VITE_API_URL=http://localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Simple in-memory cache for GET requests
const CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Request Interceptor — attach JWT ─────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pmm_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Check cache for GET requests
        if (config.method === 'get') {
            const cacheKey = config.url;
            const cachedParams = config.params ? JSON.stringify(config.params) : '';
            const fullKey = cacheKey + cachedParams;

            if (CACHE.has(fullKey)) {
                const cachedData = CACHE.get(fullKey);
                if (Date.now() - cachedData.timestamp < CACHE_TTL) {
                    config.adapter = () => Promise.resolve({
                        data: cachedData.data,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                        request: {}
                    });
                } else {
                    CACHE.delete(fullKey);
                }
            }
            config.meta = config.meta || {};
            config.meta.cacheKey = fullKey;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle 401 auto-logout ────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => {
        // Save GET responses to cache
        if (response.config.method === 'get' && response.config.meta?.cacheKey) {
            CACHE.set(response.config.meta.cacheKey, {
                timestamp: Date.now(),
                data: response.data
            });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear storage and redirect
            localStorage.removeItem('pmm_token');
            localStorage.removeItem('pmm_user');
            // Only redirect if we're not already on the login/register page
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
