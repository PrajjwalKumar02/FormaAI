const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: {
    type: String,
    enum: ["equals", "notEquals", "in", "notIn"],
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
});

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "string", "enum", "number", "date"
  label: String,
  required: { type: Boolean, default: false },
  enum: [String],
  validation: {
    regex: String,
    custom: String,
  },
  showIf: ruleSchema, // Conditional display rule
});

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: Number, default: 1 },
    fields: [fieldSchema],
    rules: [ruleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Index to quickly retrieve latest schema version
formSchema.index({ name: 1, version: -1 }, { unique: true });

module.exports = mongoose.model("FormSchema", formSchema);
