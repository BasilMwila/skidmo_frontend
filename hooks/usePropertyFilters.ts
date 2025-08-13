// hooks/usePropertyFilters.ts
import { useState, useEffect } from 'react';
import { propertiesAPI } from '@/services/propertiesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseProperty } from '@/types'; // Adjust the path based on your project structure

export const usePropertyFilters = (listingType: 'short-term' | 'long-term' | 'hotel') => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Main filter state
  const [filters, setFilters] = useState<Partial<BaseProperty>>({
    term_category: listingType === 'long-term' ? 'LONG' : 'SHORT',
    purpose: 'RENT',
    property_type: 'APARTMENT',
  });
  
  // Options fetched from backend
  const [propertyTypes, setPropertyTypes] = useState<Record<string, string>>({});
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [roomTypes, setRoomTypes] = useState<{value: string, label: string}[]>([]);
  const [bedTypes, setBedTypes] = useState<{value: string, label: string}[]>([]);
  const [viewTypes, setViewTypes] = useState<{value: string, label: string}[]>([]);
  const [mealOptions, setMealOptions] = useState<{value: string, label: string}[]>([]);
  
  // Selected amenities
  const [selectedAmenities, setSelectedAmenities] = useState<Record<string, string[]>>({
    bathroom: [],
    bedroom: [],
    kitchen: [],
    entertainment: [],
    heating: [],
    safety: [],
    other: [],
    accessibility: [],
    security: [],
  });
  
  // Photos and video state
  const [photos, setPhotos] = useState<string[]>([]);
  const [video, setVideo] = useState<string>('');

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Get current user ID
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) throw new Error('User not authenticated');
        
        // Fetch all necessary data in parallel
        const [amenitiesData] = await Promise.all([
          propertiesAPI.hotels.list() // Get amenities and property types
        ]);
        
        // Set property types based on listing type
        if (listingType === 'hotel') {
          setPropertyTypes({ 'LODGE_HOTEL': 'Hotel/Lodge' });
        }
        setAmenities(amenitiesData?.data || amenitiesData);
        
        // Set other options based on your backend structure
        setRoomTypes([
          { value: 'SINGLE', label: 'Single' },
          { value: 'DOUBLE', label: 'Double' },
          // ... other types from backend
        ]);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [listingType]);

  // Handler for filter changes
  const handleFilterChange = <K extends keyof BaseProperty>(field: K, value: BaseProperty[K]) => {
    setFilters((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for amenity toggles
  const toggleAmenity = (category: string, item: string) => {
    setSelectedAmenities(prev => {
      const updated = { ...prev };
      if (updated[category]?.includes(item)) {
        updated[category] = updated[category].filter(i => i !== item);
      } else {
        if (!updated[category]) updated[category] = [];
        updated[category] = [...updated[category], item];
      }
      return updated;
    });
  };

  // Prepare data for submission
  const prepareListingData = () => {
    // Combine all data for API submission
    return {
      ...filters,
      amenities: Object.values(selectedAmenities).flat(),
      photos,
      video,
      // Add other combined data as needed
    };
  };
  
  // Submit property data
  const submitProperty = async () => {
    try {
      const data = prepareListingData();
      
      // Extract photo URIs from photo objects
      const photoUris = photos.map(photo => 
        typeof photo === 'string' ? photo : photo.image || photo
      );
      
      console.log('Photos being sent to API:', photoUris);
      
      if (listingType === 'hotel') {
        return await propertiesAPI.hotels.create(data, photoUris, video);
      }
      // Add other property types as needed
      throw new Error('Property type not supported');
    } catch (error) {
      console.error('Error submitting property:', error);
      throw error;
    }
  };

  return {
    loading,
    error,
    filters,
    propertyTypes,
    amenities,
    roomTypes,
    bedTypes,
    viewTypes,
    mealOptions,
    selectedAmenities,
    photos,
    video,
    handleFilterChange,
    toggleAmenity,
    setPhotos,
    setVideo,
    prepareListingData,
    submitProperty,
  };
};