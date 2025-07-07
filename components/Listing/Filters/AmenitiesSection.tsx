import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SectionHeader from './UI/SectionHeader';

interface Amenity {
  id: string;
  name: string;
  category: string;
}

interface AmenitiesSectionProps {
  selectedAmenities: Record<string, string[]>;
  onToggleAmenity: (category: string, item: string) => void;
  amenities: Amenity[];
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ 
  selectedAmenities, 
  onToggleAmenity,
  amenities
}) => {
  // Group amenities by category
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  return (
    <View style={styles.section}>
      <SectionHeader title="Amenities" />
      
      {Object.entries(groupedAmenities).map(([category, items]) => (
        <View key={category} style={styles.amenityCategory}>
          <Text style={styles.amenityCategoryTitle}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
          <View style={styles.tagsContainer}>
            {items.map((item) => {
              const isSelected = selectedAmenities[category]?.includes(item.id);
              
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.amenityTag, isSelected && styles.selectedAmenityTag]}
                  onPress={() => onToggleAmenity(category, item.id)}
                >
                  <Text style={[styles.amenityTagText, isSelected && styles.selectedAmenityTagText]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  amenityCategory: {
    marginBottom: 16,
  },
  amenityCategoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  amenityTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  selectedAmenityTag: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  amenityTagText: {
    fontSize: 14,
    color: '#333',
  },
  selectedAmenityTagText: {
    color: '#fff',
  },
});

export default AmenitiesSection;