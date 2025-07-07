import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface CounterProps {
  value: number
  onDecrement: () => void
  onIncrement: () => void
}

const Counter: React.FC<CounterProps> = ({ value, onDecrement, onIncrement }) => {
  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
        <Text style={styles.counterButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
        <Text style={styles.counterButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  counterButtonText: {
    fontSize: 16,
    color: "#333",
  },
  counterValue: {
    fontSize: 16,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
})

export default Counter

