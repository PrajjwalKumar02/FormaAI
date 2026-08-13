const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormSchema",
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["submitted", "reviewed", "approved", "rejected"],
      default: "submitted",
    },
    // Optional note left by a reviewer (e.g. "Missing documents" or "Approved!")
    reviewNote: {
      type: String,
      default: "",
    },
    // When the form was actually submitted by the user
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Fast lookup for user submissions
submissionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);
