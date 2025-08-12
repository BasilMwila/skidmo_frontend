
"use client"

import { useState, useMemo, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useRouter } from "expo-router"
import FilterScreen from "@/components/Explore/Filters"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { messagingAPI } from "@/services/messaging"
import { MapFloatingButton } from "@/components/ui/MapFloatingButton"

interface Property {
  id: string | number
  title: string
  price: number | string
  address: string
  rating?: number
  images?: string[]
  number_of_bedrooms?: number
  number_of_bathrooms?: number
  purchase_type?: "rent" | "sale"
  property_type?: string
  lister?: { id: number; name?: string; email?: string; profileImage?: string }
  // Additional fields from your backend
  rental_price?: number | string
  sale_price?: number | string
  purpose?: "RENT" | "BUY" | "RENT_BUY"
  photos?: Array<{ image: string; is_primary: boolean }>
  latitude?: number
  longitude?: number
}

export default function MapListingScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation()
  const router = useRouter()
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [reserving, setReserving] = useState<number | null>(null)

  // Parse properties from route params with better error handling
  const originalProperties: Property[] = useMemo(() => {
    let properties: Property[] = []

    try {
      if (route.params?.properties) {
        if (typeof route.params.properties === "string") {
          const parsed = JSON.parse(route.params.properties)
          properties = Array.isArray(parsed) ? parsed : []
        } else if (Array.isArray(route.params.properties)) {
          properties = route.params.properties
        }
      }
    } catch (e) {
      console.error("Failed to parse properties:", e)
      properties = []
    }

    // Normalize properties to ensure consistent structure
    return properties.map((property, index) => ({
      ...property,
      // Ensure unique ID
      id: property.id || `property-${index}`,
      // Normalize price field
      price: property.price || property.rental_price || property.sale_price || "Price on request",
      // Normalize purchase type
      purchase_type: property.purchase_type || (property.purpose?.toLowerCase() as "rent" | "sale") || "rent",
      // Normalize images
      images: property.images || property.photos?.map((photo) => photo.image) || [],
    }))
  }, [route.params?.properties])

  // Fallback data for development and testing
  const fallbackProperties: Property[] = [
    {
      id: "fallback-1",
      title: "Radisson Blu Hotel Lusaka",
      price: "K440",
      address: "Lusaka, Great East Road 19029",
      rating: 4.9,
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mapListingscreen-VskOcqUMdZ9mfDdGlNooXq0UeA8aLZ.png",
      ],
      number_of_bedrooms: 2,
      number_of_bathrooms: 2,
      purchase_type: "rent",
      property_type: "LODGE_HOTEL",
      lister: { id: 101, name: "Radisson Hotels", email: "info@radisson.com" },
    },
    {
      id: "fallback-2",
      title: "Spacious Family House",
      price: 8000,
      address: "456 Suburb Ave, Lusaka",
      rating: 4.8,
      images: [],
      number_of_bedrooms: 4,
      number_of_bathrooms: 3,
      purchase_type: "rent",
      property_type: "HOUSE",
      lister: { id: 102, name: "Jane Smith", email: "jane@example.com" },
    },
    {
      id: "fallback-3",
      title: "Commercial Office Space",
      price: 15000,
      address: "789 Business Rd, Lusaka",
      rating: 4.2,
      images: [],
      number_of_bedrooms: 0,
      number_of_bathrooms: 2,
      purchase_type: "rent",
      property_type: "COMMERCIAL",
      lister: { id: 103, name: "Acme Corp", email: "info@acme.com" },
    },
  ]

  // Use filtered properties if available, otherwise use original or fallback
  const displayProperties = useMemo(() => {
    if (filteredProperties.length > 0) {
      return filteredProperties
    }
    return originalProperties.length > 0 ? originalProperties : fallbackProperties
  }, [originalProperties, filteredProperties])

  // Create absolutely unique key for each property
  const createUniqueKey = (item: Property, index: number): string => {
    const baseId = item.id?.toString() || `item-${index}`
    const propertyType = item.property_type || "unknown"
    return `${propertyType}-${baseId}-${index}`
  }

  const handleFilterApply = (filtered: Property[]) => {
    setFilteredProperties(filtered)
    setFilterModalVisible(false)
  }

  const handleFilterClose = () => {
    setFilterModalVisible(false)
  }

  const handleClearFilters = () => {
    setFilteredProperties([])
  }

  const locationName = route.params?.locationName || "this area"

  const handleReserve = (propertyId: number | string) => {
    const property = displayProperties.find((p) => p.id?.toString() === propertyId.toString())
    if (!property) return

    router.push({
      pathname: "/reserve",
      params: {
        propertyId: property.id?.toString(),
        propertyType: property.property_type?.toLowerCase() || "apartment",
      },
    })
  }

   //Message handling
  const handleMessage = async (property: Property) => {
    // Check for owner_id from multiple sources
    const ownerId = property.owner_id || property.lister?.id?.toString()

    if (!ownerId) {
      Alert.alert("Error", "Owner information not available")
      return
    }

    try {
      // Get current user ID (ensure it's a number)
      const currentUserId = Number(await AsyncStorage.getItem("user_id"))
      const ownerIdNumber = Number(ownerId)

      if (!currentUserId || !ownerIdNumber) {
        Alert.alert("Error", "User information not available")
        return
      }

      console.log("Starting conversation between:", currentUserId, ownerIdNumber)

      // Create or get thread
      const thread = await messagingAPI.createOrGetThread(currentUserId, ownerIdNumber)

      // Prepare property details to pass to chat
      const propertyDetails = {
        id: property.id.toString(),
        title: property.title,
        price:
          property.rental_price != null
            ? `K${property.rental_price}`
            : property.price != null
              ? typeof property.price === "number"
                ? `K${property.price.toFixed(2)}`
                : `K${property.price}`
              : "Price on request",
        address: property.address,
        number_of_rooms: property.bedroom_count || 0,
        number_of_bathrooms: property.bathroom_count || 0,
        image: property.photos && property.photos.length > 0 ? property.photos[0].image : null,
      }

      // Navigate to chat screen with property details
      router.push({
        pathname: "/chat",
        params: {
          threadId: thread.id.toString(),
          userId: ownerIdNumber.toString(),
          propertyId: property.id.toString(),
          userName: property.lister?.name || "Property Owner",
          propertyDetails: JSON.stringify(propertyDetails),
        },
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      Alert.alert("Error", "Failed to start conversation. Please try again.")
    }
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#00C851" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#999" />
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={16} color="#fff" />
          <Text style={styles.filterText}>Filter</Text>
          {filteredProperties.length > 0 && <View style={styles.filterIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map" size={20} color="#00C851" />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="home-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Properties Found</Text>
      <Text style={styles.emptyText}>
        No properties were found in {locationName}. Try adjusting your filters or search in a different area.
      </Text>
    </View>
  )

  const renderPropertyItem = ({ item, index }: { item: Property; index: number }) => (
    <View style={styles.propertyCard}>
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.propertyInfo}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {typeof item.price === "string" ? item.price : `K${item.price}`}
            <Text style={styles.priceUnit}>/night</Text>
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating || 4.5}</Text>
            <Text style={styles.reviewCount}>(1899)</Text>
          </View>
        </View>

        <Text style={styles.propertyTitle}>{item.title}</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons key={star} name="star" size={12} color="#FFD700" />
          ))}
        </View>

        <Text style={styles.address}>{item.address}</Text>
        <Text style={styles.cancellation}>Free cancellation</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() => handleReserve(item.id)}
            disabled={reserving === Number(item.id)}
          >
            {reserving === Number(item.id) ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.reserveButtonText}>Reserve</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => handleMessage(item)}
            disabled={reserving === Number(item.id)}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        {renderHeader()}

        <FlatList
          data={displayProperties}
          keyExtractor={createUniqueKey}
          renderItem={renderPropertyItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <Modal
          visible={filterModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={handleFilterClose}
        >
          <FilterScreen
            properties={originalProperties.length > 0 ? originalProperties : fallbackProperties}
            onApply={handleFilterApply}
            onClose={handleFilterClose}
          />
        </Modal>
      </SafeAreaView>
      
      {/* Map Floating Button */}
      <MapFloatingButton />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f4",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    position: "relative",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  filterIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: "#ff4444",
    borderRadius: 4,
  },
  mapButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  propertyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 50,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
  },
  moreButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
  },
  propertyInfo: {
    padding: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 2,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  cancellation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  reserveButton: {
    flex: 1,
    backgroundColor: "#00C851",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#00C851",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
})
