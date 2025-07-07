import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://skidmo-core-system.onrender.com/api/test/v1/';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    // Add other product fields as needed
  };
  // Add other wishlist fields as needed
}

const wishlistAPI = axios.create({
  baseURL: `${BASE_URL}reservations/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject the token
wishlistAPI.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const wishlistService = {

  getWishlist: async (): Promise<WishlistItem[]> => {
    try {
      const response = await wishlistAPI.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },

  /**
   * Add an item to the wishlist
   * @param productId - ID of the product to add
   */
  addToWishlist: async (productId: string): Promise<WishlistItem> => {
    try {
      const response = await wishlistAPI.post('/', { product: productId });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  /**
   * Remove an item from the wishlist
   * @param wishlistItemId - ID of the wishlist item to remove
   */
  removeFromWishlist: async (wishlistItemId: string): Promise<void> => {
    try {
      await wishlistAPI.delete(`/${wishlistItemId}/`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  /**
   * Check if a product is in the user's wishlist
   * @param productId - ID of the product to check
   */
  isInWishlist: async (productId: string): Promise<boolean> => {
    try {
      const wishlist = await wishlistService.getWishlist();
      return wishlist.some(item => item.product.id === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  },
};