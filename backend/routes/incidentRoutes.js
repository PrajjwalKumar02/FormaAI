const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    // AI Controllers
    extractIncidentData,
    generateFormFromAI,
    analyzeIncidentData,
    
    // CRUD Controllers
    createIncident,
    getIncidents,
    getIncident,
    updateIncident,
    deleteIncident,
    addComment,
    getIncidentStats
} = require('../controllers/incidentController');

// ================================================================
//  AI ROUTES
// ================================================================
router.post('/extract', protect, extractIncidentData);
router.post('/generate', protect, generateFormFromAI);
router.post('/analyze', protect, analyzeIncidentData);

// ================================================================
//  INCIDENT CRUD ROUTES
// ================================================================
router.route('/')
    .get(protect, getIncidents)
    .post(protect, createIncident);

router.route('/:id')
    .get(protect, getIncident)
    .put(protect, updateIncident)
    .delete(protect, deleteIncident);

router.post('/:id/comments', protect, addComment);
router.get('/stats', protect, getIncidentStats);

module.exports = router;