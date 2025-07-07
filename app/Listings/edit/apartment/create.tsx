import FilterScreen from "@/components/Listing/FilterScreen"
import { StyleSheet, View } from "react-native"

export default function CreateApartmentListing() {
  return (
    <View style={styles.container}>
      <FilterScreen listingType="long-term" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
