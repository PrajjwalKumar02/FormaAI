import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from './useForm';
import { useConditionalLogic } from './useConditionalLogic';
import { useAutosave } from './useAutosave';

export const useDynamicForm = (schema, options = {}) => {
    const {
        autoSave = true,
        saveDelay = 3000,
        onSave = null,
        validateOnChange = true,
        onSubmit = null,
        initialValues = {}
    } = options;

    // State
    const [fields, setFields] = useState(schema?.fields || []);
    const [formStep, setFormStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Initialize form with useForm
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldError,
        reset: resetForm
    } = useForm(initialValues);

    // Conditional logic
    const { 
        visibleFields,
        isFieldRequired,
        validateConditionalFields,
        getVisibilityMap
    } = useConditionalLogic(fields, values);

    // Auto-save
    const autoSaveHook = useAutosave(
        values,
        async (data) => {
            if (onSave) {
                return await onSave(data);
            }
            return { success: true };
        },
        {
            enabled: autoSave,
            delay: saveDelay,
            onSaveSuccess: () => {
                console.log('Form auto-saved');
            },
            onSaveError: (error) => {
                console.error('Auto-save error:', error);
            }
        }
    );

    // Validate form
    const validateForm = useCallback(() => {
        const validationErrors = {};
        
        visibleFields.forEach(field => {
            // Required validation
            if (field.required && !values[field.id]) {
                validationErrors[field.id] = `${field.label || 'Field'} is required`;
            }
            
            // Custom validation
            if (field.validation) {
                const fieldValue = values[field.id];
                
                // Min length
                if (field.validation.minLength && fieldValue?.length < field.validation.minLength) {
                    validationErrors[field.id] = `Minimum ${field.validation.minLength} characters required`;
                }
                
                // Max length
                if (field.validation.maxLength && fieldValue?.length > field.validation.maxLength) {
                    validationErrors[field.id] = `Maximum ${field.validation.maxLength} characters allowed`;
                }
                
                // Pattern
                if (field.validation.pattern && fieldValue) {
                    const regex = new RegExp(field.validation.pattern);
                    if (!regex.test(fieldValue)) {
                        validationErrors[field.id] = 'Invalid format';
                    }
                }
                
                // Min value
                if (field.validation.min && Number(fieldValue) < field.validation.min) {
                    validationErrors[field.id] = `Minimum value is ${field.validation.min}`;
                }
                
                // Max value
                if (field.validation.max && Number(fieldValue) > field.validation.max) {
                    validationErrors[field.id] = `Maximum value is ${field.validation.max}`;
                }
            }
        });
        
        // Conditional validation
        const conditionalErrors = validateConditionalFields();
        
        setFormErrors({ ...validationErrors, ...conditionalErrors });
        return { ...validationErrors, ...conditionalErrors };
    }, [visibleFields, values, validateConditionalFields]);

    // Validate on change
    useEffect(() => {
        if (validateOnChange) {
            const validationErrors = validateForm();
            Object.entries(validationErrors).forEach(([fieldId, error]) => {
                setFieldError(fieldId, error);
            });
        }
    }, [values, validateForm, validateOnChange, setFieldError]);

    // Submit form
    const submitForm = useCallback(async () => {
        setIsSubmitting(true);
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setIsSubmitting(false);
            return { success: false, errors: validationErrors };
        }
        
        try {
            const visibleData = {};
            visibleFields.forEach(field => {
                visibleData[field.id] = values[field.id];
            });
            
            if (onSubmit) {
                const result = await onSubmit(visibleData);
                setIsSubmitting(false);
                return { success: true, data: result };
            }
            
            setIsSubmitting(false);
            return { success: true, data: visibleData };
        } catch (error) {
            setIsSubmitting(false);
            return { success: false, error: error.message };
        }
    }, [validateForm, visibleFields, values, onSubmit]);

    // Reset form
    const reset = useCallback(() => {
        resetForm();
        setFormStep(0);
        setFormErrors({});
    }, [resetForm]);

    // Get current step fields
    const getCurrentStepFields = useCallback(() => {
        if (!schema?.steps || schema.steps.length === 0) {
            return visibleFields;
        }
        return visibleFields.filter(field => {
            const step = schema.steps[formStep];
            return step?.fields?.includes(field.id);
        });
    }, [schema, formStep, visibleFields]);

    // Navigate steps
    const nextStep = useCallback(() => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix all errors before proceeding');
            return false;
        }
        if (schema?.steps && formStep < schema.steps.length - 1) {
            setFormStep(prev => prev + 1);
            return true;
        }
        return false;
    }, [validateForm, schema, formStep]);

    const prevStep = useCallback(() => {
        if (formStep > 0) {
            setFormStep(prev => prev - 1);
        }
    }, [formStep]);

    // Transform form data for API
    const getFormData = useCallback(() => {
        const formData = {};
        visibleFields.forEach(field => {
            const value = values[field.id];
            if (field.type === 'file' && value instanceof File) {
                // Handle file upload
                formData[field.id] = value;
            } else {
                formData[field.id] = value;
            }
        });
        return formData;
    }, [visibleFields, values]);

    // Progress calculation
    const progress = useMemo(() => {
        if (!schema?.steps) {
            // Calculate based on filled fields
            const totalFields = visibleFields.filter(f => f.required).length;
            const filledFields = visibleFields.filter(f => 
                f.required && values[f.id] && values[f.id] !== ''
            ).length;
            return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
        }
        return Math.round(((formStep + 1) / schema.steps.length) * 100);
    }, [schema, formStep, visibleFields, values]);

    return {
        // State
        fields: visibleFields,
        values,
        errors: { ...errors, ...formErrors },
        touched,
        isSubmitting,
        formStep,
        progress,
        getCurrentStepFields,
        
        // Navigation
        nextStep,
        prevStep,
        goToStep: setFormStep,
        
        // Form handling
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldError,
        validateForm,
        submitForm,
        reset,
        getFormData,
        
        // Auto-save
        autoSave: autoSaveHook,
        isSaving: autoSaveHook.isSaving,
        
        // Utilities
        isFieldRequired,
        getVisibilityMap
    };
};

// Usage Example:
const MyDynamicForm = () => {
    const schema = {
        steps: [
            { fields: ['type', 'severity'] },
            { fields: ['location', 'dateTime'] }
        ],
        fields: [
            { id: 'type', type: 'select', label: 'Incident Type', required: true },
            { id: 'severity', type: 'select', label: 'Severity', required: true },
            // ... more fields
        ]
    };

    const form = useDynamicForm(schema, {
        autoSave: true,
        onSave: async (data) => {
            const response = await api.saveForm(data);
            return response;
        },
        onSubmit: async (data) => {
            const response = await api.submitForm(data);
            return response;
        }
    });

    return (
        <div>
            <StepProgress progress={form.progress} />
            <FormFields fields={form.getCurrentStepFields()} form={form} />
            <div className="flex gap-2">
                <button onClick={form.prevStep}>Previous</button>
                <button onClick={form.nextStep}>Next</button>
                <button onClick={form.submitForm}>Submit</button>
            </div>
            {form.isSaving && <span>Saving...</span>}
        </div>
    );
};
