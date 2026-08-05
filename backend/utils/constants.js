module.exports = {
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin',
        MODERATOR: 'moderator'
    },
    
    INCIDENT_TYPES: [
        'Accident', 'Fire Incident', 'Theft', 'Injury',
        'Property Damage', 'Natural Disaster', 'Harassment',
        'General Incident', 'Car Theft', 'Cyber Fraud'
    ],
    
    SEVERITY_LEVELS: ['Low', 'Medium', 'High', 'Critical'],
    
    INCIDENT_STATUSES: ['Reported', 'Under Review', 'In Progress', 'Resolved', 'Closed'],
    
    FORM_STATUSES: ['Draft', 'Pending', 'Completed', 'Archived'],
    
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500
    }
};
