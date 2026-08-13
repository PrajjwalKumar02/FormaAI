// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ✅ Load user on mount
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            // Check if token is expired
            if (isTokenExpired(accessToken)) {
                console.log('⏰ Token expired, trying to refresh...');
                refreshAccessToken();
            } else {
                loadUser();
            }
        } else {
            setLoading(false);
        }
    }, []);

    // ✅ Check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000;
            const timeLeft = expiryTime - Date.now();
            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
            console.log(`⏳ Token expires in ${daysLeft} days`);
            return timeLeft <= 0;
        } catch (e) {
            return true;
        }
    };

    // ✅ Refresh access token
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token');
            }
            
            const response = await authService.refreshToken(refreshToken);
            if (response.success) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                console.log('✅ Token refreshed successfully!');
                loadUser();
            } else {
                throw new Error('Refresh failed');
            }
        } catch (error) {
            console.error('❌ Token refresh failed:', error);
            logout();
            setLoading(false);
        }
    };

    const loadUser = async () => {
        try {
            const response = await authService.getMe();
            setUser(response.user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error loading user:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Login - Save both tokens (90 days)
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            const { accessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
            toast.success('Welcome back! 🎉');
            return { success: true, user };
        } catch (error) {
            toast.error(error.message || 'Login failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // ✅ Register - Save both tokens (90 days)
    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const response = await authService.register({ name, email, password });
            const { accessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
            toast.success('Account created successfully! 🎉');
            return { success: true, user };
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // ✅ Logout - Clear all tokens
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        toast.info('Logged out successfully');
    };

    // ✅ Check token status
    const checkTokenStatus = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return { valid: false, daysLeft: 0 };
            
            const response = await authService.checkToken(token);
            return response;
        } catch (error) {
            return { valid: false, daysLeft: 0 };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        loadUser,
        refreshAccessToken,
        isTokenExpired,
        checkTokenStatus,
        updateProfile: async (data) => {
            try {
                const response = await authService.updateProfile(data);
                setUser(prev => ({ ...prev, ...response.profile }));
                toast.success('Profile updated successfully!');
                return { success: true };
            } catch (error) {
                toast.error('Failed to update profile');
                return { success: false };
            }
        },
        updateSettings: async (settings) => {
            try {
                const response = await authService.updateSettings(settings);
                setUser(prev => ({ ...prev, settings: response.settings }));
                toast.success('Settings updated successfully!');
                return { success: true };
            } catch (error) {
                toast.error('Failed to update settings');
                return { success: false };
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
