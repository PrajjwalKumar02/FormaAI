/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid, errors }
 */
export const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @returns {boolean} - True if value exists
 */
export const isRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    return value !== null && value !== undefined;
};

/**
 * Validate min length
 * @param {string} value - Value to check
 * @param {number} min - Minimum length
 * @returns {boolean} - True if valid
 */
export const minLength = (value, min) => {
    return String(value).length >= min;
};

/**
 * Validate max length
 * @param {string} value - Value to check
 * @param {number} max - Maximum length
 * @returns {boolean} - True if valid
 */
export const maxLength = (value, max) => {
    return String(value).length <= max;
};

/**
 * Validate number range
 * @param {number} value - Value to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if valid
 */
export const isInRange = (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validate date
 * @param {string} date - Date to validate
 * @returns {boolean} - True if valid
 */
export const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} - True if valid
 */
export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} - True if valid
 */
export const isValidFileSize = (file, maxSize) => {
    return file.size <= maxSize;
};

/**
 * Create form validation rules
 * @param {Object} rules - Validation rules
 * @returns {Function} - Validation function
 */
export const createValidator = (rules) => {
    return (values) => {
        const errors = {};
        
        Object.keys(rules).forEach((field) => {
            const value = values[field];
            const fieldRules = rules[field];
            
            if (fieldRules.required && !isRequired(value)) {
                errors[field] = `${field} is required`;
                return;
            }
            
            if (fieldRules.minLength && !minLength(value, fieldRules.minLength)) {
                errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
            }
            
            if (fieldRules.maxLength && !maxLength(value, fieldRules.maxLength)) {
                errors[field] = `${field} must be at most ${fieldRules.maxLength} characters`;
            }
            
            if (fieldRules.email && !isValidEmail(value)) {
                errors[field] = 'Please enter a valid email';
            }
            
            if (fieldRules.phone && !isValidPhone(value)) {
                errors[field] = 'Please enter a valid phone number';
            }
            
            if (fieldRules.url && !isValidURL(value)) {
                errors[field] = 'Please enter a valid URL';
            }
            
            if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
                errors[field] = fieldRules.message || 'Invalid format';
            }
        });
        
        return errors;
    };
};

/**
 * Sanitize input string
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};