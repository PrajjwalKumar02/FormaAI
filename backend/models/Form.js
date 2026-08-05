const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    // Form Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Incident Type
    incidentType: {
      type: String,
      required: true,
      trim: true,
    },

    // Incident Description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Incident Location
    location: {
      type: String,
      default: "",
      trim: true,
    },

    // Incident Date
    incidentDate: {
      type: Date,
    },

    // AI Extracted Data
    extractedData: {
      type: Object,
      default: {},
    },

    // Form Status
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending",
        "Processing",
        "Completed",
        "Submitted",
      ],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Form", formSchema);