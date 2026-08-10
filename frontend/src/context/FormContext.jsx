// src/context/FormContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from "../services/api";
// Create the context
const FormContext = createContext();

// Custom hook to use the form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within FormProvider');
  }
  return context;
};

// ✅ Helper to save form to localStorage
const saveFormToHistory = (formData, extractedData) => {
  const allForms = JSON.parse(localStorage.getItem('allForms') || '[]');

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const newForm = {
    id: Date.now(),
    title: extractedData?.incidentType || 'Form Submission',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed',
    data: formData,
    extractedData: extractedData,
    userId: user?.id || 'unknown',
    userName: user?.name || 'Guest',
    reference: `F-${new Date().getFullYear()}-${String(allForms.length + 1).padStart(3, '0')}`,
    submittedAt: new Date().toISOString()
  };

  allForms.push(newForm);
  localStorage.setItem('allForms', JSON.stringify(allForms));

  // ✅ Update form count
  const currentCount = parseInt(localStorage.getItem('formCount') || '0');
  localStorage.setItem('formCount', (currentCount + 1).toString());

  return newForm;
};

// ✅ Get all forms
const getAllForms = () => {
  return JSON.parse(localStorage.getItem('allForms') || '[]');
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [formConfig, setFormConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [formStatus, setFormStatus] = useState('draft');
  const [allForms, setAllForms] = useState([]);

  // Load forms on mount
  useEffect(() => {
    setAllForms(getAllForms());
  }, []);

  // Update form data
  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    autoSaveDraft({ ...formData, ...data });
  };

  // Set form field
  const setField = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
    autoSaveDraft({ ...formData, [fieldName]: value });
  };

  // Auto-save draft
  const autoSaveDraft = (data) => {
    try {
      localStorage.setItem('formDraft', JSON.stringify(data || formData));
    } catch (e) {
      console.warn('Failed to auto-save draft:', e);
    }
  };

  // Set field error
  const setFieldError = (fieldName, errorMessage) => {
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
  };

  // Clear all errors
  const clearErrors = () => {
    setErrors({});
  };

  // Reset form completely
  const resetForm = () => {
    setFormData({});
    setFormConfig(null);
    setCurrentStep(0);
    setExtractedData(null);
    setErrors({});
    setIsSubmitted(false);
    setDraftSaved(false);
    setFormStatus('draft');
    localStorage.removeItem('formDraft');
  };

  // Save draft
  const saveDraft = () => {
    setDraftSaved(true);
    autoSaveDraft();
    setFormStatus('draft');
    setTimeout(() => setDraftSaved(false), 2000);
    return true;
  };

  // Load draft
  const loadDraft = () => {
    const saved = localStorage.getItem('formDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  // Check if draft exists
  const hasDraft = () => {
    return localStorage.getItem('formDraft') !== null;
  };

  // ✅ Submit form - NOW SAVES TO HISTORY
  const submitForm = async () => {
    if (!validateForm()) {
      return { success: false, errors: 'Please fix all errors before submitting' };
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // ✅ Save form to history
      const savedForm = saveFormToHistory(formData, extractedData);
      console.log('Form saved:', savedForm);

      // ✅ Update all forms list
      setAllForms(getAllForms());

      localStorage.removeItem('formDraft');
      setIsSubmitted(true);
      setFormStatus('submitted');

      return { success: true, form: savedForm };
} catch (error) {
    console.error('Form submission failed:', error);
    setFormStatus('error');

    return {
        success: false,
        error: error.message || 'Unable to submit form. Please try again.'
    };
}
  // Validate form
  const validateForm = (data = formData) => {
    const newErrors = {};
    const fields = formConfig?.sections?.flatMap(s => s.fields) || [];

    fields.forEach(field => {
    const value = data[field.id];

    if (
        field.required &&
        (
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '')
        )
    ) {
        newErrors[field.id] = `${field.label} is required`;
    }
});

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const goToStep = (step) => {
    if (step >= 0 && step < (formConfig?.sections?.length || 1)) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    const currentSection = formConfig?.sections?.[currentStep];
    if (currentSection?.fields) {
      let hasError = false;
      currentSection.fields.forEach(field => {
        if (field.required && !formData[field.id]) {
          setFieldError(field.id, `${field.label} is required`);
          hasError = true;
        }
      });
      if (hasError) {
        return false;
      }
    }

    if (currentStep < (formConfig?.sections?.length || 1) - 1) {
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  };

  // Generate form config
  const generateFormConfig = (extractedData) => {
    setExtractedData(extractedData);

    const config = {
      sections: [
        {
          id: 'personal',
          title: 'Personal Information',
          fields: [
            { id: 'fullName', type: 'text', label: 'Full Name', required: true },
            { id: 'email', type: 'email', label: 'Email Address', required: true },
            { id: 'phone', type: 'tel', label: 'Phone Number' },
          ]
        },
        {
          id: 'incident',
          title: 'Incident Details',
          fields: [
            { id: 'type', type: 'select', label: 'Incident Type', options: ['Accident', 'Theft', 'Damage', 'Other'], required: true },
            { id: 'date', type: 'date', label: 'Date of Incident', required: true },
            { id: 'description', type: 'textarea', label: 'Description', required: true },
          ]
        },
        {
          id: 'additional',
          title: 'Additional Information',
          fields: [
            { id: 'witnesses', type: 'text', label: 'Witnesses' },
            { id: 'policeReport', type: 'checkbox', label: 'Police Report Filed' },
            { id: 'severity', type: 'radio', label: 'Severity', options: ['Low', 'Medium', 'High', 'Critical'] },
          ]
        }
      ]
    };

    setFormConfig(config);
    return config;
  };

  // Get current section
  const getCurrentSection = () => {
    return formConfig?.sections?.[currentStep] || null;
  };

  // Get total steps
  const getTotalSteps = () => {
    return formConfig?.sections?.length || 0;
  };

  // Check if form is complete
  const isFormComplete = () => {
    if (!formConfig) return false;
    const fields = formConfig.sections.flatMap(s => s.fields);
    for (const field of fields) {
      if (field.required && !formData[field.id]) {
        return false;
      }
    }
    return true;
  };

  // Get progress percentage
  const getProgress = () => {
    if (!formConfig) return 0;
    const totalSteps = formConfig.sections.length;
    return ((currentStep + 1) / totalSteps) * 100;
  };

  // ✅ Get all forms (for dashboard)
  const getForms = () => {
    return getAllForms();
  };

  // ✅ Get user's forms
  const getUserForms = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const allForms = getAllForms();
    if (user) {
      return allForms.filter(f => f.userId === user.id);
    }
    return allForms;
  };

  const value = {
    formData,
    setFormData,
    formConfig,
    setFormConfig,
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    extractedData,
    setExtractedData,
    errors,
    setErrors,
    isSubmitted,
    setIsSubmitted,
    draftSaved,
    setDraftSaved,
    formStatus,
    setFormStatus,
    allForms,
    setAllForms,
    updateFormData,
    setField,
    setFieldError,
    clearErrors,
    validateForm,
    resetForm,
    saveDraft,
    loadDraft,
    hasDraft,
    submitForm,
    goToStep,
    nextStep,
    previousStep,
    generateFormConfig,
    getCurrentSection,
    getTotalSteps,
    isFormComplete,
    getProgress,
    getForms,
    getUserForms,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
