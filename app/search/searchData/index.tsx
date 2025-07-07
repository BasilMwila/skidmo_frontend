"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { useLocalSearchParams, useNavigation } from "expo-router"
import { propertiesAPI } from "@/services/propertiesApi" // Adjust path as needed

interface Property {
  id: number
  title: string
  price: string
  number_of_rooms: number
  size?: string
  location: string
  images?: string[]
  [key: string]: any
}

const PropertySearchScreen = () => {
  const params = useLocalSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ title: "Results" })
  }, [navigation])

  // Parse search parameters
  const searchTerm = params.term || "short-term"
  const checkInDate = params.checkIn
  const checkOutDate = params.checkOut

  // Prepare API filters
  const prepareFilters = () => {
    const filters: Record<string, any> = {
      purchase_type: searchTerm === "short-term" ? "rent" : "rent", // Adjust as needed
      listing_type: searchTerm,
    }

    // Add date filters for short-term rentals
    if (searchTerm === "short-term" && checkInDate && checkOutDate) {
      filters.available_from = checkInDate
      filters.available_to = checkOutDate
    }

    // Add other filters from params as needed
    // if (params.guests) filters.min_guests = params.guests;
    // if (params.priceRange) {
    //   const [min, max] = JSON.parse(params.priceRange);
    //   filters.min_price = min;
    //   filters.max_price = max;
    // }

    return filters
  }

  // Fetch properties based on filters
  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = prepareFilters()

      if (!propertiesAPI.filterProperties) {
        console.error("filterProperties method is not defined in propertiesAPI")
        throw new Error("API method not available")
      }

      const response = await propertiesAPI.filterProperties(filters)

      // Transform API response to match your UI needs
      const formattedProperties = Array.isArray(response) ? response : response.results || []

      setProperties(formattedProperties)
    } catch (err) {
      console.error("Failed to fetch properties:", err)
      setError("Failed to load properties. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    const getFiltersFromParams = () => {
      try {
        if (params.filters) {
          return JSON.parse(params.filters as string)
        }
        return prepareFilters()
      } catch (error) {
        console.error("Error parsing filters from params:", error)
        return prepareFilters()
      }
    }

    const fetchPropertiesWithFilters = async () => {
      try {
        setLoading(true)
        setError(null)

        const filters = getFiltersFromParams()
        console.log("Fetching properties with filters:", filters)

        if (!propertiesAPI.filterProperties) {
          console.error("filterProperties method is not defined in propertiesAPI")
          throw new Error("API method not available")
        }

        const response = await propertiesAPI.filterProperties(filters)

        // Transform API response to match your UI needs
        const formattedProperties = Array.isArray(response) ? response : response.results || []

        setProperties(formattedProperties)
      } catch (err) {
        console.error("Failed to fetch properties:", err)
        setError("Failed to load properties. Please try again.")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }

    fetchPropertiesWithFilters()
  }, [params]) // Re-fetch when params change

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true)
    fetchProperties()
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {searchTerm === "short-term" ? "Short Term Rentals" : "Long Term Rentals"}
        </Text>
        <View style={styles.trendIndicator}>
          <Ionicons name="arrow-down" size={16} color="green" />
          <Ionicons name="arrow-up" size={16} color="red" />
        </View>
      </View>

      {/* Filter summary */}
      <View style={styles.filterSummary}>
        <Text style={styles.filterSummaryText}>
          {checkInDate && checkOutDate
            ? `${new Date(checkInDate).toLocaleDateString()} - ${new Date(checkOutDate).toLocaleDateString()}`
            : searchTerm === "short-term"
              ? "Select dates"
              : "Available now"}
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={16} color="white" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Property Listings */}
      <ScrollView
        style={styles.listingsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {properties.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No properties found matching your criteria</Text>
            <TouchableOpacity
              style={styles.modifySearchButton}
              onPress={() => {
                /* Navigate back to search */
              }}
            >
              <Text style={styles.modifySearchButtonText}>Modify Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          properties.map((property) => (
            <View key={property.id} style={styles.propertyCard}>
              <View style={styles.imageContainer}>
                {property.images?.[0] ? (
                  <Image source={{ uri: property.images[0] }} style={styles.propertyImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.propertyImage, styles.noImage]}>
                    <Feather name="image" size={40} color="#ccc" />
                  </View>
                )}
                <View style={styles.imageActions}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="heart-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Feather name="more-horizontal" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.mapButton}>
                  <Feather name="map" size={16} color="white" />
                  <Text style={styles.mapText}>Map</Text>
                </View>
              </View>

              <View style={styles.propertyDetails}>
                <Text style={styles.propertyPrice}>{property.price}</Text>
                <Text style={styles.propertyInfo}>
                  {property.number_of_rooms} {property.number_of_rooms > 1 ? "rooms" : "room"}
                  {property.size && `, ${property.size}`}
                </Text>
                <Text style={styles.propertyLocation}>{property.location || property.address}</Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.callButton}>
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.messageButton}>
                    <Text style={styles.buttonText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  trendIndicator: {
    flexDirection: "row",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 80,
  },
  filterText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
  },
  listingsContainer: {
    flex: 1,
  },
  propertyCard: {
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
  },
  propertyImage: {
    width: "100%",
    height: 200,
  },
  imageActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    marginLeft: 8,
  },
  mapButton: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  mapText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  propertyDetails: {
    padding: 16,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  propertyInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
  propertyLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    backgroundColor: "#00a651",
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  messageButton: {
    backgroundColor: "#00a651",
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#00a651",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modifySearchButton: {
    backgroundColor: "#00a651",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  modifySearchButtonText: {
    color: "white",
    fontWeight: "500",
  },
  noImage: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PropertySearchScreen
