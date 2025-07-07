import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import BottomNavigation from "../components/BottomNavigation"

export default function CompletedBooking() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.propertyCard}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.propertyImage} />
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyPrice}>
              K388 <Text style={styles.priceUnit}>/night</Text>
            </Text>
            <Text style={styles.propertyName}>Southern Sun Ridgeway Lusaka</Text>
            <Text style={styles.propertyAddress}>Lusaka, Corner Church Road & I...</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Completed</Text>
          </View>
          <Text style={styles.bookingNumber}>Booking number 19833679</Text>
        </View>

        <Text style={styles.sectionTitle}>Your trip</Text>

        <View style={styles.tripInfoSection}>
          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>Check in</Text>
            <Text style={styles.tripInfoValue}>17/12/2024 from 14:00</Text>
          </View>

          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>Check out</Text>
            <Text style={styles.tripInfoValue}>26/12/2025 to 12:00</Text>
          </View>

          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>Guests</Text>
            <Text style={styles.tripInfoValue}>2 guests</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.tripInfoLabel}>Paid for</Text>
          <Text style={styles.paymentAmount}>K1620</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookAgainButton}>
          <Text style={styles.bookAgainButtonText}>Book again</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  propertyCard: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  propertyDetails: {
    marginLeft: 12,
    flex: 1,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceUnit: {
    fontWeight: "normal",
    fontSize: 14,
  },
  propertyName: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  completedBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  bookingNumber: {
    marginLeft: "auto",
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  tripInfoSection: {
    paddingHorizontal: 16,
  },
  tripInfoItem: {
    paddingVertical: 12,
  },
  tripInfoLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  tripInfoValue: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  paymentSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 10,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  bookAgainButton: {
    backgroundColor: "#00a67e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  bookAgainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
})
