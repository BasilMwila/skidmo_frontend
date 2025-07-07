import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface BathroomSectionProps {
  bathrooms: number;
  onBathroomsChange: (count: number) => void;
}

const bathroomOptions = ["Self Contained", " 1 ", " 2 ", " 3 ", " 4 ", " 5 ", " 6+"]; // Available bathroom options

const BathroomSection: React.FC<BathroomSectionProps> = ({ bathrooms, onBathroomsChange }) => {
  const handleSelect = (count: number) => {
    console.log('Selected bathroom count:', count); // Log selected number
    onBathroomsChange(count);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bathrooms</Text>
      <View style={styles.optionsContainer}>
        {bathroomOptions.map((count) => (
          <TouchableOpacity
            key={count}
            style={[
              styles.optionButton,
              bathrooms === count && styles.selectedOptionButton
            ]}
            onPress={() => handleSelect(count)}
          >
            <Text style={[
              styles.optionText,
              bathrooms === count && styles.selectedOptionText
            ]}>
              {count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
      color: "#333",
  },
  optionsContainer: {
    flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      backgroundColor: "#fff",
  },
  selectedOptionButton: {
    backgroundColor: "#4CAF50",
      borderColor: "#4CAF50",
  },
  optionText: {
    fontSize: 14,
      color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
  },
});

export default BathroomSection;