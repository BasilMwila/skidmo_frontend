import { StyleSheet, View } from "react-native"
import WishListCard from "@/components/Wishlist/WishListCard" // Import WishListCard
import BottomNavigation from "@/components/BottomNavigation"

export default function Wishlist() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <WishListCard /> {/* Render WishListCard directly */}
      </View>
      <View style={styles.bottomNavContainer}>
        <BottomNavigation />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff", // Ensure background is white
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // Ensure background is white
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})
