"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

interface GuestCounter {
  adults: number
  children: number
  infants: number
  pets: number
}

interface SearchFilterModalProps {
  visible: boolean
  onClose: () => void
  onApplyFilters: (filters: {
    searchQuery: string
    rentalType: "long-term" | "short-term"
    guests: GuestCounter
  }) => void
}

export default function SearchFilterModal({ visible, onClose, onApplyFilters }: SearchFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [rentalType, setRentalType] = useState<"long-term" | "short-term">("long-term")
  const [guests, setGuests] = useState<GuestCounter>({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  })

  const handleIncrement = (type: keyof GuestCounter) => {
    setGuests((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
  }

  const handleDecrement = (type: keyof GuestCounter) => {
    if (guests[type] > 0) {
      setGuests((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }))
    }
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      searchQuery,
      rentalType,
      guests,
    })
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by city"
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, rentalType === "long-term" && styles.toggleButtonActive]}
              onPress={() => setRentalType("long-term")}
            >
              <Text style={styles.toggleButtonText}>Long-term</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, rentalType === "short-term" && styles.toggleButtonActive]}
              onPress={() => setRentalType("short-term")}
            >
              <Text style={styles.toggleButtonText}>Short-term</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Number of guests</Text>

          <View style={styles.guestRow}>
            <View>
              <Text style={styles.guestType}>Adult</Text>
              <Text style={styles.guestAge}>Ages 13 or above</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[styles.counterButton, guests.adults === 0 && styles.counterButtonDisabled]}
                onPress={() => handleDecrement("adults")}
                disabled={guests.adults === 0}
              >
                <Ionicons name="remove" size={20} color={guests.adults === 0 ? "#ccc" : "#000"} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{guests.adults}</Text>
              <TouchableOpacity style={styles.counterButton} onPress={() => handleIncrement("adults")}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.guestRow}>
            <View>
              <Text style={styles.guestType}>Children</Text>
              <Text style={styles.guestAge}>Ages 2-12</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[styles.counterButton, guests.children === 0 && styles.counterButtonDisabled]}
                onPress={() => handleDecrement("children")}
                disabled={guests.children === 0}
              >
                <Ionicons name="remove" size={20} color={guests.children === 0 ? "#ccc" : "#000"} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{guests.children}</Text>
              <TouchableOpacity style={styles.counterButton} onPress={() => handleIncrement("children")}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.guestRow}>
            <View>
              <Text style={styles.guestType}>Infants</Text>
              <Text style={styles.guestAge}>Under 2</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[styles.counterButton, guests.infants === 0 && styles.counterButtonDisabled]}
                onPress={() => handleDecrement("infants")}
                disabled={guests.infants === 0}
              >
                <Ionicons name="remove" size={20} color={guests.infants === 0 ? "#ccc" : "#000"} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{guests.infants}</Text>
              <TouchableOpacity style={styles.counterButton} onPress={() => handleIncrement("infants")}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.guestRow}>
            <View>
              <Text style={styles.guestType}>Pets</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[styles.counterButton, guests.pets === 0 && styles.counterButtonDisabled]}
                onPress={() => handleDecrement("pets")}
                disabled={guests.pets === 0}
              >
                <Ionicons name="remove" size={20} color={guests.pets === 0 ? "#ccc" : "#000"} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{guests.pets}</Text>
              <TouchableOpacity style={styles.counterButton} onPress={() => handleIncrement("pets")}>
                <Ionicons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleApplyFilters}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: "#e8f8f0",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#c0f0d0",
  },
  toggleButtonText: {
    color: "#008000",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  guestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  guestType: {
    fontSize: 16,
    fontWeight: "500",
  },
  guestAge: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonDisabled: {
    borderColor: "#eee",
  },
  counterValue: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: "center",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  searchButton: {
    backgroundColor: "#00a651",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
})

