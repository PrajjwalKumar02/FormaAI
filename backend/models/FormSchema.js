const mongoose = require("mongoose");

// A single condition rule: e.g. { field: "incidentType", operator: "equals", value: "collision" }
const ruleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: {
    type: String,
    enum: ["equals", "notEquals", "in", "notIn"],
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
});

// Multi-condition showIf: supports AND / OR logic across multiple rules
// This allows 3-level deep branching (e.g. show field C only if A="yes" AND B="collision")
const showIfSchema = new mongoose.Schema({
  logic: {
    type: String,
    enum: ["AND", "OR"],
    default: "AND",
  },
  conditions: [ruleSchema], // Array of conditions checked together using AND/OR
});

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ["string", "number", "boolean", "date", "enum", "file", "checkbox"]
  }, // Restricted to valid form input types
  label: String,
  description: String, // Help text or description for the field
  required: { type: Boolean, default: false },
  enum: [String],
  validation: {
    regex: String,
    custom: String,
  },
  // Now supports multi-level branching with AND/OR logic
  showIf: showIfSchema,
});

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    version: { type: Number, default: 1 },
    fields: [fieldSchema],
    rules: [ruleSchema],
    // Allows admins to disable a form without deleting it
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Index to quickly retrieve latest schema version
formSchema.index({ name: 1, version: -1 }, { unique: true });

module.exports = mongoose.model("FormSchema", formSchema);
