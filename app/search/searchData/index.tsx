// "use client"

// import { useEffect, useState } from "react"
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native"
// import { Ionicons, Feather } from "@expo/vector-icons"
// import { useLocalSearchParams, useNavigation } from "expo-router"
// import { propertiesAPI } from "@/services/propertiesApi" // Adjust path as needed

// interface Property {
//   id: number
//   title: string
//   price: string
//   number_of_rooms: number
//   size?: string
//   location: string
//   images?: string[]
//   [key: string]: any
// }

// const PropertySearchScreen = () => {
//   const params = useLocalSearchParams()
//   const [properties, setProperties] = useState<Property[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const navigation = useNavigation()

//   useEffect(() => {
//     navigation.setOptions({ title: "Results" })
//   }, [navigation])

//   // Parse search parameters
//   const searchTerm = params.term || "short-term"
//   const checkInDate = params.checkIn
//   const checkOutDate = params.checkOut

//   // Prepare API filters
//   const prepareFilters = () => {
//     const filters: Record<string, any> = {
//       purchase_type: searchTerm === "short-term" ? "rent" : "rent", // Adjust as needed
//       listing_type: searchTerm,
//     }

//     // Add date filters for short-term rentals
//     if (searchTerm === "short-term" && checkInDate && checkOutDate) {
//       filters.available_from = checkInDate
//       filters.available_to = checkOutDate
//     }

//     // Add other filters from params as needed
//     // if (params.guests) filters.min_guests = params.guests;
//     // if (params.priceRange) {
//     //   const [min, max] = JSON.parse(params.priceRange);
//     //   filters.min_price = min;
//     //   filters.max_price = max;
//     // }

//     return filters
//   }

//   // Fetch properties based on filters
//   const fetchProperties = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const filters = prepareFilters()

//       if (!propertiesAPI.filterProperties) {
//         console.error("filterProperties method is not defined in propertiesAPI")
//         throw new Error("API method not available")
//       }

//       const response = await propertiesAPI.filterProperties(filters)

//       // Transform API response to match your UI needs
//       const formattedProperties = Array.isArray(response) ? response : response.results || []

//       setProperties(formattedProperties)
//     } catch (err) {
//       console.error("Failed to fetch properties:", err)
//       setError("Failed to load properties. Please try again.")
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Initial fetch
//   useEffect(() => {
//     const getFiltersFromParams = () => {
//       try {
//         if (params.filters) {
//           return JSON.parse(params.filters as string)
//         }
//         return prepareFilters()
//       } catch (error) {
//         console.error("Error parsing filters from params:", error)
//         return prepareFilters()
//       }
//     }

//     const fetchPropertiesWithFilters = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const filters = getFiltersFromParams()
//         console.log("Fetching properties with filters:", filters)

//         if (!propertiesAPI.filterProperties) {
//           console.error("filterProperties method is not defined in propertiesAPI")
//           throw new Error("API method not available")
//         }

//         const response = await propertiesAPI.filterProperties(filters)

//         // Transform API response to match your UI needs
//         const formattedProperties = Array.isArray(response) ? response : response.results || []

//         setProperties(formattedProperties)
//       } catch (err) {
//         console.error("Failed to fetch properties:", err)
//         setError("Failed to load properties. Please try again.")
//       } finally {
//         setLoading(false)
//         setRefreshing(false)
//       }
//     }

//     fetchPropertiesWithFilters()
//   }, [params]) // Re-fetch when params change

//   // Handle refresh
//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchProperties()
//   }

//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" style={styles.loader} />
//       </SafeAreaView>
//     )
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {searchTerm === "short-term" ? "Short Term Rentals" : "Long Term Rentals"}
//         </Text>
//         <View style={styles.trendIndicator}>
//           <Ionicons name="arrow-down" size={16} color="green" />
//           <Ionicons name="arrow-up" size={16} color="red" />
//         </View>
//       </View>

//       {/* Filter summary */}
//       <View style={styles.filterSummary}>
//         <Text style={styles.filterSummaryText}>
//           {checkInDate && checkOutDate
//             ? `${new Date(checkInDate).toLocaleDateString()} - ${new Date(checkOutDate).toLocaleDateString()}`
//             : searchTerm === "short-term"
//               ? "Select dates"
//               : "Available now"}
//         </Text>
//         <TouchableOpacity style={styles.filterButton}>
//           <Feather name="sliders" size={16} color="white" />
//           <Text style={styles.filterText}>Filter</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Property Listings */}
//       <ScrollView
//         style={styles.listingsContainer}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {properties.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyStateText}>No properties found matching your criteria</Text>
//             <TouchableOpacity
//               style={styles.modifySearchButton}
//               onPress={() => {
//                 /* Navigate back to search */
//               }}
//             >
//               <Text style={styles.modifySearchButtonText}>Modify Search</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           properties.map((property) => (
//             <View key={property.id} style={styles.propertyCard}>
//               <View style={styles.imageContainer}>
//                 {property.images?.[0] ? (
//                   <Image source={{ uri: property.images[0] }} style={styles.propertyImage} resizeMode="cover" />
//                 ) : (
//                   <View style={[styles.propertyImage, styles.noImage]}>
//                     <Feather name="image" size={40} color="#ccc" />
//                   </View>
//                 )}
//                 <View style={styles.imageActions}>
//                   <TouchableOpacity style={styles.iconButton}>
//                     <Ionicons name="heart-outline" size={24} color="black" />
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.iconButton}>
//                     <Feather name="more-horizontal" size={24} color="black" />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.mapButton}>
//                   <Feather name="map" size={16} color="white" />
//                   <Text style={styles.mapText}>Map</Text>
//                 </View>
//               </View>

//               <View style={styles.propertyDetails}>
//                 <Text style={styles.propertyPrice}>{property.price}</Text>
//                 <Text style={styles.propertyInfo}>
//                   {property.number_of_rooms} {property.number_of_rooms > 1 ? "rooms" : "room"}
//                   {property.size && `, ${property.size}`}
//                 </Text>
//                 <Text style={styles.propertyLocation}>{property.location || property.address}</Text>

//                 <View style={styles.actionButtons}>
//                   <TouchableOpacity style={styles.callButton}>
//                     <Text style={styles.buttonText}>Call</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.messageButton}>
//                     <Text style={styles.buttonText}>Message</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   trendIndicator: {
//     flexDirection: "row",
//   },
//   filterContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },
//   filterButton: {
//     backgroundColor: "#333",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     width: 80,
//   },
//   filterText: {
//     color: "white",
//     marginLeft: 8,
//     fontSize: 14,
//   },
//   listingsContainer: {
//     flex: 1,
//   },
//   propertyCard: {
//     marginBottom: 16,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   propertyImage: {
//     width: "100%",
//     height: 200,
//   },
//   imageActions: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     flexDirection: "row",
//   },
//   iconButton: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 6,
//     marginLeft: 8,
//   },
//   mapButton: {
//     position: "absolute",
//     bottom: 8,
//     left: 8,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   mapText: {
//     color: "white",
//     marginLeft: 4,
//     fontSize: 12,
//   },
//   propertyDetails: {
//     padding: 16,
//   },
//   propertyPrice: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   propertyInfo: {
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   propertyLocation: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 16,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   callButton: {
//     backgroundColor: "#00a651",
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   messageButton: {
//     backgroundColor: "#00a651",
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingVertical: 8,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#ff4444",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   retryButton: {
//     backgroundColor: "#00a651",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//   },
//   retryButtonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 40,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modifySearchButton: {
//     backgroundColor: "#00a651",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//   },
//   modifySearchButtonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   noImage: {
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// })

// export default PropertySearchScreen


"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router"
import { propertiesAPI } from "@/services/propertiesApi"

interface Property {
  id: string
  title: string
  price: string
  address: string
  rating: number
  reviewCount: number
  images: string[]
  stars: number
  cancellation: string
  owner_id?: string
  contact?: string
}

const SearchResultsScreen = () => {
  const navigation = useNavigation()
  const router = useRouter()
  const params = useLocalSearchParams()

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
    fetchSearchResults()
  }, [navigation])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)

      // Extract search parameters
      const searchTerm = params.term as string
      const checkIn = params.checkIn as string
      const checkOut = params.checkOut as string

      console.log("Search params:", { searchTerm, checkIn, checkOut })

      // Fetch properties based on search parameters
      let searchResults = []

      if (searchTerm === "short-term") {
        // Fetch rental properties for short-term stays
        const [apartments, houses, commercials] = await Promise.all([
          propertiesAPI.apartment.list(),
          propertiesAPI.house.list(),
          propertiesAPI.commercial.list(),
        ])

        const allProperties = [...apartments, ...houses, ...commercials]
        searchResults = allProperties.filter(
          (property) => property.purpose === "RENT" && property.term_category === "SHORT",
        )
      } else {
        // Fetch properties for long-term or sale
        const data = await propertiesAPI.filterProperties({
          purchase_type: searchTerm === "long-term" ? "rent" : "sale",
        })
        searchResults = data.properties || []
      }

      // Format the results
      const formattedProperties = searchResults.map((property: any) => ({
        id: property.id?.toString() || "",
        title: property.title || "Untitled Property",
        price: `K${Number.parseFloat(
          property.rental_price || property.sale_price || property.price || 0,
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        address: property.address || "Unknown Address",
        rating: property.rating || 4.5,
        reviewCount: Math.floor(Math.random() * 2000) + 100, // Mock review count
        images:
          property.photos && property.photos.length > 0 ? property.photos : ["/placeholder.svg?height=200&width=350"],
        stars: Math.floor(property.rating || 4.5),
        cancellation: "Free cancellation",
        owner_id: property.owner_id?.toString() || null,
        contact: property.owner_phone_number || property.contact || "",
      }))

      setProperties(formattedProperties)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch search results:", err)
      setError("Failed to load search results. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleMapPress = () => {
    // Navigate to map view or show map modal
    console.log("Map button pressed")
    // router.push("/map-view")
  }

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <FontAwesome key={index} name="star" size={12} color="#FFD700" />
          ))}
      </View>
    )
  }

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <View style={styles.propertyCard}>
      <View style={styles.imageContainer}>
        <Image
          source={item.images[0].startsWith("http") ? { uri: item.images[0] } : { uri: item.images[0] }}
          style={styles.propertyImage}
        />
        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.actionIconButton}>
            <Ionicons name="heart-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconButton}>
            <Ionicons name="ellipsis-horizontal" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.propertyInfo}>
        <View style={styles.priceRatingRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{item.price}</Text>
            <Text style={styles.priceUnit}>
              {params.term === "short-term" ? "/night" : params.term === "long-term" ? "/month" : ""}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>
              {item.rating} ({item.reviewCount})
            </Text>
          </View>
        </View>

        <Text style={styles.propertyTitle}>{item.title}</Text>
        {renderStars(item.stars)}
        <Text style={styles.locationText}>{item.address}</Text>
        <Text style={styles.cancellationText}>{item.cancellation}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.reserveButton}>
            <Text style={styles.buttonText}>Reserve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
          <View style={styles.sortButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.loadingText}>Searching properties...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
          <View style={styles.sortButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSearchResults}>
            <Text style={styles.retryButtonText}>Try Again</Text>
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
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Results</Text>
        <TouchableOpacity style={styles.sortButton}>
          <MaterialIcons name="swap-vert" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={16} color="white" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Properties List */}
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties found for your search criteria</Text>
          </View>
        }
      />

      {/* Floating Map Button */}
      <TouchableOpacity style={styles.mapButton} onPress={handleMapPress}>
        <Ionicons name="map-outline" size={20} color="white" />
        <Text style={styles.mapButtonText}>Map</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="black" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="black" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="black" />
          <Text style={styles.navText}>Wishlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="black" />
          <Text style={styles.navText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SearchResultsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  sortButton: {
    padding: 8,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  propertyCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    top: 12,
    right: 12,
    flexDirection: "row",
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyInfo: {
    padding: 16,
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  priceUnit: {
    fontSize: 14,

// import { useEffect, useState } from "react"
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native"
// import { Ionicons, Feather } from "@expo/vector-icons"
// import { useLocalSearchParams, useNavigation } from "expo-router"
// import { propertiesAPI } from "@/services/propertiesApi" // Adjust path as needed

// interface Property {
//   id: number
//   title: string
//   price: string
//   number_of_rooms: number
//   size?: string
//   location: string
//   images?: string[]
//   [key: string]: any
// }

// const PropertySearchScreen = () => {
//   const params = useLocalSearchParams()
//   const [properties, setProperties] = useState<Property[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const navigation = useNavigation()

//   useEffect(() => {
//     navigation.setOptions({ title: "Results" })
//   }, [navigation])

//   // Parse search parameters
//   const searchTerm = params.term || "short-term"
//   const checkInDate = params.checkIn
//   const checkOutDate = params.checkOut

//   // Prepare API filters
//   const prepareFilters = () => {
//     const filters: Record<string, any> = {
//       purchase_type: searchTerm === "short-term" ? "rent" : "rent", // Adjust as needed
//       listing_type: searchTerm,
//     }

//     // Add date filters for short-term rentals
//     if (searchTerm === "short-term" && checkInDate && checkOutDate) {
//       filters.available_from = checkInDate
//       filters.available_to = checkOutDate
//     }

//     // Add other filters from params as needed
//     // if (params.guests) filters.min_guests = params.guests;
//     // if (params.priceRange) {
//     //   const [min, max] = JSON.parse(params.priceRange);
//     //   filters.min_price = min;
//     //   filters.max_price = max;
//     // }

//     return filters
//   }

//   // Fetch properties based on filters
//   const fetchProperties = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const filters = prepareFilters()

//       if (!propertiesAPI.filterProperties) {
//         console.error("filterProperties method is not defined in propertiesAPI")
//         throw new Error("API method not available")
//       }

//       const response = await propertiesAPI.filterProperties(filters)

//       // Transform API response to match your UI needs
//       const formattedProperties = Array.isArray(response) ? response : response.results || []

//       setProperties(formattedProperties)
//     } catch (err) {
//       console.error("Failed to fetch properties:", err)
//       setError("Failed to load properties. Please try again.")
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }

//   // Initial fetch
//   useEffect(() => {
//     const getFiltersFromParams = () => {
//       try {
//         if (params.filters) {
//           return JSON.parse(params.filters as string)
//         }
//         return prepareFilters()
//       } catch (error) {
//         console.error("Error parsing filters from params:", error)
//         return prepareFilters()
//       }
//     }

//     const fetchPropertiesWithFilters = async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const filters = getFiltersFromParams()
//         console.log("Fetching properties with filters:", filters)

//         if (!propertiesAPI.filterProperties) {
//           console.error("filterProperties method is not defined in propertiesAPI")
//           throw new Error("API method not available")
//         }

//         const response = await propertiesAPI.filterProperties(filters)

//         // Transform API response to match your UI needs
//         const formattedProperties = Array.isArray(response) ? response : response.results || []

//         setProperties(formattedProperties)
//       } catch (err) {
//         console.error("Failed to fetch properties:", err)
//         setError("Failed to load properties. Please try again.")
//       } finally {
//         setLoading(false)
//         setRefreshing(false)
//       }
//     }

//     fetchPropertiesWithFilters()
//   }, [params]) // Re-fetch when params change

//   // Handle refresh
//   const onRefresh = () => {
//     setRefreshing(true)
//     fetchProperties()
//   }

//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" style={styles.loader} />
//       </SafeAreaView>
//     )
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {searchTerm === "short-term" ? "Short Term Rentals" : "Long Term Rentals"}
//         </Text>
//         <View style={styles.trendIndicator}>
//           <Ionicons name="arrow-down" size={16} color="green" />
//           <Ionicons name="arrow-up" size={16} color="red" />
//         </View>
//       </View>

//       {/* Filter summary */}
//       <View style={styles.filterSummary}>
//         <Text style={styles.filterSummaryText}>
//           {checkInDate && checkOutDate
//             ? `${new Date(checkInDate).toLocaleDateString()} - ${new Date(checkOutDate).toLocaleDateString()}`
//             : searchTerm === "short-term"
//               ? "Select dates"
//               : "Available now"}
//         </Text>
//         <TouchableOpacity style={styles.filterButton}>
//           <Feather name="sliders" size={16} color="white" />
//           <Text style={styles.filterText}>Filter</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Property Listings */}
//       <ScrollView
//         style={styles.listingsContainer}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {properties.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyStateText}>No properties found matching your criteria</Text>
//             <TouchableOpacity
//               style={styles.modifySearchButton}
//               onPress={() => {
//                 /* Navigate back to search */
//               }}
//             >
//               <Text style={styles.modifySearchButtonText}>Modify Search</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           properties.map((property) => (
//             <View key={property.id} style={styles.propertyCard}>
//               <View style={styles.imageContainer}>
//                 {property.images?.[0] ? (
//                   <Image source={{ uri: property.images[0] }} style={styles.propertyImage} resizeMode="cover" />
//                 ) : (
//                   <View style={[styles.propertyImage, styles.noImage]}>
//                     <Feather name="image" size={40} color="#ccc" />
//                   </View>
//                 )}
//                 <View style={styles.imageActions}>
//                   <TouchableOpacity style={styles.iconButton}>
//                     <Ionicons name="heart-outline" size={24} color="black" />
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.iconButton}>
//                     <Feather name="more-horizontal" size={24} color="black" />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={styles.mapButton}>
//                   <Feather name="map" size={16} color="white" />
//                   <Text style={styles.mapText}>Map</Text>
//                 </View>
//               </View>

//               <View style={styles.propertyDetails}>
//                 <Text style={styles.propertyPrice}>{property.price}</Text>
//                 <Text style={styles.propertyInfo}>
//                   {property.number_of_rooms} {property.number_of_rooms > 1 ? "rooms" : "room"}
//                   {property.size && `, ${property.size}`}
//                 </Text>
//                 <Text style={styles.propertyLocation}>{property.location || property.address}</Text>

//                 <View style={styles.actionButtons}>
//                   <TouchableOpacity style={styles.callButton}>
//                     <Text style={styles.buttonText}>Call</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.messageButton}>
//                     <Text style={styles.buttonText}>Message</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   trendIndicator: {
//     flexDirection: "row",
//   },
//   filterContainer: {
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },
//   filterButton: {
//     backgroundColor: "#333",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     width: 80,
//   },
//   filterText: {
//     color: "white",
//     marginLeft: 8,
//     fontSize: 14,
//   },
//   listingsContainer: {
//     flex: 1,
//   },
//   propertyCard: {
//     marginBottom: 16,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   propertyImage: {
//     width: "100%",
//     height: 200,
//   },
//   imageActions: {
//     position: "absolute",
//     top: 8,
//     right: 8,
//     flexDirection: "row",
//   },
//   iconButton: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 6,
//     marginLeft: 8,
//   },
//   mapButton: {
//     position: "absolute",
//     bottom: 8,
//     left: 8,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   mapText: {
//     color: "white",
//     marginLeft: 4,
//     fontSize: 12,
//   },
//   propertyDetails: {
//     padding: 16,
//   },
//   propertyPrice: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   propertyInfo: {
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   propertyLocation: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 16,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   callButton: {
//     backgroundColor: "#00a651",
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   messageButton: {
//     backgroundColor: "#00a651",
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingVertical: 8,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#ff4444",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   retryButton: {
//     backgroundColor: "#00a651",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//   },
//   retryButtonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 40,
//   },
//   emptyStateText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modifySearchButton: {
//     backgroundColor: "#00a651",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//   },
//   modifySearchButtonText: {
//     color: "white",
//     fontWeight: "500",
//   },
//   noImage: {
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// })

// export default PropertySearchScreen

    color: "#666",
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "black",
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  cancellationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reserveButton: {
    backgroundColor: "#22C55E",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  messageButton: {
    backgroundColor: "#22C55E",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  mapButton: {
    position: "absolute",
    bottom: 120,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mapButtonText: {
    color: "white",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 8,
    backgroundColor: "white",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#22C55E",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})
