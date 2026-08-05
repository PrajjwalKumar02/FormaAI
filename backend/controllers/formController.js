const Form = require("../models/Form");

// ==========================
// Create Form
// ==========================
const createForm = async (req, res) => {
  try {
    const {
      incidentType,
      description,
      location,
      incidentDate,
      status,
      extractedData,
    } = req.body;

    // Validation
    if (!incidentType || !description) {
      return res.status(400).json({
        success: false,
        message: "Incident Type and Description are required",
      });
    }

    // Create Form
    const form = await Form.create({
      user: req.user.id,
      incidentType,
      description,
      location,
      incidentDate,
      extractedData: extractedData || {},
      status: status || "Draft",
    });

    res.status(201).json({
      success: true,
      message: "Form Saved Successfully",
      form,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get All Forms
// ==========================
const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: forms.length,
      forms,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Single Form
// ==========================
const getSingleForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      form,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Update Form
// ==========================
const updateForm = async (req, res) => {
  try {
    const form = await Form.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        ...req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form Updated Successfully",
      form,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Delete Form
// ==========================
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Export Controllers
// ==========================
module.exports = {
  createForm,
  getAllForms,
  getSingleForm,
  updateForm,
  deleteForm,
};