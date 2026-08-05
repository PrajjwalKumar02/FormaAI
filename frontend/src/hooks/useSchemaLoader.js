import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useLocalStorage } from './useLocalStorage';

export const useSchemaLoader = (schemaId = null, options = {}) => {
    const {
        autoLoad = true,
        cacheEnabled = true,
        cacheDuration = 3600000, // 1 hour in ms
        onLoadSuccess = null,
        onLoadError = null,
        fallbackSchema = null
    } = options;

    const [schema, setSchema] = useState(null);
    const [schemaVersion, setSchemaVersion] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [cachedSchema, setCachedSchema, removeCachedSchema] = useLocalStorage(
        `schema_${schemaId || 'default'}`,
        null
    );

    // API for loading schema
    const { execute: loadSchemaApi, loading, error, data } = useApi(
        async (id) => {
            const response = await fetch(`/api/schemas/${id}`);
            if (!response.ok) {
                throw new Error('Failed to load schema');
            }
            return response.json();
        },
        { immediate: false }
    );

    // Load schema from API
    const loadSchema = useCallback(async (id = schemaId) => {
        try {
            // Check cache first
            if (cacheEnabled && cachedSchema) {
                const cacheAge = Date.now() - (cachedSchema._timestamp || 0);
                if (cacheAge < cacheDuration) {
                    setSchema(cachedSchema.schema);
                    setSchemaVersion(cachedSchema.version);
                    setLastUpdated(cachedSchema._timestamp);
                    if (onLoadSuccess) onLoadSuccess(cachedSchema.schema);
                    return cachedSchema.schema;
                }
            }

            // Load from API
            const result = await loadSchemaApi(id);
            if (result.success) {
                const schemaData = result.data;
                setSchema(schemaData.schema || schemaData);
                setSchemaVersion(schemaData.version || '1.0');
                setLastUpdated(Date.now());
                
                // Cache the schema
                if (cacheEnabled) {
                    setCachedSchema({
                        schema: schemaData.schema || schemaData,
                        version: schemaData.version || '1.0',
                        _timestamp: Date.now()
                    });
                }
                
                if (onLoadSuccess) onLoadSuccess(schemaData);
                return schemaData;
            }
            
            if (fallbackSchema) {
                setSchema(fallbackSchema);
                if (onLoadSuccess) onLoadSuccess(fallbackSchema);
                return fallbackSchema;
            }
            
            throw new Error('Failed to load schema');
        } catch (err) {
            console.error('Schema load error:', err);
            setError(err.message);
            if (onLoadError) onLoadError(err);
            
            if (fallbackSchema) {
                setSchema(fallbackSchema);
                return fallbackSchema;
            }
            
            return null;
        }
    }, [schemaId, cacheEnabled, cachedSchema, cacheDuration, loadSchemaApi, fallbackSchema, onLoadSuccess, onLoadError]);

    // Reload schema (ignore cache)
    const reloadSchema = useCallback(async () => {
        removeCachedSchema();
        return await loadSchema(schemaId);
    }, [schemaId, loadSchema, removeCachedSchema]);

    // Validate schema
    const validateSchema = useCallback((schemaToValidate) => {
        const errors = [];
        
        // Check required fields
        if (!schemaToValidate.fields || !Array.isArray(schemaToValidate.fields)) {
            errors.push('Schema must have a fields array');
        }
        
        if (schemaToValidate.fields) {
            schemaToValidate.fields.forEach((field, index) => {
                if (!field.id) {
                    errors.push(`Field at index ${index} is missing id`);
                }
                if (!field.type) {
                    errors.push(`Field ${field.id || index} is missing type`);
                }
                if (!field.label) {
                    errors.push(`Field ${field.id || index} is missing label`);
                }
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }, []);

    // Transform schema for use in forms
    const transformSchema = useCallback((rawSchema) => {
        const validation = validateSchema(rawSchema);
        if (!validation.isValid) {
            console.warn('Schema validation failed:', validation.errors);
            return null;
        }

        return {
            ...rawSchema,
            fields: rawSchema.fields.map(field => ({
                ...field,
                // Add default values if missing
                required: field.required || false,
                placeholder: field.placeholder || '',
                options: field.options || [],
                validation: field.validation || {}
            })),
            version: rawSchema.version || '1.0'
        };
    }, [validateSchema]);

    // Auto-load on mount
    useEffect(() => {
        if (autoLoad && schemaId) {
            loadSchema(schemaId);
        }
    }, [autoLoad, schemaId]);

    // Transform schema when loaded
    useEffect(() => {
        if (schema) {
            const transformed = transformSchema(schema);
            if (transformed) {
                setSchema(transformed);
            }
        }
    }, [schema]);

    return {
        schema,
        schemaVersion,
        loading,
        error,
        lastUpdated,
        loadSchema,
        reloadSchema,
        validateSchema,
        transformSchema,
        hasSchema: !!schema
    };
};

// Usage Example:
const FormBuilder = ({ schemaId }) => {
    const { 
        schema, 
        loading, 
        error, 
        reloadSchema,
        transformSchema 
    } = useSchemaLoader(schemaId, {
        autoLoad: true,
        cacheEnabled: true,
        onLoadSuccess: (data) => {
            console.log('Schema loaded:', data);
            toast.success('Form schema loaded');
        },
        onLoadError: (error) => {
            toast.error('Failed to load form schema');
        }
    });

    if (loading) return <Loader />;
    if (error) return <ErrorDisplay error={error} onRetry={reloadSchema} />;
    if (!schema) return <EmptyState />;

    return <DynamicForm schema={schema} />;
};
