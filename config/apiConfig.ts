

// Create a new file: config/apiConfig.ts
export const API_CONFIG = {
  // Use environment variable with fallback to your local IP
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://192.168.0.184:8000/api/test/v1/",
  
  // Timeout settings
  TIMEOUT: 60000, // 60 seconds for file uploads
  
  // Endpoints
  ENDPOINTS: {
    USERS: 'users/',
    PROPERTIES: 'properties/',
    MESSAGING: 'messaging/',
    RESERVATIONS: 'reservations/',
    WISHLIST: 'wishlist/',
  }
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to validate if we're using local development
export const isLocalDevelopment = (): boolean => {
  return API_CONFIG.BASE_URL.includes('192.168.0.184') || 
         API_CONFIG.BASE_URL.includes('localhost') || 
         API_CONFIG.BASE_URL.includes('127.0.0.1');
};