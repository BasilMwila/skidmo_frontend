import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface TagProps {
  text: string
  isSelected: boolean
  onPress: () => void
}

const Tag: React.FC<TagProps> = ({ text, isSelected, onPress }) => {
  return (
    <TouchableOpacity style={[styles.tag, isSelected && styles.selectedTag]} onPress={onPress}>
      <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  selectedTag: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  tagText: {
    fontSize: 14,
    color: "#333",
  },
  selectedTagText: {
    color: "#fff",
  },
})

export default Tag

