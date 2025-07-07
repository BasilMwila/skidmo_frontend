import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SectionHeader from "./UI/SectionHeader"

interface SizeRatingSectionProps {
  rating: number
  onRatingChange: (rating: number) => void
}

const SizeRatingSection: React.FC<SizeRatingSectionProps> = ({ rating, onRatingChange }) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="Size rating" />
      <View style={styles.sizeRatingContainer}>
        {[5, 4, 3, 2, 1].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.ratingButton, rating === value && styles.selectedRating]}
            onPress={() => onRatingChange(value)}
          >
            <Text style={styles.ratingText}>{value}★</Text>
          </TouchableOpacity>
        ))}
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
  sizeRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedRating: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  ratingText: {
    fontSize: 14,
    color: "#333",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
})

export default SizeRatingSection

