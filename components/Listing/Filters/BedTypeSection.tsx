import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Tag from "./UI/Tag"

interface BedTypeSectionProps {
  selectedType: string
  onTypeChange: (type: string) => void
}

const BedTypeSection: React.FC<BedTypeSectionProps> = ({ selectedType, onTypeChange }) => {
  const bedTypes = ["Single bed", "Double bed", "King-size"]

  return (
    <View style={styles.section}>
      <Text style={styles.propertyLabel}>Bed type</Text>
      <View style={styles.tagsContainer}>
        {bedTypes.map((type) => (
          <Tag key={type} text={type} isSelected={selectedType === type} onPress={() => onTypeChange(type)} />
        ))}
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
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
})

export default BedTypeSection

