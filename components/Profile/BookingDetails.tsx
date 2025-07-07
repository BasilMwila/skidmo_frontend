"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import CancelBookingModal from "../CancelBookingModal"

export default function BookingDetails() {
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const router = useRouter()
  const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({ title: 'Booking History' });
      }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity style={styles.propertyCard}>
          <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.propertyImage} />
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyPrice}>
              K350 <Text style={styles.priceUnit}>/day</Text>
            </Text>
            <Text style={styles.propertyInfo}>2 rooms, 44,7 m²</Text>
            <Text style={styles.propertyAddress}>Lusaka, Sibweni Road, 16</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Active</Text>
          </View>
          <Text style={styles.bookingNumber}>Booking number 20233679</Text>
        </View>

        <Text style={styles.sectionTitle}>Your trip</Text>

        <View style={styles.tripInfoSection}>
          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>Check in</Text>
            <Text style={styles.tripInfoValue}>21/02/2025 from 14:00</Text>
          </View>

          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>Check out</Text>
            <Text style={styles.tripInfoValue}>25/02/2025 to 12:00</Text>
          </View>

          <View style={styles.tripInfoItem}>
            <Text style={styles.tripInfoLabel}>Guests</Text>
            <Text style={styles.tripInfoValue}>2 guests</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.tripInfoLabel}>Paid for</Text>
          <Text style={styles.paymentAmount}>K820</Text>
        </View>

        <View style={styles.cancellationPolicy}>
          <Text style={styles.cancellationText}>
            Free cancellation until 24/02/2025. The room rate will not be refunded if cancelled after 24/02/2025.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setCancelModalVisible(true)}>
          <Text style={styles.cancelButtonText}>Cancel your booking</Text>
        </TouchableOpacity>
      </View>

      <CancelBookingModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onCancel={() => {
          setCancelModalVisible(false)
          router.back()
        }}
        bookingNumber="20233679"
        cancellationDate="24/02/2025"
      />
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
  propertyInfo: {
    fontSize: 14,
    color: "#666",
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
  statusBadge: {
    backgroundColor: "#e6f7ef",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#00a67e",
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
  cancellationPolicy: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 8,
  },
  cancellationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    backgroundColor: "#e6f7ef",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#00a67e",
    fontSize: 16,
    fontWeight: "500",
  },
})
