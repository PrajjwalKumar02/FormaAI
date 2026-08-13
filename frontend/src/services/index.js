export { default as api } from './api';
export { authService } from './authService';
export { aiService } from './aiService';
export { incidentService } from './incidentService';
export { formService } from './formService';

// Default export
import * as authService from './authService';
import * as aiService from './aiService';
import * as incidentService from './incidentService';
import * as formService from './formService';

export default {
    auth: authService,
    ai: aiService,
    incidents: incidentService,
    forms: formService
};
