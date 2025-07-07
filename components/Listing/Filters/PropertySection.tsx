import type React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PropertySectionProps {
    selectedRooms: string;
    onSelectRooms: (room: string) => void;
  }  

const PropertySection: React.FC<PropertySectionProps> = ({ selectedRooms, onSelectRooms }) => {
    const options = ["Studio apartment", "1", "2", "3", "4", "5+"];
    
    return (
      <View style={styles.section}>
        <Text style={styles.label}>Number of rooms</Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedRooms === option && styles.selectedOption]}
              onPress={() => onSelectRooms(option)}
            >
              <Text style={[styles.optionText, selectedRooms === option && styles.selectedOptionText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  export default PropertySection

  const styles = StyleSheet.create({
    section: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    label: {
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
    option: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      backgroundColor: "#fff",
    },
    selectedOption: {
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