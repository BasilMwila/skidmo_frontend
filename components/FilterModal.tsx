"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface FilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (filters: string[]) => void
}

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const [stateFilter, setStateFilter] = useState<string>("Active")
  const [listingFilter, setListingFilter] = useState<string | null>(null)

  const handleApply = () => {
    const activeFilters: string[] = []
    if (stateFilter) activeFilters.push(stateFilter)
    if (listingFilter) activeFilters.push(listingFilter)
    onApply(activeFilters)
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter</Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>State</Text>

            <TouchableOpacity
              style={[styles.filterOption, stateFilter === "All" && styles.filterOptionSelected]}
              onPress={() => setStateFilter("All")}
            >
              {stateFilter === "All" ? (
                <Ionicons name="checkbox" size={24} color="#00a67e" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#ccc" />
              )}
              <Text style={styles.filterOptionText}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, stateFilter === "Active" && styles.filterOptionSelected]}
              onPress={() => setStateFilter("Active")}
            >
              {stateFilter === "Active" ? (
                <Ionicons name="checkbox" size={24} color="#00a67e" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#ccc" />
              )}
              <Text style={styles.filterOptionText}>Active</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, stateFilter === "Inactive" && styles.filterOptionSelected]}
              onPress={() => setStateFilter("Inactive")}
            >
              {stateFilter === "Inactive" ? (
                <Ionicons name="checkbox" size={24} color="#00a67e" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#ccc" />
              )}
              <Text style={styles.filterOptionText}>Inactive</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Listing</Text>

            <TouchableOpacity
              style={[styles.filterOption, listingFilter === "Sell property" && styles.filterOptionSelected]}
              onPress={() => setListingFilter(listingFilter === "Sell property" ? null : "Sell property")}
            >
              {listingFilter === "Sell property" ? (
                <Ionicons name="checkbox" size={24} color="#00a67e" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#ccc" />
              )}
              <Text style={styles.filterOptionText}>Sell property</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, listingFilter === "Long-term renting" && styles.filterOptionSelected]}
              onPress={() => setListingFilter(listingFilter === "Long-term renting" ? null : "Long-term renting")}
            >
              {listingFilter === "Long-term renting" ? (
                <Ionicons name="checkbox" size={24} color="#00a67e" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#ccc" />
              )}
              <Text style={styles.filterOptionText}>Long-term renting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, listingFilter === "Short-term renting" && styles.filterOptionSelected]}
              onPress={() => setListingFilter(listingFilter === "Short-term renting" ? null : "Short-term renting")}
            >
              {listingFilter === "Short-term renting" ? (
                <Ionicons name="checkbox" size={24} color="#00a67e" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#ccc" />
              )}
              <Text style={styles.filterOptionText}>Short-term renting</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={handleApply}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  filterOptionSelected: {
    // Additional styling for selected options if needed
  },
  filterOptionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: "#00a67e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  viewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})
