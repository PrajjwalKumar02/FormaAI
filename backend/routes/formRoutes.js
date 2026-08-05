const express = require("express");
const router = express.Router();

const {
  createForm,
  getAllForms,
  getSingleForm,
  updateForm,
  deleteForm,
} = require("../controllers/formController");

const { protect } = require("../middleware/authMiddleware");

// ==========================
// Create Form
// ==========================
router.post("/", protect, createForm);

// ==========================
// Get All Forms
// ==========================
router.get("/", protect, getAllForms);

// ==========================
// Get Single Form
// ==========================
router.get("/:id", protect, getSingleForm);

// ==========================
// Update Form
// ==========================
router.put("/:id", protect, updateForm);

// ==========================
// Delete Form
// ==========================
router.delete("/:id", protect, deleteForm);

module.exports = router;