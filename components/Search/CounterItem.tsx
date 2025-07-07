import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface CounterItemProps {
  title: string
  subtitle?: string
  count: number
  onDecrement: () => void
  onIncrement: () => void
}

const CounterItem = ({ title, subtitle, count, onDecrement, onIncrement }: CounterItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.counterContainer}>
        <TouchableOpacity style={styles.counterButton} onPress={onDecrement} disabled={count === 0}>
          <Ionicons name="remove" size={20} color={count === 0 ? "#ccc" : "#000"} />
        </TouchableOpacity>

        <Text style={styles.count}>{count}</Text>

        <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
          <Ionicons name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    fontSize: 16,
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: "center",
  },
})

export default CounterItem
