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
  },
  { timestamps: true }
);

// One draft per user per form schema
draftSchema.index({ userId: 1, schemaId: 1 }, { unique: true });

module.exports = mongoose.model("Draft", draftSchema);
