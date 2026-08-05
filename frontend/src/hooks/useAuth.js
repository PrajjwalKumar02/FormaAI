import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { handleError } from '../utils/errorHandler';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken, removeToken] = useLocalStorage(STORAGE_KEYS.TOKEN, null);

    // Load user on mount
    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
            setUser(null);
        }
    }, [token]);

    const loadUser = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authService.getMe();
            setUser(response.user);
            setError(null);
            return response;
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Auth:loadUser',
                showToast: false
            });
            setError(errorResult.message);
            removeToken();
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, [removeToken]);

    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login({ email, password });
            const { token: newToken, user: userData } = response;
            
            setToken(newToken);
            setUser(userData);
            return { success: true, user: userData };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Auth:login',
                showToast: false
            });
            setError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [setToken]);

    const register = useCallback(async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.register(userData);
            const { token: newToken, user: newUser } = response;
            
            setToken(newToken);
            setUser(newUser);
            return { success: true, user: newUser };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Auth:register',
                showToast: false
            });
            setError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [setToken]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            removeToken();
            setUser(null);
            setError(null);
            return { success: true };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Auth:logout',
                showToast: false
            });
            return { success: false, error: errorResult.message };
        }
    }, [removeToken]);

    const updateProfile = useCallback(async (profileData) => {
        try {
            setLoading(true);
            const response = await authService.updateProfile(profileData);
            setUser(prev => ({ ...prev, ...response.profile }));
            return { success: true, data: response };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Auth:updateProfile',
                showToast: false
            });
            setError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = useCallback(async (settings) => {
        try {
            setLoading(true);
            const response = await authService.updateSettings(settings);
            setUser(prev => ({ ...prev, settings: response.settings }));
            return { success: true, data: response };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Auth:updateSettings',
                showToast: false
            });
            setError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user && !!token,
        token,
        login,
        register,
        logout,
        loadUser,
        updateProfile,
        updateSettings
    };
};
