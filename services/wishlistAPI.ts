import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL from env or fallback
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.1.184:8000/api/test/v1/';

interface WishlistItem {
  id: string;
  property_id: string;
  property_type: string;
  // other fields you expect
}

// Use the correct base URL for wishlist API
const wishlistAPI = axios.create({
  baseURL: `${BASE_URL}wishlist/`,  // <== wishlist endpoint base
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization token
wishlistAPI.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    // console.log('Sending token:', token); // <== DEBUG LOG
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export const wishlistService = {
  // Get all wishlist items for user
  getWishlist: async (): Promise<WishlistItem[]> => {
    try {
      const response = await wishlistAPI.get('/');
      return response.data; // assuming the backend returns a list
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  // Toggle wishlist item (add if not present, remove if present)
  toggleWishlistItem: async (propertyId: string, propertyType: string): Promise<{ detail: string }> => {
    try {
      const response = await wishlistAPI.post('toggle/', {
        property_id: propertyId,
        property_type: propertyType,
      });
      return response.data; // { detail: "Added to wishlist." } or { detail: "Removed from wishlist." }
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw error;
    }
  },

  // Remove a wishlist item by wishlist item ID (optional if needed)
  removeFromWishlist: async (wishlistItemId: string): Promise<void> => {
    try {
      await wishlistAPI.delete(`${wishlistItemId}/`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  // Check if a property is in wishlist by fetching all and searching
  isInWishlist: async (propertyId: string): Promise<boolean> => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.some(item => item.property_id === propertyId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },
};
