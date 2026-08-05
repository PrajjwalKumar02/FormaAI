import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from './useDebounce';

export const useAutosave = (data, saveFunction, options = {}) => {
    const {
        delay = 2000,              // Save after 2 seconds of inactivity
        enabled = true,
        onSaveStart = null,
        onSaveSuccess = null,
        onSaveError = null,
        saveOnUnmount = true,       // Save when component unmounts
        maxRetries = 3,
        retryDelay = 3000
    } = options;

    const debouncedData = useDebounce(data, delay);
    const isSaving = useRef(false);
    const retryCount = useRef(0);
    const lastSavedData = useRef(null);
    const saveTimeoutRef = useRef(null);

    // Auto-save on data change
    useEffect(() => {
        if (!enabled) return;
        if (isSaving.current) return;
        
        // Check if data actually changed
        if (lastSavedData.current && JSON.stringify(debouncedData) === JSON.stringify(lastSavedData.current)) {
            return;
        }

        const performSave = async () => {
            try {
                isSaving.current = true;
                retryCount.current = 0;
                
                if (onSaveStart) onSaveStart();
                
                const result = await saveFunction(debouncedData);
                
                if (result?.success) {
                    lastSavedData.current = debouncedData;
                    if (onSaveSuccess) onSaveSuccess(result);
                } else {
                    throw new Error(result?.error || 'Save failed');
                }
            } catch (error) {
                console.error('Auto-save error:', error);
                
                // Retry logic
                if (retryCount.current < maxRetries) {
                    retryCount.current += 1;
                    saveTimeoutRef.current = setTimeout(() => {
                        performSave();
                    }, retryDelay * retryCount.current);
                } else {
                    if (onSaveError) onSaveError(error);
                }
            } finally {
                isSaving.current = false;
            }
        };

        saveTimeoutRef.current = setTimeout(performSave, delay);

        return () => {
            clearTimeout(saveTimeoutRef.current);
        };
    }, [debouncedData, delay, enabled]);

    // Save on unmount
    useEffect(() => {
        return () => {
            if (saveOnUnmount && lastSavedData.current !== JSON.stringify(data)) {
                saveFunction(data).catch(err => {
                    console.error('Final save on unmount error:', err);
                });
            }
        };
    }, []);

    const manualSave = useCallback(async () => {
        try {
            const result = await saveFunction(data);
            if (result?.success) {
                lastSavedData.current = data;
            }
            return result;
        } catch (error) {
            console.error('Manual save error:', error);
            return { success: false, error };
        }
    }, [data, saveFunction]);

    const getSaveStatus = useCallback(() => ({
        isSaving: isSaving.current,
        hasUnsavedChanges: lastSavedData.current !== JSON.stringify(data),
        retryCount: retryCount.current
    }), [data]);

    return {
        manualSave,
        getSaveStatus,
        isSaving: isSaving.current,
        lastSaved: lastSavedData.current
    };
};

// Usage Example:
const MyForm = () => {
    const [formData, setFormData] = useState({});
    const { manualSave, isSaving, getSaveStatus } = useAutosave(
        formData,
        async (data) => {
            const response = await api.saveForm(data);
            return response;
        },
        { 
            delay: 3000,
            onSaveSuccess: () => toast.success('Form saved'),
            onSaveError: () => toast.error('Auto-save failed')
        }
    );
};
