import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import Counter from "./UI/Counter"

interface CounterSectionProps {
  title: string
  value: number
  onChange: (value: number) => void
}

const CounterSection: React.FC<CounterSectionProps> = ({ title, value, onChange }) => {
  const updateCounter = (increment: boolean) => {
    if (increment) {
      onChange(value + 1)
    } else if (value > 0) {
      onChange(value - 1)
    }
  }

  return (
    <View style={styles.section}>
      <Text style={styles.propertyLabel}>{title}</Text>
      <View style={styles.counterRow}>
        <Counter value={value} onDecrement={() => updateCounter(false)} onIncrement={() => updateCounter(true)} />
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
  counterRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
  },
})

export default CounterSection

