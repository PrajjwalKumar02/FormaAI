const mongoose = require("mongoose");

const aiExtractionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    schemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormSchema",
    },
    rawPrompt: { type: String, required: true },
    rawResponse: { type: String, required: true },
    parsedJson: { type: mongoose.Schema.Types.Mixed, required: true },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

aiExtractionSchema.index({ processedAt: -1 });

module.exports = mongoose.model("AIExtraction", aiExtractionSchema);
