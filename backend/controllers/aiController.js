const { generateForm } = require("../services/aiService");
const FormTemplate = require("../models/FormTemplate");

const processAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // Generate template from AI
    const aiResult = await generateForm(prompt);

    // AI response validation
    if (!aiResult.success) {
      return res.status(400).json({
        success: false,
        message: "AI failed to generate template",
      });
    }

    // Save template in MongoDB
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

module.exports = {
  processAI,
};