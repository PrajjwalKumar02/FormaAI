import { useState, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

export const useLLMAutofill = (fields, options = {}) => {
    const {
        apiEndpoint = '/api/ai/extract',
        onAutofillComplete = null,
        onAutofillError = null,
        minTextLength = 10,
        debounceDelay = 500,
        confidenceThreshold = 0.7
    } = options;

    const [isProcessing, setIsProcessing] = useState(false);
    const [suggestions, setSuggestions] = useState({});
    const [confidence, setConfidence] = useState({});
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    // Process text for autofill
    const processText = useCallback(async (text) => {
        if (!text || text.length < minTextLength) {
            setSuggestions({});
            setConfidence({});
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text,
                    fields: fields.map(f => ({ id: f.id, type: f.type, label: f.label }))
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error('AI service error');
            }

            const data = await response.json();

            // Filter suggestions based on confidence
            const filteredSuggestions = {};
            const filteredConfidence = {};
            
            fields.forEach(field => {
                const value = data.data[field.id];
                const conf = data.confidence?.[field.id] || 0.5;
                
                if (value && conf >= confidenceThreshold) {
                    filteredSuggestions[field.id] = value;
                    filteredConfidence[field.id] = conf;
                }
            });

            setSuggestions(filteredSuggestions);
            setConfidence(filteredConfidence);

            if (onAutofillComplete) {
                onAutofillComplete(filteredSuggestions);
            }

            return { suggestions: filteredSuggestions, confidence: filteredConfidence };

        } catch (err) {
            if (err.name === 'AbortError') {
                return;
            }
            setError(err.message);
            if (onAutofillError) {
                onAutofillError(err);
            }
            return null;
        } finally {
            setIsProcessing(false);
        }
    }, [fields, apiEndpoint, minTextLength, confidenceThreshold, onAutofillComplete, onAutofillError]);

    // Debounced processing
    const debouncedProcess = useDebounce(processText, debounceDelay);

    // Manual autofill
    const autofill = useCallback(async (text) => {
        return await processText(text);
    }, [processText]);

    // Autofill specific field
    const autofillField = useCallback((fieldId, value) => {
        setSuggestions(prev => ({ ...prev, [fieldId]: value }));
        setConfidence(prev => ({ ...prev, [fieldId]: 1.0 }));
    }, []);

    // Clear suggestions
    const clearSuggestions = useCallback(() => {
        setSuggestions({});
        setConfidence({});
        setError(null);
    }, []);

    // Apply suggestion to form
    const applySuggestion = useCallback((fieldId, formSetter) => {
        if (suggestions[fieldId]) {
            formSetter(fieldId, suggestions[fieldId]);
            // Clear the suggestion after applying
            setSuggestions(prev => {
                const newSuggestions = { ...prev };
                delete newSuggestions[fieldId];
                return newSuggestions;
            });
            return true;
        }
        return false;
    }, [suggestions]);

    // Apply all suggestions
    const applyAllSuggestions = useCallback((formSetter) => {
        let applied = 0;
        Object.entries(suggestions).forEach(([fieldId, value]) => {
            formSetter(fieldId, value);
            applied++;
        });
        setSuggestions({});
        return applied;
    }, [suggestions]);

    return {
        isProcessing,
        suggestions,
        confidence,
        error,
        processText: debouncedProcess,
        autofill,
        autofillField,
        clearSuggestions,
        applySuggestion,
        applyAllSuggestions,
        hasSuggestions: Object.keys(suggestions).length > 0
    };
};

// Usage Example:
const AIForm = () => {
    const fields = [
        { id: 'type', type: 'select', label: 'Incident Type' },
        { id: 'severity', type: 'select', label: 'Severity' },
        { id: 'location', type: 'text', label: 'Location' }
    ];

    const { 
        processText, 
        suggestions, 
        isProcessing, 
        applySuggestion,
        applyAllSuggestions 
    } = useLLMAutofill(fields, {
        onAutofillComplete: (data) => {
            console.log('Autofill complete:', data);
            toast.success('AI suggestions available!');
        }
    });

    const [formValues, setFormValues] = useState({});

    const handleTextChange = (e) => {
        processText(e.target.value);
    };

    return (
        <div>
            <textarea onChange={handleTextChange} placeholder="Describe your incident..." />
            
            {isProcessing && <span>AI is analyzing...</span>}
            
            {Object.keys(suggestions).length > 0 && (
                <div className="suggestions">
                    <p>AI Suggestions:</p>
                    {Object.entries(suggestions).map(([fieldId, value]) => (
                        <div key={fieldId}>
                            <span>{fieldId}: {value}</span>
                            <button onClick={() => applySuggestion(fieldId, setFormValues)}>
                                Apply
                            </button>
                        </div>
                    ))}
                    <button onClick={() => applyAllSuggestions(setFormValues)}>
                        Apply All
                    </button>
                </div>
            )}
        </div>
    );
};
