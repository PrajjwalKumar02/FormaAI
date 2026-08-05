import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Alternative: Debounce with leading/trailing options
export const useDebounceAdvanced = (value, delay = 500, options = {}) => {
    const { leading = false, trailing = true } = options;
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isLeading, setIsLeading] = useState(false);

    useEffect(() => {
        let timeoutId = null;
        
        if (leading && !isLeading) {
            setDebouncedValue(value);
            setIsLeading(true);
        }

        timeoutId = setTimeout(() => {
            if (trailing) {
                setDebouncedValue(value);
            }
            setIsLeading(false);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay, leading, trailing, isLeading]);

    return debouncedValue;
};