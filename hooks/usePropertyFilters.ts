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

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Get current user ID
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) throw new Error('User not authenticated');
        
        // Fetch all necessary data in parallel
        const [types, amenitiesData] = await Promise.all([
          propertiesAPI.hotels.create({
              // Provide the required fields for LodgeHotelProperty except 'id'
              // name: 'Default Hotel Name', // Removed as it is not part of the expected type
              address: 'Default Address',
              property_type: 'LODGE_HOTEL',
              purpose: 'RENT',
              heating: false,
              security: false,
              has_balcony: false,
              has_patio: false,
              term_category: 'LONG',
              price_negotiable: false,
              title: '',
              description: '',
              pet_friendly: false,
              allow_smoking: false,
              allow_kids: false,
              is_agent: false,
              room_count: 0,
              has_pool: false,
              room_type: 'SINGLE',
              bed_type: 'SINGLE',
              view_type: 'SEA',
              owner: 0,
              bidet: false,
              bath: false,
              outdoor_shower: false,
              hot_water: false,
              hair_dryer: false,
              shower_gel: false,
              shampoo: false,
              conditioner: false,
              essentials: false,
              washing_machine: false,
              drying_rack: false,
              clothes_storage: false,
              free_dryer: false,
              iron: false,
              hangers: false,
              bed_linen: false,
              cot: false,
              room_darkening_blinds: false,
              travel_cot: false,
              extra_pillows: false,
              mosquito_net: false,
              microwave: false,
              fridge: false,
              cooking_basics: false,
              dishes: false,
              dishwasher: false,
              oven: false,
              kettle: false,
              coffee_maker: false,
              toaster: false,
              blender: false,
              dining_table: false,
              electric_cooker: false,
              tv: false,
              wifi: false,
              air_conditioner: false,
              ceiling_fan: false,
              portable_fans: false,
              smoke_alarm: false,
              carbon_monoxide_alarm: false,
              first_aid_kit: false,
              luggage_dropoff: false,
              lockbox: false,
              beach_essentials: false,
              self_checkin: false,
              spa: false,
              parking: false,
              fitness_center: false,
              bar: false,
              restaurant: false,
              kids_play_area: false,
              wheelchair_access: false,
              meeting_rooms: false,
              business_center: false,
              coworking_space: false,
              wheelchair: false,
              elevators: false
          }),
          propertiesAPI.hotels.list() // Adjust based on your actual amenities endpoint
        ]);
        
        setPropertyTypes(types);
        setAmenities(amenitiesData);
        
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
      // Add other combined data as needed
    };
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
    handleFilterChange,
    toggleAmenity,
    prepareListingData,
  };
};