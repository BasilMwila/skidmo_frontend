import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Tag from "./UI/Tag"

interface TagsSectionProps {
  title: string
  options: string[]
  selectedOption: string
  onSelect: (option: string) => void
}

const TagsSection: React.FC<TagsSectionProps> = ({ title, options, selectedOption, onSelect }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.propertyLabel}>{title}</Text>
      <View style={styles.tagsContainer}>
        {options.map((option) => (
          <Tag key={option} text={option} isSelected={selectedOption === option} onPress={() => onSelect(option)} />
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

export default TagsSection

