import { useState, useEffect, useCallback } from 'react';
import { incidentService } from '../services/incidentService';
import { useAuth } from './useAuth';
import { useDebounce } from './useDebounce';
import { useNotifications } from './useNotifications';
import { handleError } from '../utils/errorHandler';
import { PAGINATION } from '../utils/constants';
import { getIncidentStats } from '../utils/helpers';

export const useIncidents = () => {
    const { user } = useAuth();
    const { showError } = useNotifications();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    
    const [filters, setFilters] = useState({
        status: '',
        severity: '',
        type: '',
        search: ''
    });
    
    const debouncedSearch = useDebounce(filters.search, 500);
    
    const [pagination, setPagination] = useState({
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        total: 0,
        pages: 0
    });

    // Load incidents
    const loadIncidents = useCallback(async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await incidentService.getAll({
                ...filters,
                search: debouncedSearch,
                page: pagination.page,
                limit: pagination.limit
            });
            
            setIncidents(response.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.pagination?.total || 0,
                pages: response.pagination?.pages || 0
            }));
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Incidents:load',
                showToast: true
            });
            setError(errorResult.message);
            showError(errorResult.message);
            setIncidents([]);
        } finally {
            setLoading(false);
        }
    }, [user, filters, debouncedSearch, pagination.page, pagination.limit, showError]);

    // Auto-load on dependencies change
    useEffect(() => {
        loadIncidents();
    }, [loadIncidents]);

    // Create incident
    const createIncident = useCallback(async (data) => {
        try {
            setLoading(true);
            const response = await incidentService.create(data);
            setIncidents(prev => [response.data, ...prev]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Incidents:create',
                showToast: true
            });
            setError(errorResult.message);
            showError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [showError]);

    // Update incident
    const updateIncident = useCallback(async (id, data) => {
        try {
            setLoading(true);
            const response = await incidentService.update(id, data);
            setIncidents(prev => prev.map(inc => 
                inc._id === id ? response.data : inc
            ));
            if (selectedIncident?._id === id) {
                setSelectedIncident(response.data);
            }
            return { success: true, data: response.data };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Incidents:update',
                showToast: true
            });
            setError(errorResult.message);
            showError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [selectedIncident, showError]);

    // Delete incident
    const deleteIncident = useCallback(async (id) => {
        try {
            setLoading(true);
            await incidentService.delete(id);
            setIncidents(prev => prev.filter(inc => inc._id !== id));
            if (selectedIncident?._id === id) {
                setSelectedIncident(null);
            }
            return { success: true };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Incidents:delete',
                showToast: true
            });
            setError(errorResult.message);
            showError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [selectedIncident, showError]);

    // Get single incident
    const getIncident = useCallback(async (id) => {
        try {
            setLoading(true);
            const response = await incidentService.getOne(id);
            setSelectedIncident(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Incidents:getOne',
                showToast: true
            });
            setError(errorResult.message);
            showError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [showError]);

    // AI Extraction
    const extractWithAI = useCallback(async (description) => {
        try {
            setLoading(true);
            const response = await incidentService.extract(description);
            return { success: true, data: response.data };
        } catch (err) {
            const errorResult = handleError(err, {
                context: 'Incidents:extractAI',
                showToast: true
            });
            setError(errorResult.message);
            showError(errorResult.message);
            return { success: false, error: errorResult.message };
        } finally {
            setLoading(false);
        }
    }, [showError]);

    // Get statistics
    const getStats = useCallback(() => {
        return getIncidentStats(incidents);
    }, [incidents]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Change page
    const goToPage = useCallback((page) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    // Clear filters
    const clearFilters = useCallback(() => {
        setFilters({
            status: '',
            severity: '',
            type: '',
            search: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    return {
        incidents,
        loading,
        error,
        selectedIncident,
        filters,
        pagination,
        loadIncidents,
        createIncident,
        updateIncident,
        deleteIncident,
        getIncident,
        extractWithAI,
        getStats,
        updateFilters,
        goToPage,
        clearFilters
    };
};
