const { validationResult, body, param, query } = require('express-validator');

// Validate request
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// Validation rules
const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    validateRequest
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
    validateRequest
];

const validateIncident = [
    body('type').notEmpty().withMessage('Incident type required'),
    body('description').notEmpty().withMessage('Description required'),
    validateRequest
];

module.exports = {
    validateRequest,
    validateRegister,
    validateLogin,
    validateIncident
};
