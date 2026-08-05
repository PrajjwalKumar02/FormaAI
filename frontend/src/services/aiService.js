import api from './api';

export const aiService = {
    /**
     * Extract incident data from text using AI
     * @param {string} text - Incident description text
     * @returns {Promise} - { success, data }
     */
    extractIncident: async (text) => {
        try {
            const response = await api.post('/incidents/extract', { description: text });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'AI extraction failed' };
        }
    },

    /**
     * Generate form from extracted incident data
     * @param {Object} extractedData - Data from AI extraction
     * @returns {Promise} - { success, data }
     */
    generateForm: async (extractedData) => {
        try {
            const response = await api.post('/ai/generate-form', extractedData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Form generation failed' };
        }
    },

    /**
     * Analyze incident with AI
     * @param {string} incidentId - Incident ID
     * @returns {Promise} - { success, data }
     */
    analyze: async (incidentId) => {
        try {
            const response = await api.get(`/ai/analyze/${incidentId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'AI analysis failed' };
        }
    },

    /**
     * Get AI predictions for incident
     * @param {Object} data - Incident data for prediction
     * @returns {Promise} - { success, data }
     */
    predict: async (data) => {
        try {
            const response = await api.post('/ai/predict', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'AI prediction failed' };
        }
    },

    /**
     * Chat with AI assistant
     * @param {string} message - User message
     * @param {string} context - Optional context (incident ID, etc.)
     * @returns {Promise} - { success, data }
     */
    chat: async (message, context = null) => {
        try {
            const response = await api.post('/ai/chat', { message, context });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'AI chat failed' };
        }
    },

    /**
     * Auto-fill form fields using AI
     * @param {string} text - Text to analyze
     * @param {Array} fields - Form fields to fill
     * @returns {Promise} - { success, data }
     */
    autofill: async (text, fields) => {
        try {
            const response = await api.post('/ai/autofill', { text, fields });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'AI autofill failed' };
        }
    }
};
