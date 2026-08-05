import { useState, useEffect, useMemo, useCallback } from 'react';

export const useConditionalLogic = (fields, formValues) => {
    const [visibleFields, setVisibleFields] = useState([]);
    const [fieldDependencies, setFieldDependencies] = useState({});

    // Parse conditional logic from fields
    const parseConditions = useCallback((field) => {
        if (!field.conditions || field.conditions.length === 0) {
            return { visible: true, dependencies: [] };
        }

        const dependencies = [];
        let visible = true;

        field.conditions.forEach(condition => {
            const fieldValue = formValues[condition.field];
            const conditionMet = evaluateCondition(fieldValue, condition.operator, condition.value);
            
            if (condition.operator === 'and') {
                visible = visible && conditionMet;
            } else if (condition.operator === 'or') {
                visible = visible || conditionMet;
            }

            dependencies.push(condition.field);
        });

        return { visible, dependencies };
    }, [formValues]);

    // Evaluate a single condition
    const evaluateCondition = (fieldValue, operator, compareValue) => {
        switch (operator) {
            case 'equals':
                return fieldValue === compareValue;
            case 'not_equals':
                return fieldValue !== compareValue;
            case 'contains':
                return String(fieldValue).includes(String(compareValue));
            case 'not_contains':
                return !String(fieldValue).includes(String(compareValue));
            case 'greater_than':
                return Number(fieldValue) > Number(compareValue);
            case 'less_than':
                return Number(fieldValue) < Number(compareValue);
            case 'greater_than_equal':
                return Number(fieldValue) >= Number(compareValue);
            case 'less_than_equal':
                return Number(fieldValue) <= Number(compareValue);
            case 'empty':
                return !fieldValue || fieldValue.length === 0;
            case 'not_empty':
                return fieldValue && fieldValue.length > 0;
            default:
                return true;
        }
    };

    // Update visible fields when form values change
    useEffect(() => {
        const newVisibleFields = [];
        const newDependencies = {};

        fields.forEach(field => {
            const { visible, dependencies } = parseConditions(field);
            if (visible) {
                newVisibleFields.push(field);
            }
            newDependencies[field.id] = dependencies;
        });

        setVisibleFields(newVisibleFields);
        setFieldDependencies(newDependencies);
    }, [fields, formValues, parseConditions]);

    // Check if a field is required based on visibility
    const isFieldRequired = useCallback((fieldId) => {
        const field = fields.find(f => f.id === fieldId);
        if (!field) return false;
        if (!field.required) return false;
        
        // If field has conditions, it's only required when visible
        if (field.conditions?.length > 0) {
            return visibleFields.some(f => f.id === fieldId);
        }
        
        return field.required;
    }, [fields, visibleFields]);

    // Get dependencies for a field
    const getFieldDependencies = useCallback((fieldId) => {
        return fieldDependencies[fieldId] || [];
    }, [fieldDependencies]);

    // Validate conditional fields
    const validateConditionalFields = useCallback(() => {
        const errors = {};
        visibleFields.forEach(field => {
            if (field.required && !formValues[field.id]) {
                errors[field.id] = `${field.label || 'Field'} is required`;
            }
        });
        return errors;
    }, [visibleFields, formValues]);

    // Get visibility status for all fields
    const getVisibilityMap = useCallback(() => {
        const map = {};
        fields.forEach(field => {
            map[field.id] = visibleFields.some(f => f.id === field.id);
        });
        return map;
    }, [fields, visibleFields]);

    return {
        visibleFields,
        fieldDependencies,
        isFieldRequired,
        getFieldDependencies,
        validateConditionalFields,
        getVisibilityMap
    };
};

// Usage Example:
const DynamicForm = ({ fields }) => {
    const [formValues, setFormValues] = useState({});
    const { visibleFields, validateConditionalFields } = useConditionalLogic(fields, formValues);
    
    const handleSubmit = () => {
        const errors = validateConditionalFields();
        if (Object.keys(errors).length === 0) {
            // Submit only visible fields
            const visibleData = {};
            visibleFields.forEach(field => {
                visibleData[field.id] = formValues[field.id];
            });
            console.log('Submitting:', visibleData);
        }
    };
};
