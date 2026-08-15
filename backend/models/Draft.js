const mongoose = require("mongoose");

const draftSchema = new mongoose.Schema(
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
    partialData: { type: mongoose.Schema.Types.Mixed, default: {} },
    lastSavedAt: { type: Date, default: Date.now },
    // Tracks how much of the form the user has filled (0 to 100)
    completionPercent: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

// One draft per user per form schema
draftSchema.index({ userId: 1, schemaId: 1 }, { unique: true });

// Auto-delete drafts after 30 days (TTL Index) to save database space
draftSchema.index({ lastSavedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model("Draft", draftSchema);
