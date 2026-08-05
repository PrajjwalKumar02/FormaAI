// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me',
        PROFILE: '/auth/profile',
        SETTINGS: '/auth/settings',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        LOGOUT: '/auth/logout'
    },
    INCIDENTS: {
        BASE: '/incidents',
        EXTRACT: '/incidents/extract',
        STATS: '/incidents/stats',
        COMMENTS: (id) => `/incidents/${id}/comments`,
        ATTACHMENTS: (id) => `/incidents/${id}/attachments`
    },
    FORMS: {
        BASE: '/forms',
        SUBMIT: (id) => `/forms/${id}/submit`,
        SUBMISSIONS: (id) => `/forms/${id}/submissions`,
        SCHEMA: (id) => `/forms/${id}/schema`
    },
    AI: {
        EXTRACT: '/ai/extract',
        GENERATE_FORM: '/ai/generate-form',
        ANALYZE: '/ai/analyze',
        PREDICT: '/ai/predict',
        CHAT: '/ai/chat',
        AUTOFILL: '/ai/autofill'
    },
    UPLOAD: {
        BASE: '/upload',
        MULTIPLE: '/upload/multiple',
        PROFILE_IMAGE: '/upload/profile-image'
    }
};

// Incident types
export const INCIDENT_TYPES = [
    { value: 'Accident', label: 'Accident' },
    { value: 'Fire Incident', label: 'Fire Incident' },
    { value: 'Theft', label: 'Theft' },
    { value: 'Injury', label: 'Injury' },
    { value: 'Property Damage', label: 'Property Damage' },
    { value: 'Natural Disaster', label: 'Natural Disaster' },
    { value: 'Harassment', label: 'Harassment' },
    { value: 'General Incident', label: 'General Incident' }
];

// Incident severity levels
export const SEVERITY_LEVELS = [
    { value: 'Low', label: 'Low', color: 'green' },
    { value: 'Medium', label: 'Medium', color: 'yellow' },
    { value: 'High', label: 'High', color: 'orange' },
    { value: 'Critical', label: 'Critical', color: 'red' }
];

// Incident statuses
export const INCIDENT_STATUSES = [
    { value: 'Reported', label: 'Reported' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Draft', label: 'Draft' }
];

// User roles
export const USER_ROLES = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
};

// Notification types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// File upload limits
export const FILE_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Form field types
export const FIELD_TYPES = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DATE: 'date',
    DATETIME: 'datetime-local',
    NUMBER: 'number',
    EMAIL: 'email',
    PHONE: 'phone',
    FILE: 'file',
    ADDRESS: 'address'
};

// Validation messages
export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    EMAIL: 'Please enter a valid email address',
    PHONE: 'Please enter a valid phone number',
    URL: 'Please enter a valid URL',
    MIN_LENGTH: (min) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max) => `Must be at most ${max} characters`,
    PASSWORD: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
    PASSWORD_MISMATCH: 'Passwords do not match',
    INVALID_FILE_TYPE: 'Invalid file type',
    FILE_TOO_LARGE: 'File is too large',
    INVALID_DATE: 'Please enter a valid date',
    INVALID_NUMBER: 'Please enter a valid number',
    INVALID_RANGE: (min, max) => `Value must be between ${min} and ${max}`
};

// Date formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM DD, YYYY',
    DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
    API: 'YYYY-MM-DD',
    API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
    INPUT: 'YYYY-MM-DD',
    INPUT_WITH_TIME: 'YYYY-MM-DDTHH:mm',
    SHORT: 'MM/DD/YYYY',
    SHORT_WITH_TIME: 'MM/DD/YYYY hh:mm A'
};

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// Theme colors (if using theme)
export const THEME_COLORS = {
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#06B6D4',
    background: '#F8FAFC',
    text: '#1E293B',
    border: '#E2E8F0',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    SETTINGS: 'settings',
    THEME: 'theme',
    PROFILE_IMAGE: 'profileImage',
    LAST_VISITED: 'lastVisited'
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    AI_INPUT: '/ai-input',
    DYNAMIC_FORM: '/form',
    REVIEW: '/review',
    SUCCESS: '/success',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    FORMS: '/forms',
    FORM_DETAILS: '/forms/:id',
    INCIDENT_DETAILS: '/incidents/:id',
    ANALYTICS: '/analytics',
    NOT_FOUND: '*'
};

// HTTP status codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
};