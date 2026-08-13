import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const useTokenRefresh = (options = {}) => {
    const {
        interval = 5 * 60 * 1000, // 5 minutes
        onTokenExpired = null,
        onTokenRefreshed = null,
    } = options;

    const { isTokenExpired, refreshToken } = useAuth();
    const timerRef = useRef(null);

    useEffect(() => {
        // ✅ Check token on mount
        if (isTokenExpired()) {
            if (onTokenExpired) {
                onTokenExpired();
            }
        }

        // ✅ Check token periodically
        timerRef.current = setInterval(() => {
            if (isTokenExpired()) {
                console.log('⏰ Token expired');
                if (onTokenExpired) {
                    onTokenExpired();
                }
            } else {
                // ✅ Refresh token before expiry
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const timeLeft = payload.exp * 1000 - Date.now();
                        
                        // ✅ Refresh if less than 10 minutes remaining
                        if (timeLeft < 10 * 60 * 1000) {
                            console.log('🔄 Refreshing token...');
                            refreshToken();
                            if (onTokenRefreshed) {
                                onTokenRefreshed();
                            }
                        }
                    } catch (e) {
                        console.error('Error checking token:', e);
                    }
                }
            }
        }, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [interval, isTokenExpired, refreshToken, onTokenExpired, onTokenRefreshed]);
};
