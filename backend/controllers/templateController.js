const FormTemplate = require("../models/FormTemplate");

// Create Template
const createTemplate = async (req, res) => {
  try {
    const template = await FormTemplate.create({
      ...req.body,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Template Created Successfully",
      data: template,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Templates
const getTemplates = async (req, res) => {
  try {
    const templates = await FormTemplate.find().populate(
      "createdBy",
      "name email"
    );

    return res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Template
const getTemplateById = async (req, res) => {
  try {
    const template = await FormTemplate.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Template
const updateTemplate = async (req, res) => {
  try {
    const template = await FormTemplate.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template Updated Successfully",
      data: template,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Template
const deleteTemplate = async (req, res) => {
  try {
    const template = await FormTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template Not Found",
      });
    }

    await template.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Template Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
};