import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import TypeSection from './Filters/TypeSection';
import AmenitiesSection from './Filters/AmenitiesSection';
import PriceSection from './Filters/PriceSection';
// Import other sections...

interface FilterScreenProps {
  listingType: 'short-term' | 'long-term' | 'hotel';
}

const FilterScreen: React.FC<FilterScreenProps> = ({ listingType }) => {
  const {
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
  } = usePropertyFilters(listingType);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TypeSection 
          selectedType={filters.property_type || 'APARTMENT'}
          onTypeChange={(type) => handleFilterChange('property_type', type)}
          propertyTypes={propertyTypes}
          termCategory={filters.term_category || 'SHORT'}
        />
        
        <PriceSection 
          price={filters.purpose === 'BUY' ? filters.sale_price || 0 : filters.rental_price || 0}
          onPriceChange={(value) => {
            if (filters.purpose === 'BUY') {
              handleFilterChange('sale_price', value);
            } else {
              handleFilterChange('rental_price', value);
            }
          }}
          purpose={filters.purpose || 'RENT'}
          onPurposeChange={(value) => handleFilterChange('purpose', value)}
        />
        
        <AmenitiesSection
          selectedAmenities={selectedAmenities}
          onToggleAmenity={toggleAmenity}
          amenities={amenities}
        />
        
        {/* Add other sections similarly */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
});

export default FilterScreen;