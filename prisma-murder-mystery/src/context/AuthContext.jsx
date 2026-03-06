import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosConfig';

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Storage helpers ───────────────────────────────────────────────────────────
const TOKEN_KEY = 'pmm_token';
const USER_KEY = 'pmm_user';

const saveSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

// ─── Provider ──────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // true while we hydrate from storage

    // Hydrate auth state on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                clearSession();
            }
        }
        setLoading(false);
    }, []);

    // ── Register ─────────────────────────────────────────────────────────────
    const register = useCallback(async ({ name, email, password }) => {
        const { data } = await axiosInstance.post('/auth/register', { name, email, password });
        saveSession(data.token, data.user);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    // ── Login ─────────────────────────────────────────────────────────────────
    const login = useCallback(async ({ email, password }) => {
        const { data } = await axiosInstance.post('/auth/login', { email, password });
        saveSession(data.token, data.user);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        clearSession();
        setToken(null);
        setUser(null);
    }, []);

    // ── Helpers ───────────────────────────────────────────────────────────────
    const isAuthenticated = Boolean(token && user);
    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside an <AuthProvider>');
    }
    return ctx;
};

export default AuthContext;
