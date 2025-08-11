import { StyleSheet, View } from "react-native"
import WishListCard from "@/components/Wishlist/WishListCard" // Import WishListCard

export default function Wishlist() {
  return (
    <View style={styles.container}>
      <WishListCard /> {/* Render WishListCard directly */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Ensure background is white
  },
})
