/**
 * Global error handler with multiple output options
 * @param {Error|string} error - Error object or message
 * @param {Object} options - Configuration options
 * @param {boolean} options.showToast - Show toast notification (default: true)
 * @param {boolean} options.logToConsole - Log to console (default: true)
 * @param {Function} options.onError - Callback function
 * @param {Function} options.toast - Toast function (if showToast is true)
 * @param {string} options.context - Additional context for error
 * @returns {Object} - { success: false, message, error }
 * 
 * @example
 * try {
 *   // Some code
 * } catch (error) {
 *   handleError(error, {
 *     context: 'UserLogin',
 *     onError: () => navigate('/error')
 *   });
 * }
 */
export const handleError = (error, options = {}) => {
    const {
        showToast = true,
        logToConsole = true,
        onError = null,
        toast = null,
        context = ''
    } = options;

    // Extract meaningful error message
    let message = 'An unexpected error occurred';
    let errorObject = error;

    if (typeof error === 'string') {
        message = error;
        errorObject = new Error(error);
    } else if (error instanceof Error) {
        message = error.message || message;
        errorObject = error;
    } else if (error?.response?.data?.message) {
        message = error.response.data.message;
    } else if (error?.message) {
        message = error.message;
    }

    // Log to console with context
    if (logToConsole) {
        const logPrefix = context ? `[${context}] ` : '';
        console.error(`${logPrefix}Error:`, message);
        if (errorObject?.stack) {
            console.error(`${logPrefix}Stack:`, errorObject.stack);
        }
        if (errorObject?.response) {
            console.error(`${logPrefix}Response:`, errorObject.response);
        }
    }

    // Show toast notification
    if (showToast && toast && typeof toast === 'function') {
        toast(message);
    }

    // Execute callback
    if (onError && typeof onError === 'function') {
        onError(errorObject);
    }

    return {
        success: false,
        message,
        error: errorObject,
        context
    };
};

/**
 * Format error message for display
 * @param {Error|string|Object} error - Error to format
 * @param {string} defaultMessage - Default message if error is empty
 * @returns {string} - Formatted error message
 * 
 * @example
 * const message = formatErrorMessage(error, 'Something went wrong');
 */
export const formatErrorMessage = (error, defaultMessage = 'An error occurred') => {
    if (!error) return defaultMessage;
    
    if (typeof error === 'string') return error;
    
    if (error instanceof Error) {
        return error.message || defaultMessage;
    }
    
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    
    if (error?.message) {
        return error.message;
    }
    
    return defaultMessage;
};

/**
 * API Error class for consistent API error handling
 * @class ApiError
 * @extends Error
 * 
 * @example
 * throw new ApiError('User not found', 404);
 */
export class ApiError extends Error {
    constructor(message, statusCode = 500, data = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.data = data;
        this.timestamp = new Date().toISOString();
        
        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    /**
     * Check if error is of type ApiError
     * @param {any} error - Error to check
     * @returns {boolean} - True if ApiError
     */
    static isApiError(error) {
        return error instanceof ApiError;
    }

    /**
     * Create ApiError from axios error
     * @param {Object} axiosError - Axios error object
     * @returns {ApiError} - ApiError instance
     */
    static fromAxiosError(axiosError) {
        const status = axiosError.response?.status || 500;
        const message = axiosError.response?.data?.message || 
                       axiosError.message || 
                       'API request failed';
        const data = axiosError.response?.data || null;
        return new ApiError(message, status, data);
    }
}

/**
 * Validation Error class for form validation
 * @class ValidationError
 * @extends Error
 * 
 * @example
 * throw new ValidationError({ email: 'Invalid email', password: 'Too short' });
 */
export class ValidationError extends Error {
    constructor(errors, message = 'Validation failed') {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors || {};
        this.timestamp = new Date().toISOString();
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }

    /**
     * Get all error messages as array
     * @returns {string[]} - Array of error messages
     */
    getMessages() {
        return Object.values(this.errors).filter(Boolean);
    }

    /**
     * Get first error message
     * @returns {string} - First error message
     */
    getFirstMessage() {
        const messages = this.getMessages();
        return messages.length > 0 ? messages[0] : this.message;
    }
}

/**
 * Network Error class
 * @class NetworkError
 * @extends Error
 * 
 * @example
 * throw new NetworkError('No internet connection');
 */
export class NetworkError extends Error {
    constructor(message = 'Network connection error') {
        super(message);
        this.name = 'NetworkError';
        this.timestamp = new Date().toISOString();
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NetworkError);
        }
    }
}

/**
 * Auth Error class
 * @class AuthError
 * @extends Error
 * 
 * @example
 * throw new AuthError('Token expired', 401);
 */
export class AuthError extends Error {
    constructor(message = 'Authentication failed', statusCode = 401) {
        super(message);
        this.name = 'AuthError';
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthError);
        }
    }
}

/**
 * Check if error is a network error
 * @param {Error} error - Error to check
 * @returns {boolean} - True if network error
 * 
 * @example
 * if (isNetworkError(error)) {
 *   showOfflineMessage();
 * }
 */
export const isNetworkError = (error) => {
    if (error instanceof NetworkError) return true;
    if (error instanceof ApiError) return false;
    if (error instanceof AuthError) return false;
    if (error instanceof ValidationError) return false;
    
    // Check for axios network errors
    if (error?.code === 'ECONNABORTED') return true;
    if (error?.code === 'ERR_NETWORK') return true;
    if (error?.message?.includes('Network Error')) return true;
    
    return false;
};

/**
 * Check if error is an auth error (401/403)
 * @param {Error} error - Error to check
 * @returns {boolean} - True if auth error
 * 
 * @example
 * if (isAuthError(error)) {
 *   redirectToLogin();
 * }
 */
export const isAuthError = (error) => {
    if (error instanceof AuthError) return true;
    if (error instanceof ApiError && [401, 403].includes(error.statusCode)) return true;
    if (error?.response?.status === 401 || error?.response?.status === 403) return true;
    return false;
};

/**
 * Check if error is a validation error (400/422)
 * @param {Error} error - Error to check
 * @returns {boolean} - True if validation error
 * 
 * @example
 * if (isValidationError(error)) {
 *   setErrors(error.errors);
 * }
 */
export const isValidationError = (error) => {
    if (error instanceof ValidationError) return true;
    if (error instanceof ApiError && [400, 422].includes(error.statusCode)) return true;
    if (error?.response?.status === 400 || error?.response?.status === 422) return true;
    return false;
};

/**
 * Check if error is a server error (500+)
 * @param {Error} error - Error to check
 * @returns {boolean} - True if server error
 * 
 * @example
 * if (isServerError(error)) {
 *   showRetryMessage();
 * }
 */
export const isServerError = (error) => {
    if (error instanceof ApiError && error.statusCode >= 500) return true;
    if (error?.response?.status >= 500) return true;
    return false;
};

/**
 * Check if error is a not found error (404)
 * @param {Error} error - Error to check
 * @returns {boolean} - True if not found error
 * 
 * @example
 * if (isNotFoundError(error)) {
 *   navigate('/404');
 * }
 */
export const isNotFoundError = (error) => {
    if (error instanceof ApiError && error.statusCode === 404) return true;
    if (error?.response?.status === 404) return true;
    return false;
};

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @param {Object} options - Configuration
 * @param {string} options.defaultMessage - Default message
 * @param {boolean} options.showDetails - Show technical details
 * @returns {string} - User-friendly error message
 * 
 * @example
 * const message = getUserFriendlyMessage(error, {
 *   defaultMessage: 'Something went wrong',
 *   showDetails: true
 * });
 */
export const getUserFriendlyMessage = (error, options = {}) => {
    const {
        defaultMessage = 'Something went wrong',
        showDetails = false
    } = options;

    let message = defaultMessage;

    if (isNetworkError(error)) {
        message = 'Unable to connect to the server. Please check your internet connection.';
    } else if (isAuthError(error)) {
        message = 'Your session has expired. Please log in again.';
    } else if (isNotFoundError(error)) {
        message = 'The requested resource was not found.';
    } else if (isValidationError(error)) {
        message = 'Please check your input and try again.';
    } else if (isServerError(error)) {
        message = 'The server encountered an error. Please try again later.';
    } else if (error instanceof ApiError) {
        message = error.message || defaultMessage;
    } else if (error instanceof Error) {
        message = error.message || defaultMessage;
    } else if (typeof error === 'string') {
        message = error;
    }

    // Add technical details if requested
    if (showDetails && error?.stack) {
        message += `\n\nTechnical details: ${error.stack}`;
    }

    return message;
};

/**
 * Create error boundary for React components
 * @param {React.Component} Component - React component to wrap
 * @param {Function} fallback - Fallback component or function
 * @returns {React.Component} - Error boundary wrapped component
 * 
 * @example
 * const SafeComponent = withErrorBoundary(MyComponent, () => <ErrorFallback />);
 */
export const withErrorBoundary = (Component, fallback) => {
    // This is a HOC that wraps components with error handling
    // The actual ErrorBoundary class component is below
    return class ErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true, error };
        }

        componentDidCatch(error, errorInfo) {
            console.error('ErrorBoundary caught:', error, errorInfo);
            handleError(error, {
                context: 'ErrorBoundary',
                showToast: true
            });
        }

        render() {
            if (this.state.hasError) {
                if (typeof fallback === 'function') {
                    return fallback(this.state.error);
                }
                // Simple fallback message without JSX
                return React.createElement('div', {
                    style: { 
                        padding: '20px', 
                        textAlign: 'center',
                        color: '#ef4444'
                    }
                }, 'Something went wrong. Please try again.');
            }
            return React.createElement(Component, this.props);
        }
    };
};

/**
 * Create error handler for async functions
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Configuration options
 * @param {Function} options.onError - Error callback
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.finally - Finally callback
 * @returns {Function} - Wrapped function
 * 
 * @example
 * const safeFetch = wrapAsyncErrorHandler(
 *   async () => {
 *     const data = await fetchData();
 *     return data;
 *   },
 *   {
 *     onError: (error) => setError(error.message),
 *     onSuccess: (data) => setData(data)
 *   }
 * );
 */
export const wrapAsyncErrorHandler = (asyncFn, options = {}) => {
    const {
        onError = null,
        onSuccess = null,
        finally: finallyFn = null
    } = options;

    return async (...args) => {
        try {
            const result = await asyncFn(...args);
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(result);
            }
            return result;
        } catch (error) {
            const formattedError = handleError(error, {
                showToast: true,
                onError: onError || undefined
            });
            throw formattedError;
        } finally {
            if (finallyFn && typeof finallyFn === 'function') {
                finallyFn();
            }
        }
    };
};

/**
 * Get error status code
 * @param {Error} error - Error object
 * @returns {number} - Status code
 * 
 * @example
 * const status = getErrorStatusCode(error);
 */
export const getErrorStatusCode = (error) => {
    if (error instanceof ApiError) return error.statusCode;
    if (error instanceof AuthError) return error.statusCode;
    if (error?.response?.status) return error.response.status;
    if (error?.statusCode) return error.statusCode;
    return 500;
};

/**
 * Log error to server/analytics
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context
 * 
 * @example
 * logErrorToServer(error, { userId: '123', page: 'dashboard' });
 */
export const logErrorToServer = (error, context = {}) => {
    try {
        const errorLog = {
            message: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...context
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Error log:', errorLog);
        }

        // Send to server in production
        if (process.env.NODE_ENV === 'production') {
            // Uncomment when you have a logging endpoint
            // fetch('/api/logs/error', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(errorLog)
            // }).catch(console.error);
        }
    } catch (logError) {
        console.error('Failed to log error:', logError);
    }
};

// Export all
export default {
    handleError,
    formatErrorMessage,
    ApiError,
    ValidationError,
    NetworkError,
    AuthError,
    isNetworkError,
    isAuthError,
    isValidationError,
    isServerError,
    isNotFoundError,
    getUserFriendlyMessage,
    withErrorBoundary,
    wrapAsyncErrorHandler,
    getErrorStatusCode,
    logErrorToServer
};
