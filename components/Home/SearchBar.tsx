import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export function SearchBar() {
  return (
    <View style={styles.container}>
      <Link href="/search" asChild>
        <TouchableOpacity style={{ flex: 1 }}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search by city"
              placeholderTextColor="#9ca3af"
              editable={false}
              pointerEvents="none"
            />
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.bellContainer}>
        <Ionicons name="notifications-outline" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E6E6FF",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  bellContainer: {
    marginLeft: 12,
  },
});