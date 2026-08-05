// frontend/src/utils/helpers.js

/**
 * Debounce function - limits how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Throttle function - ensures function is called at most once per time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 1000) => {
    let inThrottle;
    let lastResult;
    return (...args) => {
        if (!inThrottle) {
            lastResult = func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
        return lastResult;
    };
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(deepClone);
    if (obj instanceof File) return obj;
    if (obj instanceof Blob) return obj;
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
};

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} - Merged object
 */
export const deepMerge = (target, source) => {
    if (!target || typeof target !== 'object') return source;
    if (!source || typeof source !== 'object') return target;
    
    const output = { ...target };
    Object.keys(source).forEach((key) => {
        if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
            output[key] = deepMerge(target[key], source[key]);
        } else {
            output[key] = source[key];
        }
    });
    return output;
};

/**
 * Generate unique ID
 * @param {number} length - Length of ID (default: 8)
 * @param {string} prefix - Prefix for ID
 * @returns {string} - Unique ID
 */
export const generateId = (length = 8, prefix = '') => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + id;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + suffix;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum number of initials (default: 2)
 * @returns {string} - Initials
 */
export const getInitials = (name, maxInitials = 2) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, maxInitials);
};

/**
 * Get color from string (for avatar background)
 * @param {string} str - String to hash
 * @returns {string} - Color hex
 */
export const stringToColor = (str) => {
    if (!str) return '#6B7280';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981',
        '#14B8A6', '#06B6D4', '#6366F1', '#F472B6', '#F97316', '#84CC16'
    ];
    return colors[Math.abs(hash) % colors.length];
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} - True if empty
 */
export const isEmptyObject = (obj) => {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Pick specific keys from object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object} - New object with picked keys
 */
export const pick = (obj, keys) => {
    if (!obj || typeof obj !== 'object') return {};
    return keys.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
};

/**
 * Omit specific keys from object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to omit
 * @returns {Object} - New object without omitted keys
 */
export const omit = (obj, keys) => {
    if (!obj || typeof obj !== 'object') return {};
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - Filename to save
 */
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch {
            return false;
        }
    }
};

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Decimal places (default: 2)
 * @returns {string} - Human-readable size
 */
export const getFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Parse JSON safely without throwing errors
 * @param {string} jsonString - JSON string to parse
 * @param {any} fallback - Fallback value if parsing fails
 * @returns {any} - Parsed object or fallback
 */
export const safeJsonParse = (jsonString, fallback = null) => {
    if (!jsonString) return fallback;
    try {
        return JSON.parse(jsonString);
    } catch {
        return fallback;
    }
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Check if value is a valid email
 * @param {string} email - Email to check
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if value is a valid phone number
 * @param {string} phone - Phone to check
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
};

/**
 * Check if value is a valid URL
 * @param {string} url - URL to check
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
 * Get current timestamp in different formats
 * @param {string} format - Format: 'unix', 'iso', 'locale'
 * @returns {number|string} - Timestamp
 */
export const getTimestamp = (format = 'unix') => {
    const now = new Date();
    switch (format) {
        case 'unix':
            return Math.floor(now.getTime() / 1000);
        case 'iso':
            return now.toISOString();
        case 'locale':
            return now.toLocaleString();
        default:
            return now.getTime();
    }
};

/**
 * Check if we're in development mode
 * @returns {boolean} - True if in development
 */
export const isDevelopment = () => {
    return process.env.NODE_ENV === 'development';
};

/**
 * Check if we're in production mode
 * @returns {boolean} - True if in production
 */
export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

/**
 * Get environment variable
 * @param {string} key - Environment variable name
 * @param {string} defaultValue - Default value if not found
 * @returns {string} - Environment variable value
 */
export const getEnv = (key, defaultValue = '') => {
    return import.meta.env?.[key] || defaultValue;
};

/**
 * Convert object to FormData
 * @param {Object} obj - Object to convert
 * @returns {FormData} - FormData object
 */
export const objectToFormData = (obj) => {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value !== null && value !== undefined) {
            if (value instanceof File || value instanceof Blob) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach(item => {
                    formData.append(`${key}[]`, item);
                });
            } else {
                formData.append(key, String(value));
            }
        }
    });
    return formData;
};

/**
 * Scroll to top of page smoothly
 * @param {string} behavior - 'smooth' or 'auto'
 */
export const scrollToTop = (behavior = 'smooth') => {
    window.scrollTo({
        top: 0,
        behavior
    });
};

/**
 * Get URL parameters as object
 * @returns {Object} - URL parameters
 */
export const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
};

/**
 * Set URL parameters without reload
 * @param {Object} params - Parameters to set
 * @param {string} replace - 'push' or 'replace'
 */
export const setUrlParams = (params, method = 'push') => {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    if (method === 'push') {
        window.history.pushState({}, '', url);
    } else {
        window.history.replaceState({}, '', url);
    }
};

/**
 * Get incident statistics from incidents array
 * @param {Array} incidents - Array of incidents
 * @returns {Object} - Statistics object
 */
export const getIncidentStats = (incidents) => {
    if (!incidents || incidents.length === 0) {
        return {
            total: 0,
            pending: 0,
            inProgress: 0,
            resolved: 0,
            critical: 0,
            resolutionRate: 0
        };
    }

    const total = incidents.length;
    const pending = incidents.filter(i => i.status === 'Reported' || i.status === 'Under Review').length;
    const inProgress = incidents.filter(i => i.status === 'In Progress').length;
    const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    const critical = incidents.filter(i => i.severity === 'Critical').length;
    
    return {
        total,
        pending,
        inProgress,
        resolved,
        critical,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
    };
};

// Export all
export default {
    debounce,
    throttle,
    deepClone,
    deepMerge,
    generateId,
    truncateText,
    getInitials,
    stringToColor,
    isEmptyObject,
    pick,
    omit,
    fileToBase64,
    downloadFile,
    copyToClipboard,
    getFileExtension,
    getFileSize,
    safeJsonParse,
    sleep,
    isValidEmail,
    isValidPhone,
    isValidURL,
    getTimestamp,
    isDevelopment,
    isProduction,
    getEnv,
    objectToFormData,
    scrollToTop,
    getUrlParams,
    setUrlParams,
    getIncidentStats
};
