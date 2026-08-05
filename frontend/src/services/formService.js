import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { sanitizeInput } from '../utils/validators';
import { formatErrorMessage } from '../utils/errorHandler';

export const formService = {
    create: async (data) => {
        try {
            const sanitizedData = {
                ...data,
                title: sanitizeInput(data.title),
                description: sanitizeInput(data.description)
            };
            const response = await api.post(API_ENDPOINTS.FORMS.BASE, sanitizedData);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to create form'));
        }
    },

    getAll: async (params = {}) => {
        try {
            const response = await api.get(API_ENDPOINTS.FORMS.BASE, { params });
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to load forms'));
        }
    },

    getOne: async (id) => {
        try {
            if (!id) throw new Error('Form ID is required');
            const response = await api.get(`${API_ENDPOINTS.FORMS.BASE}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Form not found'));
        }
    },

    update: async (id, data) => {
        try {
            const sanitizedData = {
                ...data,
                title: sanitizeInput(data.title),
                description: sanitizeInput(data.description)
            };
            const response = await api.put(`${API_ENDPOINTS.FORMS.BASE}/${id}`, sanitizedData);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to update form'));
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`${API_ENDPOINTS.FORMS.BASE}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to delete form'));
        }
    },

    submit: async (id, data) => {
        try {
            const response = await api.post(API_ENDPOINTS.FORMS.SUBMIT(id), { data });
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to submit form'));
        }
    },

    getSubmissions: async (id) => {
        try {
            const response = await api.get(API_ENDPOINTS.FORMS.SUBMISSIONS(id));
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to get submissions'));
        }
    },

    getSchema: async (id) => {
        try {
            const response = await api.get(API_ENDPOINTS.FORMS.SCHEMA(id));
            return response.data;
        } catch (error) {
            throw new Error(formatErrorMessage(error, 'Failed to get form schema'));
        }
    }
};
