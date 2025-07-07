import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"

export default function SearchHeader() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="gray" />
      </View>

      <TouchableOpacity style={styles.filterButton}>
        <Feather name="sliders" size={18} color="white" />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    zIndex: 1,
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 12,
  },
  filterText: {
    color: "white",
    marginLeft: 6,
    fontWeight: "500",
  },
})

