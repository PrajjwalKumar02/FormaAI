import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export const useSearch = (items, searchFields = [], delay = 300) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const debouncedSearchTerm = useDebounce(searchTerm, delay);

    const filteredItems = useMemo(() => {
        if (!items || items.length === 0) return [];

        let result = [...items];

        // Text search
        if (debouncedSearchTerm && searchFields.length > 0) {
            const term = debouncedSearchTerm.toLowerCase();
            result = result.filter(item => {
                return searchFields.some(field => {
                    const value = getNestedValue(item, field);
                    return value && value.toString().toLowerCase().includes(term);
                });
            });
        }

        // Additional filters
        Object.entries(activeFilters).forEach(([key, value]) => {
            if (value && value !== 'all' && value !== '') {
                result = result.filter(item => {
                    const itemValue = getNestedValue(item, key);
                    return itemValue === value;
                });
            }
        });

        return result;
    }, [items, debouncedSearchTerm, searchFields, activeFilters]);

    const setSearch = useCallback((term) => {
        setSearchTerm(term);
    }, []);

    const setFilter = useCallback((key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setActiveFilters({});
        setSearchTerm('');
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    const removeFilter = useCallback((key) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
        });
    }, []);

    return {
        searchTerm,
        setSearch,
        activeFilters,
        setFilter,
        removeFilter,
        clearFilters,
        clearSearch,
        filteredItems,
        resultsCount: filteredItems.length,
        isSearching: searchTerm.length > 0
    };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : '';
    }, obj);
};