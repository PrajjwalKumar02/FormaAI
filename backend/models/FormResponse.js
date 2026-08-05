const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema(
  {
    // User who submitted the form
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Template used
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormTemplate",
      required: true,
    },

    // User Answers (Dynamic)
    responses: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Submission Status
    status: {
      type: String,
      enum: ["Draft", "Submitted"],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FormResponse", formResponseSchema);