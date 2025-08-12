"use client"

import { TouchableOpacity, StyleSheet, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ListingsFloatingButtonProps {
  onPress?: () => void
}

export function ListingsFloatingButton({ onPress }: ListingsFloatingButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.buttonContent}>
        <Ionicons name="list-outline" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Listings</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 90, // Position above the tab bar
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#4A4A4A", // Dark gray color matching the MapFloatingButton
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
})