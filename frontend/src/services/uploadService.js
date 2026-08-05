import api from './api';

export const uploadService = {
    /**
     * Upload a single file
     * @param {File} file - File to upload
     * @param {string} type - File type (image, document, etc.)
     * @returns {Promise} - { success, data }
     */
    uploadFile: async (file, type = 'general') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'File upload failed' };
        }
    },

    /**
     * Upload multiple files
     * @param {File[]} files - Array of files to upload
     * @param {string} type - File type (image, document, etc.)
     * @returns {Promise} - { success, data }
     */
    uploadMultiple: async (files, type = 'general') => {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            formData.append('type', type);
            
            const response = await api.post('/upload/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Multiple file upload failed' };
        }
    },

    /**
     * Delete a file by ID
     * @param {string} fileId - File ID
     * @returns {Promise} - { success, message }
     */
    deleteFile: async (fileId) => {
        try {
            const response = await api.delete(`/upload/${fileId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'File deletion failed' };
        }
    },

    /**
     * Get file URL
     * @param {string} fileId - File ID or filename
     * @returns {string} - File URL
     */
    getFileUrl: (fileId) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        return `${baseURL}/uploads/${fileId}`;
    },

    /**
     * Upload profile image
     * @param {File} file - Image file
     * @returns {Promise} - { success, data }
     */
    uploadProfileImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await api.post('/upload/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Profile image upload failed' };
        }
    },

    /**
     * Upload incident attachment
     * @param {string} incidentId - Incident ID
     * @param {File} file - File to upload
     * @returns {Promise} - { success, data }
     */
    uploadIncidentAttachment: async (incidentId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await api.post(`/incidents/${incidentId}/attachments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Attachment upload failed' };
        }
    }
};
