import React from 'react';
import { View, StyleSheet } from 'react-native';
import SectionHeader from './UI/SectionHeader';
import Tag from './UI/Tag';

interface TypeSectionProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  propertyTypes: Record<string, string>;
  termCategory: 'SHORT' | 'LONG';
}

const TypeSection: React.FC<TypeSectionProps> = ({ 
  selectedType, 
  onTypeChange,
  propertyTypes,
  termCategory
}) => {
  // Filter types based on term category
  const filteredTypes = Object.entries(propertyTypes)
    .filter(([key]) => {
      if (termCategory === 'LONG') {
        return ['HOUSE', 'BOARDING'].includes(key);
      }
      return ['APARTMENT', 'LODGE_HOTEL', 'COMMERCIAL'].includes(key);
    })
    .map(([value, label]) => ({ value, label }));

  return (
    <View style={styles.section}>
      <SectionHeader title="Type" />
      <View style={styles.typeContainer}>
        {filteredTypes.map((type) => (
          <Tag
            key={type.value}
            text={type.label}
            isSelected={selectedType === type.value}
            onPress={() => onTypeChange(type.value)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
});

export default TypeSection;