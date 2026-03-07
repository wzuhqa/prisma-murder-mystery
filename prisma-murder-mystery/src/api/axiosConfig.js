import axios from 'axios';

// ─── Base URL ──────────────────────────────────────────────────────────────────
// Backend has been removed. All requests are simulated.
const BASE_URL = '/api';

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

// ─── Request Interceptor — Mock Responses ─────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pmm_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // --- SIMULATION LOGIC ---
        // Overriding the adapter to return mock data immediately
        config.adapter = async (config) => {
            console.log(`[API Simulation] ${config.method.toUpperCase()} ${config.url}`, config.data || '');

            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

            // Mock responses based on URL
            if (config.url.includes('/events')) {
                return {
                    data: {
                        success: true,
                        data: [
                            { _id: 'ev1', title: 'The Midnight Masquerade', price: 999, availableTickets: 50, date: new Date().toISOString() },
                            { _id: 'ev2', title: 'Shadows of Serenity', price: 1499, availableTickets: 20, date: new Date(Date.now() + 86400000).toISOString() },
                            { _id: 'ev3', title: 'Gilded Cage Mystery', price: 799, availableTickets: 0, date: new Date(Date.now() + 172800000).toISOString() }
                        ]
                    },
                    status: 200, statusText: 'OK', headers: {}, config
                };
            }

            if (config.url.includes('/auth/login') || config.url.includes('/auth/register')) {
                const mockUser = { id: 'u1', name: 'Detective Operative', email: 'agent@prisma.io', role: 'user' };
                return {
                    data: { success: true, token: 'mock_jwt_token', user: mockUser },
                    status: 200, statusText: 'OK', headers: {}, config
                };
            }

            return {
                data: { success: true, message: 'Simulated response' },
                status: 200, statusText: 'OK', headers: {}, config
            };
        };

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
