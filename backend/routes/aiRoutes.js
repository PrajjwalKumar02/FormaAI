const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  processAI,
  extractAIData,   
  generateAIForm,  
  analyzeAIData,   
} = require("../controllers/aiController");


router.post("/process", protect, processAI);
router.post("/extract", protect, extractAIData);     
router.post("/generate", protect, generateAIForm);   
router.post("/analyze", protect, analyzeAIData);     

module.exports = router;
