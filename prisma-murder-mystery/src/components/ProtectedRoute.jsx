import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * Usage:
 *   <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
 *   <Route path="/admin"      element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
 *
 * Props:
 *   children    — the component to render if access is granted
 *   adminOnly   — if true, also requires role === 'admin'
 *   redirectTo  — where to redirect unauthenticated users (default: '/login')
 */
const ProtectedRoute = ({
    children,
    adminOnly = false,
    redirectTo = '/login'
}) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    // Still checking localStorage — show nothing (or a spinner) to avoid flicker
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0d0208',
                color: '#c9a96e',
                fontFamily: 'Georgia, serif',
                fontSize: '18px',
                letterSpacing: '2px'
            }}>
                VERIFYING ACCESS...
            </div>
        );
    }

    // Not logged in → redirect to login, preserving the intended path
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Logged in but not admin on an admin-only route → 403
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
