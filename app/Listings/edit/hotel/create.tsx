import FilterScreen from "@/components/Listing/FilterScreen"
import { StyleSheet, View } from "react-native"

export default function CreateHotelListing() {
  return (
    <View style={styles.container}>
      <FilterScreen listingType="hotel" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
