import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { API_CONFIG } from '../config/apiConfig';

// Then replace the hardcoded BASE_URL with:
const BASE_URL = API_CONFIG.BASE_URL;

export interface User {
  id: number | string
  name: string
  email: string
  phone_number: string
  profileImage?: string
  status_verification: "verified" | "unverified" | "pending"
  is_agent?: boolean
  created_at?: string
  updated_at?: string
}

export interface UserProfile extends User {
  bio?: string
  location?: string
  rating?: number
  total_properties?: number
  verified_documents?: string[]
}

export interface CreateUserData {
  name: string
  email: string
  phone_number: string
  password: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  phone_number?: string
  profileImage?: string
}

interface UserData {
  name: string
  phone_number: string
  password: string
  password2: string
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    let token = (global as any).access_token
    if (!token) {
      token = await AsyncStorage.getItem("access_token")
      if (token) {
        ;(global as any).access_token = token
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = await AsyncStorage.getItem("refresh_token")
        if (!refreshToken) {
          console.log("No refresh token available, redirecting to login")
          return Promise.reject(new Error("Authentication required"))
        }

        // Try to refresh the token
        const response = await api.post("users/refresh/", { refresh: refreshToken })

        if (response.data.access) {
          await storeTokens(response.data.access, refreshToken)
          ;(global as any).access_token = response.data.access

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        // Clear tokens and redirect to login
        await AsyncStorage.multiRemove(["access_token", "refresh_token", "user_id", "is_verified"])
        ;(global as any).access_token = null
        return Promise.reject(new Error("Session expired"))
      }
    }

    return Promise.reject(error)
  },
)

export const ownerAPI = {
    // Authentication methods
     login: async (phone_number: string, password: string) => {
        const response = await api.post('users/login/', { phone_number, password });
        
        // Store tokens after successful login
        if (response.data.access && response.data.refresh) {
            await storeTokens(response.data.access, response.data.refresh);
            (global as any).access_token = response.data.access;
            
            // Add this line to store current user ID
            const decodedToken: any = jwtDecode(response.data.access);
            await AsyncStorage.setItem('current_user_id', decodedToken.user_id.toString());
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

    getAllUsers: async () => {
    try {
      const response = await api.get('users/');
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
    
    getUserInfo: async (userId?: string) => {
        // If userId is provided, get specific user, otherwise get current user
        const endpoint = userId ? `users/${userId}/retrieve/` : 'users/me/'; // Adjust based on your API
        try {
            const response = await api.post(endpoint); // Use POST request as per backend configuration
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
    const decodedToken: any = jwtDecode(accessToken)
    console.log("Decoded Token:", decodedToken)

    const userId = decodedToken.user_id
    const isVerified = decodedToken.status_verification === "verified"

    if (userId === undefined || decodedToken.status_verification === undefined) {
      throw new Error("User ID or verification status not found in token")
    }

    // Store tokens, user ID, and verification status securely
    await AsyncStorage.setItem("access_token", accessToken)
    await AsyncStorage.setItem("refresh_token", refreshToken)
    await AsyncStorage.setItem("user_id", userId.toString())
    await AsyncStorage.setItem("is_verified", isVerified.toString())

    return true
  } catch (error) {
    console.error("Error storing tokens:", error)
    return false
  }
}

// Legacy exports for backward compatibility
export const userAPI = ownerAPI
export const userService = ownerAPI
