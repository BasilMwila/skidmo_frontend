import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://skidmo-core-system.onrender.com/api/test/v1/';

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Type definitions
interface Property {
    id: number;
    title: string;
    description: string;
    address: string;
    images: string[] | null;
    price: string;
    rating: number;
    number_of_bedrooms: number;
    number_of_bathrooms: number;
    property_type: string; // e.g., 'apartment', 'house'
    purchase_type: 'rent' | 'buy';
    hasOnlineTour: boolean;
    features: string[];
    lister?: { // Optional if not always included in listing
      id: number;
      email: string;
    };
  }

interface ReservationParams {
  user?: number;
  property?: number;
  status?: string;
  start_date__gte?: string;
  end_date__lte?: string;
  [key: string]: any;
}

export const reservationsAPI = {
  /**
   * Create a new reservation
   */
  create: async (reservationData: Omit<Reservation, 'id' | 'created_at' | 'updated_at'>): Promise<Reservation> => {
    try {
      const response = await api.post('reservations/', reservationData);
      return response.data;
    } catch (error: any) {
      console.error('Create reservation error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get all reservations with optional filters
   */
  getAll: async (params?: ReservationParams): Promise<Reservation[]> => {
    try {
      const response = await api.get('reservations/', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get reservations error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get a specific reservation by ID
   */
  getById: async (reservationId: number): Promise<Reservation> => {
    try {
      const response = await api.get(`reservations/${reservationId}/`);
      return response.data;
    } catch (error: any) {
      console.error('Get reservation error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update a reservation
   */
  update: async (
    reservationId: number,
    updateData: Partial<Reservation>
  ): Promise<Reservation> => {
    try {
      const response = await api.patch(`reservations/${reservationId}/`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Update reservation error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete a reservation
   */
  delete: async (reservationId: number): Promise<void> => {
    try {
      await api.delete(`reservations/${reservationId}/`);
    } catch (error: any) {
      console.error('Delete reservation error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get reservations for the current user
   */
  getMyReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await api.get('reservations/my_reservations/');
      return response.data;
    } catch (error: any) {
      console.error('Get my reservations error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get reservations for properties owned by the current user
   */
  getReservationsForMyProperties: async (): Promise<Reservation[]> => {
    try {
      const response = await api.get('reservations/my_properties_reservations/');
      return response.data;
    } catch (error: any) {
      console.error('Get reservations for my properties error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Check property availability between dates
   */
  checkAvailability: async (
    propertyId: number,
    startDate: string,
    endDate: string
  ): Promise<{ available: boolean; conflicting_reservations?: Reservation[] }> => {
    try {
      const response = await api.get('reservations/check_availability/', {
        params: {
          property: propertyId,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Check availability error:', error.response?.data || error.message);
      throw error;
    }
  }
};