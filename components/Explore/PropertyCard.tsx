import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function PropertyCard({ property, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(property)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.imageUrl }} style={styles.image} />
        {property.hasOnlineTour && (
          <View style={styles.tourBadge}>
            <Ionicons name="videocam-outline" size={14} color="black" />
            <Text style={styles.tourText}>Online tour</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.priceRatingRow}>
          <Text style={styles.price}>
            {property.price} <Text style={styles.perDay}>/day</Text>
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="black" />
            <Text style={styles.rating}>
              {property.rating} ({property.reviewCount})
            </Text>
          </View>
        </View>

        <Text style={styles.details}>
          {property.rooms} rooms, {property.size} m²
        </Text>

        <Text style={styles.location}>{property.location}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tourBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  tourText: {
    marginLeft: 2,
    fontSize: 10,
    fontWeight: "500",
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  perDay: {
    fontSize: 12,
    fontWeight: "normal",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 2,
    fontSize: 12,
  },
  details: {
    fontSize: 14,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
})

