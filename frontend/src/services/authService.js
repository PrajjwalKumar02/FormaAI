import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // ✅ Refresh token
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },

    // ✅ Check token status
    checkToken: async (token) => {
        const response = await api.post('/auth/check-token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', { profile: profileData });
        return response.data;
    },

    updateSettings: async (settings) => {
        const response = await api.put('/auth/settings', { settings });
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return { success: true };
    }
};
