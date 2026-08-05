/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string
 * @returns {string} - Formatted date
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    
    const map = {
        'YYYY': d.getFullYear(),
        'YY': String(d.getFullYear()).slice(-2),
        'MM': String(d.getMonth() + 1).padStart(2, '0'),
        'M': d.getMonth() + 1,
        'DD': String(d.getDate()).padStart(2, '0'),
        'D': d.getDate(),
        'HH': String(d.getHours()).padStart(2, '0'),
        'H': d.getHours(),
        'hh': String(d.getHours() % 12 || 12).padStart(2, '0'),
        'h': d.getHours() % 12 || 12,
        'mm': String(d.getMinutes()).padStart(2, '0'),
        'm': d.getMinutes(),
        'ss': String(d.getSeconds()).padStart(2, '0'),
        's': d.getSeconds(),
        'A': d.getHours() >= 12 ? 'PM' : 'AM',
        'a': d.getHours() >= 12 ? 'pm' : 'am',
        'MMM': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()],
        'MMMM': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()],
        'ddd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        'dddd': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
    };
    
    return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a|dddd|ddd/g, (match) => map[match]);
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale
 * @returns {string} - Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Format number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(number);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone number
 */
export const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
        return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
};

/**
 * Format time ago
 * @param {Date|string} date - Date to format
 * @returns {string} - Time ago string
 */
export const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    if (diff < 2419200) return `${Math.floor(diff / 604800)}w ago`;
    if (diff < 29030400) return `${Math.floor(diff / 2419200)}mo ago`;
    return `${Math.floor(diff / 29030400)}y ago`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncate = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format name
 * @param {string} name - Name to format
 * @returns {string} - Formatted name
 */
export const formatName = (name) => {
    if (!name) return '';
    return name.trim().replace(/\s+/g, ' ');
};

/**
 * Get initials
 * @param {string} name - Name to get initials from
 * @param {number} maxInitials - Maximum number of initials
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
 * Get random color from text
 * @param {string} text - Text to generate color from
 * @returns {string} - Color hex
 */
export const getColorFromText = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(Math.abs((hash % 16777215)));
    return '#' + color.toString(16).padStart(6, '0');
};

/**
 * Pluralize word
 * @param {string} word - Word to pluralize
 * @param {number} count - Count
 * @returns {string} - Pluralized word
 */
export const pluralize = (word, count) => {
    if (count === 1) return word;
    return word + 's';
};

/**
 * Slugify text
 * @param {string} text - Text to slugify
 * @returns {string} - Slugified text
 */
export const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
};

/**
 * Extract initials from email
 * @param {string} email - Email address
 * @returns {string} - Initials
 */
export const getInitialsFromEmail = (email) => {
    if (!email) return '';
    const name = email.split('@')[0];
    return getInitials(name);
};

/**
 * Get status color
 * @param {string} status - Status string
 * @returns {string} - Color class
 */
export const getStatusColor = (status) => {
    const colors = {
        'reported': 'blue',
        'under review': 'yellow',
        'in progress': 'orange',
        'resolved': 'green',
        'closed': 'gray',
        'draft': 'gray'
    };
    return colors[status?.toLowerCase()] || 'blue';
};

/**
 * Get severity color
 * @param {string} severity - Severity level
 * @returns {string} - Color class
 */
export const getSeverityColor = (severity) => {
    const colors = {
        'low': 'green',
        'medium': 'yellow',
        'high': 'orange',
        'critical': 'red'
    };
    return colors[severity?.toLowerCase()] || 'blue';
};
