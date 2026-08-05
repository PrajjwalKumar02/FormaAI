const mongoose = require("mongoose");

// Single Field Schema
const fieldSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "text",
        "number",
        "email",
        "password",
        "textarea",
        "date",
        "dropdown",
        "radio",
        "checkbox",
        "file",
      ],
    },

    required: {
      type: Boolean,
      default: false,
    },

    placeholder: {
      type: String,
      default: "",
    },

    options: {
      type: [String],
      default: [],
    },

    // Validation Regex
    regex: {
      type: String,
      default: "",
    },

    // Conditional Rendering (3-Level Branching Support)
    showIf: {
      field: {
        type: String,
        default: "",
      },
      operator: {
        type: String,
        enum: ["equals", "notEquals"],
        default: "equals",
      },
      value: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },

    // Unique field key
    key: {
      type: String,
      default: "",
    },

    // Help text
    helperText: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// Form Template Schema
const formTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    fields: {
      type: [fieldSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FormTemplate", formTemplateSchema);