/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @returns {Promise<Object>} - Parsed response
 */
export const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const error = await response.json();
            errorMessage = error.message || error.error || errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

/**
 * Handle API error
 * @param {Error} error - Error object
 * @returns {Object} - Formatted error
 */
export const handleApiError = (error) => {
    const message = error.message || 'An unknown error occurred';
    console.error('API Error:', message);
    
    return {
        success: false,
        message,
        error
    };
};

/**
 * Create API request with timeout
 * @param {string} url - API URL
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
};

/**
 * Create API request with retry
 * @param {Function} requestFn - Request function
 * @param {number} maxRetries - Maximum retries
 * @param {number} delay - Delay between retries
 * @returns {Promise} - Response
 */
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
            }
        }
    }
    throw lastError;
};

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
    const filtered = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => [key, encodeURIComponent(value)]);
    return filtered.length > 0 ? `?${new URLSearchParams(Object.fromEntries(filtered))}` : '';
};

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {Object} - Query parameters
 */
export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    return Object.fromEntries(params.entries());
};
