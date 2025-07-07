import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface BalconySectionProps {
  balcony: number
  onBalconyChange: (value: number) => void
}

const BalconySection: React.FC<BalconySectionProps> = ({ balcony, onBalconyChange }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.propertyLabel}>Balcony</Text>
      <View style={styles.numberSelector}>
        <TouchableOpacity
          style={[styles.numberButton, balcony === 0 && styles.selectedNumberButton]}
          onPress={() => onBalconyChange(0)}
        >
          <Text style={[styles.numberButtonText, balcony === 0 && styles.selectedNumberButtonText]}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numberButton, balcony === 1 && styles.selectedNumberButton]}
          onPress={() => onBalconyChange(1)}
        >
          <Text style={[styles.numberButtonText, balcony === 1 && styles.selectedNumberButtonText]}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.numberButton, balcony === 2 && styles.selectedNumberButton]}
          onPress={() => onBalconyChange(2)}
        >
          <Text style={[styles.numberButtonText, balcony === 2 && styles.selectedNumberButtonText]}>2</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  numberSelector: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  numberButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedNumberButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  numberButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedNumberButtonText: {
    color: "#fff",
  },
})

export default BalconySection

