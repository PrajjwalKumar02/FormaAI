const FormTemplate = require("../models/FormTemplate");
const FormResponse = require("../models/FormResponse");

// ==========================
// Submit Dynamic Form
// ==========================
const submitResponse = async (req, res) => {
  try {
    const { template, responses, status } = req.body;

    // Check Template
    const formTemplate = await FormTemplate.findById(template);

    if (!formTemplate) {
      return res.status(404).json({
        success: false,
        message: "Form Template not found",
      });
    }

    // Validate Fields
    for (const field of formTemplate.fields) {
      const value = responses[field.key];

      // Required Validation
      if (
        field.required &&
        (value === undefined || value === null || value === "")
      ) {
        return res.status(400).json({
          success: false,
          message: `${field.label} is required`,
        });
      }

      // Regex Validation
      if (field.regex && value) {
        const regex = new RegExp(field.regex);

        if (!regex.test(value)) {
          return res.status(400).json({
            success: false,
            message: `${field.label} is invalid`,
          });
        }
      }
    }

    // Save Response
    const savedResponse = await FormResponse.create({
      user: req.user.id,
      template,
      responses,
      status: status || "Submitted",
    });

    return res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      data: savedResponse,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get User Responses
// ==========================
const getResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find({
      user: req.user.id,
    })
      .populate("template", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Single Response
// ==========================
const getResponseById = async (req, res) => {
  try {
    const response = await FormResponse.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("template");

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Response not found",
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Exports
// ==========================
module.exports = {
  submitResponse,
  getResponses,
  getResponseById,
};