import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://skidmo-core-system.onrender.com/api/test/v1/';

interface RefreshTokenResponse {
    access: string;
}

interface UserData {
    id?: string;
    phone_number: string;
    name: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profileImage?: string;
    date_of_birth?: string;
    nrc_number?: string;
    province?: string;
    town?: string;
    city?: string;
    postal_code?: string;
    address_line_1?: string;
    address_line_2?: string;
    status_verification?: string // Add this line
}

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        // Try to get token from global or AsyncStorage
        let token = (global as any).access_token;
        
        if (!token) {
            token = await AsyncStorage.getItem('access_token');
            if (token) {
                (global as any).access_token = token;
            }
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // Instead of throwing an error, you might want to redirect to login
                    console.log('No refresh token available, redirecting to login');
                    // You could use a global event system or navigation reference here
                    // For example: EventEmitter.emit('SESSION_EXPIRED');
                    return Promise.reject(new Error('Authentication required'));
                }

                // Rest of your refresh token logic...
            } catch (refreshError) {
                // ...
            }
        }

        return Promise.reject(error);
    }
);
export const ownerAPI = {
    // Authentication methods
    login: async (phone_number: string, password: string) => {
        const response = await api.post('users/login/', { phone_number, password });
        
        // Store tokens after successful login
        if (response.data.access && response.data.refresh) {
            await storeTokens(response.data.access, response.data.refresh);
            (global as any).access_token = response.data.access;
        }
        
        
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await api.post('users/refresh/', { refresh: refreshToken });
        return response.data;
    },
    
    isAuthenticated: async () => {
        const token = await AsyncStorage.getItem('access_token');
        return !!token;
    },
    
    // logout: async () => {
    //     await AsyncStorage.removeItem('access_token');
    //     await AsyncStorage.removeItem('refresh_token');
    //     (global as any).access_token = null;
    // },
    
    // User management methods
    register: async (userData: {
        name: string;
        phone_number: string;
        password: string;
        password2: string;
    }) => {
        const response = await api.post('users/create/', userData);
        return response.data;
    },
    
    getUserInfo: async (userId?: string) => {
        // If userId is provided, get specific user, otherwise get current user
        const endpoint = userId ? `users/${userId}/retrieve/` : 'users/me/'; // Adjust based on your API
        try {
            const response = await api.post(endpoint); // Use GET request
            return response.data;
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    },

    updateUserInfo: async (userData: Partial<UserData>, userId?: string) => {
        const endpoint = userId ? `users/${userId}/update/` : 'users/me/';
        try {
            console.log('Updating user with data:', userData); // Log the payload
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }
    
            const response = await api.patch(endpoint, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            console.log('Update successful:', response.data); // Log the response
            return response.data;
        } catch (error) {
            console.error('Error updating user info:', error);
            if (error.response) {
                console.error('Backend response error:', error.response.data);
            }
            throw error;
        }
    },
    
    deleteUser: async () => {
        // Delete the current user's account
        const response = await api.delete('users/retrieve/');
        
        // Clear tokens after account deletion
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        (global as any).access_token = null;
        
        return response.data;
    },
    
    // Profile image upload
    uploadProfileImage: async (imageUri: string) => {
        // Create form data for image upload
        const formData = new FormData();
        
        // Get filename from URI
        const uriParts = imageUri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        
        // Append image to form data
        formData.append('profileImage', {
            uri: imageUri,
            name: fileName,
            type: 'image/jpeg', // Adjust based on your image type
        } as any);
        
        // Create custom config for multipart/form-data
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Authorization header will be added by interceptor
            },
        };
        
        const response = await api.post('users/profile-image/', formData, config);
        return response.data;
    },

    logout: async () => {
        try {
            
            // Clear all stored tokens and user data
            await AsyncStorage.multiRemove([
                'access_token',
                'refresh_token',
                'user_id',
                'is_verified'
            ]);
            
            // Clear global token reference
            (global as any).access_token = null;
            
            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            return false;
        }
    },
};

export const storeTokens = async (accessToken: string, refreshToken: string) => {
    try {
        // Decode JWT to get user details
        const decodedToken: any = jwtDecode(accessToken);
        console.log("Decoded Token:", decodedToken); // Debugging output

        const userId = decodedToken.user_id; // Assuming user_id is in the token
        const isVerified = decodedToken.status_verification === "verified"; // Check if status is "verified"

        if (userId === undefined || decodedToken.status_verification === undefined) {
            throw new Error("User ID or verification status not found in token");
        }

        // Store tokens, user ID, and verification status securely
        await AsyncStorage.setItem('access_token', accessToken);
        await AsyncStorage.setItem('refresh_token', refreshToken);
        await AsyncStorage.setItem('user_id', userId.toString()); // Convert number to string before storing
        await AsyncStorage.setItem('is_verified', isVerified.toString()); // Store verification status as boolean string

        return true;
    } catch (error) {
        console.error('Error storing tokens:', error);
        return false;
    }
};


