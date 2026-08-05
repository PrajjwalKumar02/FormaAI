import { useState, useCallback } from 'react';

export const useApi = (apiFunction, options = {}) => {
    const {
        immediate = false,
        onSuccess = null,
        onError = null,
        initialData = null
    } = options;

    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const execute = useCallback(async (...params) => {
        setLoading(true);
        setStatus('loading');
        setError(null);

        try {
            const result = await apiFunction(...params);
            setData(result.data);
            setStatus('success');
            
            if (onSuccess) {
                onSuccess(result.data);
            }
            
            return { success: true, data: result.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(errorMessage);
            setStatus('error');
            
            if (onError) {
                onError(errorMessage);
            }
            
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [apiFunction, onSuccess, onError]);

    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setStatus('idle');
        setLoading(false);
    }, [initialData]);

    // Immediate execution
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);

    return {
        data,
        loading,
        error,
        status,
        execute,
        reset,
        isIdle: status === 'idle',
        isLoading: status === 'loading',
        isSuccess: status === 'success',
        isError: status === 'error'
    };
};