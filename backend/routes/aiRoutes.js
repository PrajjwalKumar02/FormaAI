const express = require("express");
const router = express.Router();

const { processAI } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/ai/process
router.post("/process", protect, processAI);

module.exports = router;