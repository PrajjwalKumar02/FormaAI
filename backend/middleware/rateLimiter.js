const rateLimit = require('express-rate-limit');

// General rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    }
});

// Auth rate limiter (stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.'
    }
});

// AI rate limiter
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: {
        success: false,
        message: 'AI extraction limit exceeded. Please try again after an hour.'
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    aiLimiter
};
