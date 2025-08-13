import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import TypeSection from './Filters/TypeSection';
import AmenitiesSection from './Filters/AmenitiesSection';
import PriceSection from './Filters/PriceSection';
import PhotosVideoSection from './Filters/PhotosVideoSection';
import AddressSection from './Filters/AddressSection';
import PropertySection from './Filters/PropertySection';
import TermsSection from './Filters/TermsSection';
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
    photos,
    video,
    handleFilterChange,
    toggleAmenity,
    setPhotos,
    setVideo,
    prepareListingData,
    submitProperty,
  } = usePropertyFilters(listingType);
  
  const handleSubmit = async () => {
    if (photos.length === 0) {
      Alert.alert('Photos Required', 'Please add at least one photo before submitting.');
      return;
    }
    
    try {
      Alert.alert('Submitting...', 'Creating your property listing...');
      const result = await submitProperty();
      Alert.alert('Success!', 'Your property has been listed successfully.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create property listing.');
    }
  };

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
        
        <PropertySection 
          title={filters.title || ''}
          description={filters.description || ''}
          onTitleChange={(value) => handleFilterChange('title', value)}
          onDescriptionChange={(value) => handleFilterChange('description', value)}
        />
        
        <AddressSection 
          address={filters.address || ''}
          onAddressChange={(value) => handleFilterChange('address', value)}
        />
        
        <TermsSection 
          termCategory={filters.term_category || 'SHORT'}
          priceNegotiable={filters.price_negotiable || false}
          onTermCategoryChange={(value) => handleFilterChange('term_category', value)}
          onPriceNegotiableChange={(value) => handleFilterChange('price_negotiable', value)}
        />
        
        <AmenitiesSection
          selectedAmenities={selectedAmenities}
          onToggleAmenity={toggleAmenity}
          amenities={amenities}
        />
        
        <PhotosVideoSection
          onAddPhotos={setPhotos}
          onAddVideo={setVideo}
          photos={photos}
          video={video}
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Property Listing</Text>
        </TouchableOpacity>
        
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
    paddingHorizontal: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 16,
    marginVertical: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterScreen;