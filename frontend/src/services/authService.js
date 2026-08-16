import api from './api';

export const authService = {
    // ============================================================
    // REGISTER
    // ============================================================
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // ============================================================
    // EMAIL LOGIN
    // ============================================================
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // ============================================================
    // GOOGLE LOGIN
    // ============================================================
    googleLogin: async () => {
        try {
            // Option 1: Get Google OAuth URL from backend
            const response = await api.get('/auth/google/url');
            return response.data;
        } catch (error) {
            console.error('❌ Failed to get Google auth URL:', error);
            throw error;
        }
    },

    // ============================================================
    // GOOGLE CALLBACK - Handle after redirect
    // ============================================================
    googleCallback: async (code) => {
        const response = await api.post('/auth/google/callback', { code });
        return response.data;
    },

    // ============================================================
    // FACEBOOK LOGIN
    // ============================================================
    facebookLogin: async () => {
        try {
            // Option 1: Get Facebook OAuth URL from backend
            const response = await api.get('/auth/facebook/url');
            return response.data;
        } catch (error) {
            console.error('❌ Failed to get Facebook auth URL:', error);
            throw error;
        }
    },

    // ============================================================
    // FACEBOOK CALLBACK - Handle after redirect
    // ============================================================
    facebookCallback: async (code) => {
        const response = await api.post('/auth/facebook/callback', { code });
        return response.data;
    },

    // ============================================================
    // VERIFY SOCIAL TOKEN - For mobile/SPA token exchange
    // ============================================================
    verifyGoogleToken: async (idToken) => {
        const response = await api.post('/auth/google/verify', { idToken });
        return response.data;
    },

    verifyFacebookToken: async (accessToken) => {
        const response = await api.post('/auth/facebook/verify', { accessToken });
        return response.data;
    },

    // ============================================================
    // GET CURRENT USER
    // ============================================================
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // ============================================================
    // REFRESH TOKEN
    // ============================================================
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },

    // ============================================================
    // CHECK TOKEN STATUS
    // ============================================================
    checkToken: async (token) => {
        const response = await api.post('/auth/check-token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    // ============================================================
    // UPDATE PROFILE
    // ============================================================
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', { profile: profileData });
        return response.data;
    },

    // ============================================================
    // UPDATE SETTINGS
    // ============================================================
    updateSettings: async (settings) => {
        const response = await api.put('/auth/settings', { settings });
        return response.data;
    },

    // ============================================================
    // LOGOUT
    // ============================================================
    logout: async () => {
        try {
            // Optional: Call backend logout
            // await api.post('/auth/logout');
            
            // Always clear local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage even if API fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            return { success: true };
        }
    },

    // ============================================================
    // FORGOT PASSWORD
    // ============================================================
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // ============================================================
    // RESET PASSWORD
    // ============================================================
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================
    changePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/auth/change-password', { currentPassword, newPassword });
        return response.data;
    }
};
