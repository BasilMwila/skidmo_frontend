// @/services/userHelpers.ts
import { ownerAPI } from '@/services/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchCurrentUser = async (forceRefresh = false) => {
  try {
    // First try to get cached user data if not forcing refresh
    if (!forceRefresh) {
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) return JSON.parse(cachedUser);
    }

    // Check authentication
    const authenticated = await ownerAPI.isAuthenticated();
    if (!authenticated) return null;
    
    // Fetch fresh user data using getUserInfo (without userId to get current user)
    const freshUserData = await ownerAPI.getUserInfo();
    
    // Cache the fresh data
    await AsyncStorage.setItem('user', JSON.stringify(freshUserData));
    
    return freshUserData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

export const clearUserCache = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear user cache:', error);
  }
};