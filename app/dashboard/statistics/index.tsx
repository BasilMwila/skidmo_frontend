import { StyleSheet, View } from "react-native"
import { StatisticsScreen } from "@/components/Profile/StatisticsScreen" // Correct named import

export default function MyStatistics() {
  return (
    <View style={styles.container}>
      <StatisticsScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
