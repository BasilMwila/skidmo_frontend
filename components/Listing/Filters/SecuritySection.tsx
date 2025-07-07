import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Tag from "./UI/Tag"

interface SecuritySectionProps {
  selectedOptions: string[]
  onToggleOption: (option: string) => void
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ selectedOptions, onToggleOption }) => {
  const securityOptions = ["Safe", "CCTV"]

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Security</Text>
      <View style={styles.tagsContainer}>
        {securityOptions.map((option) => (
          <Tag
            key={option}
            text={option}
            isSelected={selectedOptions.includes(option)}
            onPress={() => onToggleOption(option)}
          />
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
  sectionTitle: {
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

export default SecuritySection

