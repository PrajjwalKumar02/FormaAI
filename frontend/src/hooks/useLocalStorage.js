import { useState, useCallback, useEffect } from 'react';

export const useLocalStorage = (key, initialValue = null) => {
    const getStoredValue = useCallback(() => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                // ✅ Check if it's a token (string) or JSON
                if (key === 'token') {
                    return item; // Return as is, don't parse
                }
                return JSON.parse(item);
            }
            return initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [key, initialValue]);

    const [storedValue, setStoredValue] = useState(getStoredValue);

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            // ✅ For token, store as string without JSON.stringify
            if (key === 'token') {
                localStorage.setItem(key, valueToStore);
            } else {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const remove = useCallback(() => {
        try {
            localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === key && e.newValue) {
                try {
                    if (key === 'token') {
                        setStoredValue(e.newValue);
                    } else {
                        setStoredValue(JSON.parse(e.newValue));
                    }
                } catch (error) {
                    console.error(`Error parsing storage change for key "${key}":`, error);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, remove];
};
