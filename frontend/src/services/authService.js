import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { 
    isValidEmail, 
    validatePassword,
    sanitizeInput 
} from '../utils/validators';
import { formatErrorMessage } from '../utils/errorHandler';

export const authService = {
    /**
     * Register a new user
     */
    register: async (userData) => {
        try {
            // Validate input
            const sanitizedName = sanitizeInput(userData.name);
            const sanitizedEmail = sanitizeInput(userData.email);
            
            if (!isValidEmail(sanitizedEmail)) {
                throw new Error('Invalid email address');
            }
            
            const passwordValidation = validatePassword(userData.password);
            if (!passwordValidation.isValid) {
                throw new Error(passwordValidation.errors[0]);
            }

            const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
                ...userData,
                name: sanitizedName,
                email: sanitizedEmail
            });
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Registration failed'));
        }
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        try {
            if (!credentials.email || !credentials.password) {
                throw new Error('Email and password are required');
            }
            
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Login failed'));
        }
    },

    /**
     * Get current user
     */
    getMe: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.AUTH.ME);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to get user'));
        }
    },

    /**
     * Update profile
     */
    updateProfile: async (profileData) => {
        try {
            const sanitizedData = {
                ...profileData,
                name: sanitizeInput(profileData.name),
                bio: sanitizeInput(profileData.bio),
                location: sanitizeInput(profileData.location)
            };
            
            const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, {
                profile: sanitizedData
            });
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Profile update failed'));
        }
    },

    /**
     * Update settings
     */
    updateSettings: async (settings) => {
        try {
            const response = await api.put(API_ENDPOINTS.AUTH.SETTINGS, { settings });
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Settings update failed'));
        }
    },

    /**
     * Change password
     */
    changePassword: async (passwordData) => {
        try {
            const validation = validatePassword(passwordData.newPassword);
            if (!validation.isValid) {
                throw new Error(validation.errors[0]);
            }
            
            const response = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Password change failed'));
        }
    },

    /**
     * Logout
     */
    logout: async () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Logout failed'));
        }
    }
};
