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
    const [socialLoading, setSocialLoading] = useState(false);

    // ✅ Load user on mount
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
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
            console.log(`⏳ Token expires in ${Math.ceil(timeLeft / (1000 * 60 * 60 * 24))} days`);
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

    // ============================================================
    // ✅ GOOGLE LOGIN - Redirect Flow
    // ============================================================
    const loginWithGoogle = async () => {
        setSocialLoading(true);
        
        try {
            console.log('🔐 Starting Google OAuth flow...');
            const response = await authService.googleLogin();
            
            // Redirect to Google OAuth URL
            if (response.url) {
                window.location.href = response.url;
                return { success: true, redirect: true };
            } else {
                throw new Error('No OAuth URL received');
            }
        } catch (error) {
            console.error('❌ Google login error:', error);
            toast.error(error.message || 'Google login failed');
            setSocialLoading(false);
            return { success: false, error: error.message };
        }
    };

    // ============================================================
    // ✅ GOOGLE CALLBACK - After redirect from Google
    // ============================================================
    const handleGoogleCallback = async (code) => {
        try {
            console.log('🔐 Processing Google callback...');
            const response = await authService.googleCallback(code);
            
            const { accessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
            toast.success(`Welcome${user.name ? `, ${user.name}` : ''}! 🎉`);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Google callback error:', error);
            toast.error(error.message || 'Google authentication failed');
            return { success: false, error: error.message };
        } finally {
            setSocialLoading(false);
        }
    };

    // ============================================================
    // ✅ FACEBOOK LOGIN - Redirect Flow
    // ============================================================
    const loginWithFacebook = async () => {
        setSocialLoading(true);
        
        try {
            console.log('🔐 Starting Facebook OAuth flow...');
            const response = await authService.facebookLogin();
            
            if (response.url) {
                window.location.href = response.url;
                return { success: true, redirect: true };
            } else {
                throw new Error('No OAuth URL received');
            }
        } catch (error) {
            console.error('❌ Facebook login error:', error);
            toast.error(error.message || 'Facebook login failed');
            setSocialLoading(false);
            return { success: false, error: error.message };
        }
    };

    // ============================================================
    // ✅ FACEBOOK CALLBACK - After redirect from Facebook
    // ============================================================
    const handleFacebookCallback = async (code) => {
        try {
            console.log('🔐 Processing Facebook callback...');
            const response = await authService.facebookCallback(code);
            
            const { accessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
            toast.success(`Welcome${user.name ? `, ${user.name}` : ''}! 🎉`);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Facebook callback error:', error);
            toast.error(error.message || 'Facebook authentication failed');
            return { success: false, error: error.message };
        } finally {
            setSocialLoading(false);
        }
    };

    // ============================================================
    // ✅ GOOGLE VERIFY - For mobile/SPA (token exchange)
    // ============================================================
    const verifyGoogleToken = async (idToken) => {
        setSocialLoading(true);
        
        try {
            console.log('🔐 Verifying Google token...');
            const response = await authService.verifyGoogleToken(idToken);
            
            const { accessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
            toast.success(`Welcome${user.name ? `, ${user.name}` : ''}! 🎉`);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Google token verification error:', error);
            toast.error(error.message || 'Google authentication failed');
            return { success: false, error: error.message };
        } finally {
            setSocialLoading(false);
        }
    };

    // ============================================================
    // ✅ FACEBOOK VERIFY - For mobile/SPA (token exchange)
    // ============================================================
    const verifyFacebookToken = async (accessToken) => {
        setSocialLoading(true);
        
        try {
            console.log('🔐 Verifying Facebook token...');
            const response = await authService.verifyFacebookToken(accessToken);
            
            const { accessToken: newAccessToken, refreshToken, user } = response;
            
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            setUser(user);
            setIsAuthenticated(true);
            toast.success(`Welcome${user.name ? `, ${user.name}` : ''}! 🎉`);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Facebook token verification error:', error);
            toast.error(error.message || 'Facebook authentication failed');
            return { success: false, error: error.message };
        } finally {
            setSocialLoading(false);
        }
    };

    // ============================================================
    // ✅ EMAIL LOGIN
    // ============================================================
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

    // ============================================================
    // ✅ REGISTER
    // ============================================================
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

    // ============================================================
    // ✅ LOGOUT
    // ============================================================
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            toast.info('Logged out successfully');
        }
    };

    // ============================================================
    // ✅ CHECK TOKEN STATUS
    // ============================================================
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

    // ============================================================
    // ✅ UPDATE PROFILE
    // ============================================================
    const updateProfile = async (data) => {
        try {
            const response = await authService.updateProfile(data);
            setUser(prev => ({ ...prev, ...response.user }));
            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            toast.error('Failed to update profile');
            return { success: false };
        }
    };

    // ============================================================
    // ✅ UPDATE SETTINGS
    // ============================================================
    const updateSettings = async (settings) => {
        try {
            const response = await authService.updateSettings(settings);
            setUser(prev => ({ ...prev, settings: response.settings }));
            toast.success('Settings updated successfully!');
            return { success: true };
        } catch (error) {
            toast.error('Failed to update settings');
            return { success: false };
        }
    };

    const value = {
        user,
        loading,
        socialLoading,
        isAuthenticated,
        login,
        loginWithGoogle,
        loginWithFacebook,
        handleGoogleCallback,
        handleFacebookCallback,
        verifyGoogleToken,
        verifyFacebookToken,
        register,
        logout,
        loadUser,
        refreshAccessToken,
        isTokenExpired,
        checkTokenStatus,
        updateProfile,
        updateSettings
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
