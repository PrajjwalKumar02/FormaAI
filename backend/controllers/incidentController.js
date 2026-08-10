const Incident = require('../models/Incident');
const { generateForm, extractIncident, analyzeIncident } = require('../services/aiService');

// ================================================================
//  AI CONTROLLERS (Integration with AI Service)
// ================================================================

/**
 * @desc    Extract incident data using AI
 * @route   POST /api/ai/extract
 * @access  Private
 */
const extractIncidentData = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({
                success: false,
                message: 'Description is required'
            });
        }

        //  Call AI Service
        const result = await extractIncident(description);

        res.status(200).json({
            success: true,
            data: result.data || result,
            confidence: result.confidence || 85.5,
            message: 'Extraction successful'
        });

    } catch (error) {
        console.error('Extraction error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to extract data'
        });
    }
};

/**
 * @desc    Generate form using AI
 * @route   POST /api/ai/generate
 * @access  Private
 */
const generateFormFromAI = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required'
            });
        }

        //  Call AI Service
        const result = await generateForm(prompt);

        res.status(200).json({
            success: true,
            data: result.data || result,
            message: 'Form generated successfully'
        });

    } catch (error) {
        console.error('Form generation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate form'
        });
    }
};

/**
 * @desc    Analyze incident using AI
 * @route   POST /api/ai/analyze
 * @access  Private
 */
const analyzeIncidentData = async (req, res) => {
    try {
        const { incident_data } = req.body;

        if (!incident_data) {
            return res.status(400).json({
                success: false,
                message: 'Incident data is required'
            });
        }

        //  Call AI Service
        const result = await analyzeIncident(incident_data);

        res.status(200).json({
            success: true,
            data: result.data || result,
            message: 'Analysis complete'
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to analyze incident'
        });
    }
};

// ================================================================
//  INCIDENT CRUD CONTROLLERS
// ================================================================

/**
 * @desc    Create a new incident
 * @route   POST /api/incidents
 * @access  Private
 */
const createIncident = async (req, res) => {
    try {
        const incidentData = {
            ...req.body,
            user: req.user.id
        };

        const incident = await Incident.create(incidentData);

        res.status(201).json({
            success: true,
            data: incident
        });

    } catch (error) {
        console.error('Create incident error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create incident'
        });
    }
};

/**
 * @desc    Get all incidents
 * @route   GET /api/incidents
 * @access  Private
 */
const getIncidents = async (req, res) => {
    try {
        const { status, severity, type, search, limit = 50, page = 1 } = req.query;
        const query = { user: req.user.id };

        if (status) query.status = status;
        if (severity) query.severity = severity;
        if (type) query.type = type;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const incidents = await Incident.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email');

        const total = await Incident.countDocuments(query);

        res.status(200).json({
            success: true,
            data: incidents,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get incidents error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get incidents'
        });
    }
};

/**
 * @desc    Get single incident
 * @route   GET /api/incidents/:id
 * @access  Private
 */
const getIncident = async (req, res) => {
    try {
        const incident = await Incident.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('user', 'name email profile');

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: 'Incident not found'
            });
        }

        res.status(200).json({
            success: true,
            data: incident
        });

    } catch (error) {
        console.error('Get incident error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get incident'
        });
    }
};

/**
 * @desc    Update incident
 * @route   PUT /api/incidents/:id
 * @access  Private
 */
const updateIncident = async (req, res) => {
    try {
        let incident = await Incident.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: 'Incident not found'
            });
        }

        incident = await Incident.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: incident
        });

    } catch (error) {
        console.error('Update incident error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update incident'
        });
    }
};

/**
 * @desc    Delete incident
 * @route   DELETE /api/incidents/:id
 * @access  Private
 */
const deleteIncident = async (req, res) => {
    try {
        const incident = await Incident.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: 'Incident not found'
            });
        }

        await incident.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        console.error('Delete incident error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete incident'
        });
    }
};

/**
 * @desc    Add comment to incident
 * @route   POST /api/incidents/:id/comments
 * @access  Private
 */
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment text is required'
            });
        }

        const incident = await Incident.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: 'Incident not found'
            });
        }

        incident.comments.push({
            user: req.user.id,
            text: text.trim()
        });

        await incident.save();
        await incident.populate('comments.user', 'name email');

        res.status(201).json({
            success: true,
            data: incident.comments
        });

    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add comment'
        });
    }
};

/**
 * @desc    Get incident statistics
 * @route   GET /api/incidents/stats
 * @access  Private
 */
const getIncidentStats = async (req, res) => {
    try {
        const incidents = await Incident.find({ user: req.user.id });

        const total = incidents.length;
        const pending = incidents.filter(i => i.status === 'Reported' || i.status === 'Under Review').length;
        const inProgress = incidents.filter(i => i.status === 'In Progress').length;
        const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
        const critical = incidents.filter(i => i.severity === 'Critical').length;

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                inProgress,
                resolved,
                critical,
                resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get statistics'
        });
    }
};

// ================================================================
//  EXPORT ALL CONTROLLERS
// ================================================================

module.exports = {
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
};