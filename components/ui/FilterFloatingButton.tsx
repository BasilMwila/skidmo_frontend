"use client"

import { useState } from "react"
import { TouchableOpacity, StyleSheet, View, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import FilterScreen from "@/components/Explore/Filters"

interface FilterFloatingButtonProps {
  onFiltersApplied?: (filteredProperties: any[]) => void
}

export function FilterFloatingButton({ onFiltersApplied }: FilterFloatingButtonProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handlePress = () => {
    setShowFilters(true)
  }

  const handleApplyFilters = (filteredProperties: any[]) => {
    setShowFilters(false)
    if (onFiltersApplied) {
      onFiltersApplied(filteredProperties)
    }
  }

  const handleCloseFilters = () => {
    setShowFilters(false)
  }

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.buttonContent}>
          <Ionicons name="filter-outline" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <FilterScreen
          onApply={handleApplyFilters}
          onClose={handleCloseFilters}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 60, // Position below status bar
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4A4A4A", // Dark gray color matching other floating buttons
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})