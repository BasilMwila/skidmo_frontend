"use client"

import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native"
import MapView from "react-native-maps"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

export default function ExploreScreen() {
  const router = useRouter()

  const renderListingsButton = () => (
    <TouchableOpacity style={styles.listingsButton} onPress={() => router.push("/extended-filter")}>
      <Feather name="list" size={18} color="black" />
      <Text style={styles.listingsButtonText}>Listings</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -15.4167,
          longitude: 28.2833,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      {renderListingsButton()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  listingsButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  listingsButtonText: {
    marginLeft: 8,
    fontWeight: "500",
  },
})
