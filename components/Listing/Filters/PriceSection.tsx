import React from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import SectionHeader from "./UI/SectionHeader";

interface PriceSectionProps {
  price: number;
  onPriceChange: (price: number) => void;
  currencySymbol?: string;
  purchaseType?: "rent" | "sale"; // Add purchase type if needed
}

const PriceSection: React.FC<PriceSectionProps> = ({
  price,
  onPriceChange,
  currencySymbol = "K",
  purchaseType = "rent" // Default to rent
}) => {

  const handlePriceChange = (text: string) => {
    // Remove all non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Convert to number (default to 0 if empty)
    const value = numericValue === '' ? 0 : parseInt(numericValue, 10);
    
    onPriceChange(value);
  };

  return (
    <View style={styles.section}>
      <SectionHeader title={`Price (${purchaseType === 'rent' ? 'Your' : ''})`} />
      <View style={styles.priceContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.currencySymbol}>{currencySymbol}</Text>
          <TextInput
            style={styles.input}
            value={price === 0 ? "" : price.toString()}
            onChangeText={handlePriceChange}
            placeholder={`Enter ${purchaseType === 'rent' ? 'Your' : ''} Price`}
            keyboardType="numeric"
            returnKeyType="done"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priceContainer: {
    marginVertical: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});

export default PriceSection;