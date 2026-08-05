// Export all services
export { default as api } from './api';
export { authService } from './authService';
export { incidentService } from './incidentService';
export { formService } from './formService';
export { aiService } from './aiService';
export { uploadService } from './uploadService';

// Default export for convenience
import api from './api';
import { authService } from './authService';
import { incidentService } from './incidentService';
import { formService } from './formService';
import { aiService } from './aiService';
import { uploadService } from './uploadService';

const services = {
    api,
    auth: authService,
    incidents: incidentService,
    forms: formService,
    ai: aiService,
    upload: uploadService
};

export default services;
