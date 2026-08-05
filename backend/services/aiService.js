const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

const generateForm = async (prompt) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/ai/generate`,
      {
        prompt,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Service Error:",
      error.response?.data || error.message
    );

    throw new Error("AI Service is unavailable");
  }
};

module.exports = {
  generateForm,
};