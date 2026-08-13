import api from './api';

export const aiService = {
    extract: async (description) => {
        try {
            console.log('🔍 aiService.extract called');
            console.log('📝 Description:', description.substring(0, 100) + '...');
            
            const response = await api.post('/ai/extract', { description });
            
            console.log('📥 Response status:', response.status);
            console.log('📥 Response data:', response.data);
            
            // ✅ Check if response has data
            if (!response.data) {
                console.error('❌ No data in response');
                return { success: false, message: 'No data returned from AI' };
            }
            
            // ✅ If response is already the data, wrap it
            if (response.data.success !== undefined) {
                return response.data;
            }
            
            // ✅ If response.data has data property
            if (response.data.data) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            
            // ✅ Fallback: wrap the response
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('❌ AI Extraction Error:', error);
            if (error.response) {
                console.error('❌ Response error data:', error.response.data);
                return { success: false, message: error.response.data?.message || 'AI service error' };
            }
            return { success: false, message: 'AI service unavailable' };
        }
    },

    generate: async (prompt) => {
        try {
            const response = await api.post('/ai/generate', { prompt });
            return response.data;
        } catch (error) {
            console.error('❌ AI Generation Error:', error);
            throw error.response?.data || { success: false, message: 'AI generation failed' };
        }
    },

    analyze: async (incidentData) => {
        try {
            const response = await api.post('/ai/analyze', { incident_data: incidentData });
            return response.data;
        } catch (error) {
            console.error('❌ AI Analysis Error:', error);
            throw error.response?.data || { success: false, message: 'AI analysis failed' };
        }
    }
};
