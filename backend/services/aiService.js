const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

/**
 * Generate form using AI
 */
const generateForm = async (prompt) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/generate`,
      { prompt },
      { timeout: 30000 }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Generation Error:",
      error.response?.data || error.message
    );
    throw new Error("AI Service is unavailable");
  }
};

/**
 * ✅ Extract incident data using AI
 */
const extractIncident = async (description) => {
  try {
    console.log('🔍 Extracting incident data...');
    console.log('📤 Description:', description.substring(0, 100) + '...');
    
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/extract`,
      { description },
      { timeout: 30000 }
    );

    console.log('✅ Extraction successful');
    return response.data;
  } catch (error) {
    console.error(
      "AI Extraction Error:",
      error.response?.data || error.message
    );
    throw new Error("AI Service is unavailable");
  }
};

/**
 * ✅ Analyze incident using AI
 */
const analyzeIncident = async (incidentData) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/analyze`,
      { incident_data: incidentData },
      { timeout: 30000 }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Analysis Error:",
      error.response?.data || error.message
    );
    throw new Error("AI Service is unavailable");
  }
};

/**
 * ✅ Process AI request (unified)
 */
const processAI = async (prompt) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/process`,
      { prompt },
      { timeout: 30000 }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Process Error:",
      error.response?.data || error.message
    );
    throw new Error("AI Service is unavailable");
  }
};

module.exports = {
  generateForm,
  extractIncident,    
  analyzeIncident,    
  processAI,          
};
