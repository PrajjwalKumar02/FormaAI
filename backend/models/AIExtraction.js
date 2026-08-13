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
    // How confident the AI was in its extraction (0.0 to 1.0)
    confidence: { type: Number, min: 0, max: 1, default: null },
    // Which AI model was used (e.g. "gpt-4", "gemini-pro")
    modelUsed: { type: String, default: null },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

aiExtractionSchema.index({ processedAt: -1 });

module.exports = mongoose.model("AIExtraction", aiExtractionSchema);
