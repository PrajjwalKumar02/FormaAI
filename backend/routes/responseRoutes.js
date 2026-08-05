const express = require("express");

const router = express.Router();

const {
  submitResponse,
  getResponses,
  getResponseById,
} = require("../controllers/responseController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, submitResponse);

router.get("/", protect, getResponses);

router.get("/:id", protect, getResponseById);

module.exports = router;