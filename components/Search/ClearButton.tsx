import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface ClearButtonProps {
  onPress: () => void
}

const ClearButton: React.FC<ClearButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Clear</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  text: {
    color: "#333",
    fontSize: 16,
  },
})

export default ClearButton