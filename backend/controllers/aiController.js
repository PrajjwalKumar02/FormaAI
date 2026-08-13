const { generateForm, extractIncident, analyzeIncident } = require("../services/aiService");
const FormTemplate = require("../models/FormTemplate");

/**
 * Process AI request
 */
const processAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const aiResult = await generateForm(prompt);

    if (!aiResult.success) {
      return res.status(400).json({
        success: false,
        message: "AI failed to generate template",
      });
    }

    const template = await FormTemplate.create({
      title: aiResult.title || "AI Generated Form",
      description: prompt,
      fields: aiResult.fields || [],
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "AI Template Generated & Saved Successfully",
      data: template,
    });

  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Extract incident data
 */
const extractAIData = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const result = await extractIncident(description);

    return res.status(200).json({
      success: true,
      data: result.data || result,
      confidence: result.confidence || 85.5,
      message: "Extraction successful",
    });

  } catch (error) {
    console.error("Extraction Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Generate form (without saving)
 */
const generateAIForm = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await generateForm(prompt);

    return res.status(200).json({
      success: true,
      data: result.data || result,
      message: "Form generated successfully",
    });

  } catch (error) {
    console.error("Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Analyze incident
 */
const analyzeAIData = async (req, res) => {
  try {
    const { incident_data } = req.body;

    if (!incident_data) {
      return res.status(400).json({
        success: false,
        message: "Incident data is required",
      });
    }

    const result = await analyzeIncident(incident_data);

    return res.status(200).json({
      success: true,
      data: result.data || result,
      message: "Analysis complete",
    });

  } catch (error) {
    console.error("Analysis Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  processAI,
  extractAIData,    // ✅ ADD THIS
  generateAIForm,   // ✅ ADD THIS
  analyzeAIData,    // ✅ ADD THIS
};
