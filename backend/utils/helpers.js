const crypto = require('crypto');

// Generate random token
const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Format date
const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

// Format date with time
const formatDateTime = (date) => {
    return new Date(date).toISOString().replace('T', ' ').slice(0, 19);
};

// Check if object is empty
const isEmpty = (obj) => {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
};

// Safe JSON parse
const safeJsonParse = (str, fallback = null) => {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

// Generate reference number
const generateReference = (prefix = 'FRM') => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

module.exports = {
    generateToken,
    formatDate,
    formatDateTime,
    isEmpty,
    safeJsonParse,
    generateReference
};
