import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Toast notifications
    const showSuccess = useCallback((message, options = {}) => {
        return toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options
        });
    }, []);

    const showError = useCallback((message, options = {}) => {
        return toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options
        });
    }, []);

    const showInfo = useCallback((message, options = {}) => {
        return toast.info(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options
        });
    }, []);

    const showWarning = useCallback((message, options = {}) => {
        return toast.warning(message, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options
        });
    }, []);

    // In-app notifications
    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            read: false,
            timestamp: new Date(),
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => {
            const removed = prev.find(n => n.id === id);
            if (removed && !removed.read) {
                setUnreadCount(prevCount => Math.max(0, prevCount - 1));
            }
            return prev.filter(n => n.id !== id);
        });
    }, []);

    return {
        notifications,
        unreadCount,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification
    };
};