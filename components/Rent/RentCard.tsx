// "use client"

// import { useEffect, useState, useCallback } from "react"
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   Linking,
// } from "react-native"
// import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
// import { useNavigation, useRouter } from "expo-router"
// import { propertiesAPI } from "@/services/propertiesApi"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { messagingAPI } from "@/services/messaging"

// interface Property {
//   id: number
//   title: string
//   description: string
//   address: string
//   photos?: PropertyPhoto[]
//   price?: number
//   rental_price?: number
//   sale_price?: number
//   rating?: number
//   bedroom_count?: number
//   bathroom_count?: number
//   property_type: "COMMERCIAL" | "LODGE_HOTEL" | "APARTMENT" | "HOUSE" | "BOARDING"
//   purpose: "RENT" | "BUY" | "RENT_BUY"
//   term_category: "SHORT" | "LONG"
//   has_pool?: boolean
//   garden?: "PRIVATE" | "COMMON" | "NO"
//   security?: boolean
//   contact?: string
//   owner_id?: string | null // Add this field
//   lister?: {
//     id: number
//     name: string
//     phone_number: string
//     profileImage?: string
//   }
// }

// interface PropertyPhoto {
//   id?: number
//   image: string
//   caption?: string
//   is_primary: boolean
// }

// const RentListingScreen = () => {
//   const [properties, setProperties] = useState<Property[]>([])
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [reserving, setReserving] = useState<number | null>(null)
//   const [activeTab, setActiveTab] = useState<"ALL" | "SHORT" | "LONG">("ALL")
//   const navigation = useNavigation()
//   const router = useRouter()

//   useEffect(() => {
//     navigation.setOptions({ headerShown: false })
//   }, [navigation])

//   const fetchProperties = useCallback(async () => {
//     try {
//       // Fetch properties from all categories that support rental
//       const [apartments, houses, commercials] = await Promise.all([
//         propertiesAPI.apartment.list(),
//         propertiesAPI.house.list(),
//         propertiesAPI.commercial.list(),
//       ])

//       // Combine all properties and filter for rentals
//       const allProperties = [...apartments, ...houses, ...commercials]
//       const formattedProperties = allProperties
//         .filter((property) => property.purpose === "RENT" || property.purpose === "RENT_BUY")
//         .map((property) => ({
//           id: property.id,
//           title: property.title,
//           description: property.description || "No description available",
//           address: property.address,
//           photos: property.photos || [],
//           rental_price: property.price || property.rental_price || 0,
//           rating: property.rating || 0,
//           bedroom_count: property.bedroom_count || 0,
//           bathroom_count: property.bathroom_count || 0,
//           property_type: property.property_type,
//           purpose: property.purpose,
//           term_category: property.term_category || "LONG",
//           has_pool: property.has_pool || false,
//           garden: property.garden || "NO",
//           security: property.security || false,
//           // Updated contact handling to match buy screen pattern
//           contact: property.lister?.phone_number || property.owner_phone_number || property.contact || "",
//           // Add owner_id field to match buy screen structure
//           owner_id: property.lister?.id?.toString() || property.owner_id?.toString() || null,
//           lister: {
//             ...property.lister,
//             // Ensure phone_number is available at lister level
//             phone_number: property.lister?.phone_number || property.owner_phone_number || property.contact || "",
//             // Ensure id is available
//             id: property.lister?.id || property.owner_id || null,
//           },
//           features: [
//             `${property.bedroom_count || 0} bed`,
//             `${property.bathroom_count || 0} bath`,
//             ...(property.has_pool ? ["Pool"] : []),
//             ...(property.garden && property.garden !== "NO" ? ["Garden"] : []),
//             ...(property.security ? ["Security"] : []),
//           ],
//         }))

//       setProperties(formattedProperties)
//       setError(null)
//     } catch (err) {
//       console.error("Failed to fetch properties:", err)
//       setError("Failed to load properties. Please try again.")
//     } finally {
//       setLoading(false)
//       setRefreshing(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchProperties()
//   }, [fetchProperties])

//   const handleRefresh = useCallback(() => {
//     setRefreshing(true)
//     fetchProperties()
//   }, [fetchProperties])

//   const handleGoBack = useCallback(() => {
//     router.back()
//   }, [router])

//   // Updated handleCallOwner to match buy screen functionality
//   const handleCallOwner = useCallback((phoneNumber: string, propertyId: number) => {
//     if (phoneNumber) {
//       Linking.openURL(`tel:${phoneNumber}`)
//     } else {
//       console.warn("Contact number is missing for property ID:", propertyId)
//     }
//   }, [])

//   const handleReserve = (propertyId: number) => {
//     const property = properties.find((p) => p.id === propertyId)
//     if (!property) return

//     router.push({
//       pathname: "/reserve",
//       params: {
//         propertyId: property.id?.toString(),
//         propertyType: property.property_type?.toLowerCase() || "apartment",
//       },
//     })
//   }

//   const handleMessagePress = async (property: Property) => {
//     // Check for owner_id from multiple sources
//     const ownerId = property.owner_id || property.lister?.id?.toString()

//     if (!ownerId) {
//       Alert.alert("Error", "Owner information not available")
//       return
//     }

//     try {
//       // Get current user ID (ensure it's a number)
//       const currentUserId = Number(await AsyncStorage.getItem("user_id"))
//       const ownerIdNumber = Number(ownerId)

//       if (!currentUserId || !ownerIdNumber) {
//         Alert.alert("Error", "User information not available")
//         return
//       }

//       console.log("Starting conversation between:", currentUserId, ownerIdNumber)

//       // Create or get thread
//       const thread = await messagingAPI.createOrGetThread(currentUserId, ownerIdNumber)

//       // Prepare property details to pass to chat
//       const propertyDetails = {
//         id: property.id.toString(),
//         title: property.title,
//         price:
//           property.rental_price != null
//             ? `K${property.rental_price}`
//             : property.price != null
//               ? `K${property.price.toFixed(2)}`
//               : "Price on request",
//         address: property.address,
//         number_of_rooms: property.bedroom_count || 0,
//         number_of_bathrooms: property.bathroom_count || 0,
//         image: property.photos && property.photos.length > 0 ? property.photos[0].image : null,
//       }

//       // Navigate to chat screen with property details
//       router.push({
//         pathname: "/chat",
//         params: {
//           threadId: thread.id.toString(),
//           userId: ownerIdNumber.toString(),
//           propertyId: property.id.toString(),
//           userName: property.lister?.name || "Property Owner",
//           propertyDetails: JSON.stringify(propertyDetails),
//         },
//       })
//     } catch (error) {
//       console.error("Error starting conversation:", error)
//       Alert.alert("Error", "Failed to start conversation. Please try again.")
//     }
//   }

//   const filteredProperties = properties.filter((property) => {
//     if (activeTab === "ALL") return true
//     return property.term_category === activeTab
//   })

//   const renderActionButton = (property: Property) => {
//     if (property.term_category === "SHORT") {
//       return (
//         <TouchableOpacity
//           style={styles.reserveButton}
//           onPress={() => handleReserve(property.id)}
//           disabled={reserving === property.id}
//         >
//           {reserving === property.id ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text style={styles.reserveButtonText}>Reserve</Text>
//           )}
//         </TouchableOpacity>
//       )
//     } else {
//       return (
//         <TouchableOpacity
//           style={styles.callButton}
//           onPress={() => handleCallOwner(property.contact || property.lister?.phone_number || "", property.id)}
//         >
//           <Ionicons name="call-outline" size={16} color="white" />
//           <Text style={styles.callButtonText}>Call</Text>
//         </TouchableOpacity>
//       )
//     }
//   }

//   const renderStars = useCallback((count: number) => {
//     const stars = []
//     const fullStars = Math.floor(count)
//     const hasHalfStar = count % 1 >= 0.5

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<FontAwesome key={`star-${i}`} name="star" size={12} color="black" />)
//     }

//     if (hasHalfStar) {
//       stars.push(<FontAwesome key="star-half" name="star-half-full" size={12} color="black" />)
//     }

//     return <View style={styles.starsContainer}>{stars}</View>
//   }, [])

//   const renderPropertyItem = useCallback(
//     ({ item }: { item: Property }) => (
//       <View style={styles.hotelCard}>
//         <View style={styles.imageContainer}>
//           <Image
//             source={item.photos?.[0]?.image ? { uri: item.photos[0].image } : require("@/assets/appartments/1.jpg")}
//             style={styles.hotelImage}
//             resizeMode="cover"
//           />
//         </View>

//         <View style={styles.hotelInfo}>
//           <View style={styles.priceRatingRow}>
//             <Text style={styles.priceText}>
//               {item.rental_price != null
//                 ? `K${item.rental_price}`
//                 : item.price != null
//                   ? `K${item.price.toFixed(2)}`
//                   : "Price on request"}
//               {item.term_category === "SHORT" && <Text style={styles.priceUnit}>/night</Text>}
//               {item.term_category === "LONG" && <Text style={styles.priceUnit}>/month</Text>}
//             </Text>
//             <View style={styles.ratingContainer}>
//               {renderStars(item.rating || 0)}
//               <Text style={styles.ratingText}>{(item.rating || 0).toFixed(1)}</Text>
//             </View>
//           </View>

//           <Text style={styles.hotelName} numberOfLines={1}>
//             {item.title}
//           </Text>
//           <Text style={styles.locationText} numberOfLines={1}>
//             {item.address}
//           </Text>
//           {item.features && item.features.length > 0 && (
//             <Text style={styles.featuresText} numberOfLines={1}>
//               {item.features.join(" • ")}
//             </Text>
//           )}

//           <View style={styles.actionButtons}>
//             {renderActionButton(item)}
//             <TouchableOpacity
//               style={styles.messageButton}
//               onPress={() => handleMessagePress(item)}
//               disabled={reserving === item.id}
//             >
//               <Text style={styles.messageButtonText}>Message</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     ),
//     [reserving, renderStars],
//   )

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     )
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Text style={styles.backText}>Go Back</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Rental Properties</Text>
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.sortButton}>
//             <MaterialIcons name="swap-vert" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.filterBar}>
//           <TouchableOpacity style={styles.filterButton}>
//             <Ionicons name="options-outline" size={16} color="white" />
//             <Text style={styles.filterButtonText}>Filter</Text>
//           </TouchableOpacity>
//       </View>

//       <FlatList
//         data={filteredProperties}
//         renderItem={renderPropertyItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#00a651"]} tintColor="#00a651" />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No properties available</Text>
//             <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
//               <Text style={styles.retryButtonText}>Refresh</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />
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
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     height: 56,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//     marginTop: 28,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   headerRight: {
//     flexDirection: "row",
//   },
//   sortButton: {
//     padding: 8,
//   },
//   listContainer: {
//     padding: 16,
//   },
//   hotelCard: {
//     marginBottom: 24,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "white",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   hotelImage: {
//     width: "100%",
//     height: 200,
//   },
//   hotelInfo: {
//     padding: 16,
//   },
//   priceRatingRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   priceText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   priceUnit: {
//     fontSize: 14,
//     fontWeight: "normal",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
//   },
//   hotelName: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   starsContainer: {
//     flexDirection: "row",
//   },
//   locationText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//   },
//   featuresText: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 12,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   callButton: {
//     backgroundColor: "#00a651",
//     borderRadius: 8,
//     paddingVertical: 12,
//     flex: 1,
//     marginRight: 8,
//     alignItems: "center",
//     flexDirection: "row",
//     justifyContent: "center",
//   },

//    filterBar: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   filterButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#333",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   filterButtonText: {
//     color: "white",
//     marginLeft: 4,
//     fontWeight: "500",
//   },
//   callButtonText: {
//     color: "white",
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   reserveButton: {
//     backgroundColor: "#00a651",
//     borderRadius: 8,
//     paddingVertical: 12,
//     flex: 1,
//     marginRight: 8,
//     alignItems: "center",
//   },
//   reserveButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   messageButton: {
//     backgroundColor: "#00a651",
//     borderRadius: 8,
//     paddingVertical: 12,
//     flex: 1,
//     marginLeft: 8,
//     alignItems: "center",
//   },
//   messageButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   loadingContainer: {
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
//     color: "red",
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   backText: {
//     color: "#00a651",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#666",
//   },
//   retryButton: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: "#00a651",
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   retryButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },
// })

// export default RentListingScreen
"use client"
import { useEffect, useState, useCallback } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
  Modal, // Import Modal
} from "react-native"
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import { propertiesAPI } from "@/services/propertiesApi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { messagingAPI } from "@/services/messaging"
import FilterScreen from "@/components/Explore/Filters" // Import FilterScreen

interface Property {
  id: number
  title: string
  description: string
  address: string
  photos?: PropertyPhoto[]
  price?: number
  rental_price?: number
  sale_price?: number
  rating?: number
  bedroom_count?: number
  bathroom_count?: number
  property_type: "COMMERCIAL" | "LODGE_HOTEL" | "APARTMENT" | "HOUSE" | "BOARDING"
  purpose: "RENT" | "BUY" | "RENT_BUY"
  term_category: "SHORT" | "LONG"
  has_pool?: boolean
  garden?: "PRIVATE" | "COMMON" | "NO"
  security?: boolean
  contact?: string
  owner_id?: string | null // Add this field
  lister?: {
    id: number
    name: string
    phone_number: string
    profileImage?: string
  }
}

interface PropertyPhoto {
  id?: number
  image: string
  caption?: string
  is_primary: boolean
}

const RentListingScreen = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reserving, setReserving] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"ALL" | "SHORT" | "LONG">("ALL")
  const [filterModalVisible, setFilterModalVisible] = useState(false) // New state for modal visibility
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]) // New state for filtered properties

  const navigation = useNavigation()
  const router = useRouter()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch properties from all categories that support rental
      const [apartments, houses, commercials] = await Promise.all([
        propertiesAPI.apartment.list(),
        propertiesAPI.house.list(),
        propertiesAPI.commercial.list(),
      ])

      // Combine all properties and filter for rentals
      const allProperties = [...apartments, ...houses, ...commercials]
      const formattedProperties = allProperties
        .filter((property) => property.purpose === "RENT" || property.purpose === "RENT_BUY")
        .map((property) => ({
          id: property.id,
          title: property.title,
          description: property.description || "No description available",
          address: property.address,
          photos: property.photos || [],
          rental_price: property.price || property.rental_price || 0,
          rating: property.rating || 0,
          bedroom_count: property.bedroom_count || 0,
          bathroom_count: property.bathroom_count || 0,
          property_type: property.property_type,
          purpose: property.purpose,
          term_category: property.term_category || "LONG",
          has_pool: property.has_pool || false,
          garden: property.garden || "NO",
          security: property.security || false,
          // Updated contact handling to match buy screen pattern
          contact: property.lister?.phone_number || property.owner_phone_number || property.contact || "",
          // Add owner_id field to match buy screen structure
          owner_id: property.lister?.id?.toString() || property.owner_id?.toString() || null,
          lister: {
            ...property.lister,
            // Ensure phone_number is available at lister level
            phone_number: property.lister?.phone_number || property.owner_phone_number || property.contact || "",
            // Ensure id is available
            id: property.lister?.id || property.owner_id || null,
          },
          features: [
            `${property.bedroom_count || 0} bed`,
            `${property.bathroom_count || 0} bath`,
            ...(property.has_pool ? ["Pool"] : []),
            ...(property.garden && property.garden !== "NO" ? ["Garden"] : []),
            ...(property.security ? ["Security"] : []),
          ],
        }))
      setProperties(formattedProperties)
      // Initialize filteredProperties with all properties
      setFilteredProperties(formattedProperties)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch properties:", err)
      setError("Failed to load properties. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchProperties()
  }, [fetchProperties])

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  // Updated handleCallOwner to match buy screen functionality
  const handleCallOwner = useCallback((phoneNumber: string, propertyId: number) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`)
    } else {
      console.warn("Contact number is missing for property ID:", propertyId)
    }
  }, [])

  const handleReserve = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId)
    if (!property) return
    router.push({
      pathname: "/reserve",
      params: {
        propertyId: property.id?.toString(),
        propertyType: property.property_type?.toLowerCase() || "apartment",
      },
    })
  }

  const handleMessagePress = async (property: Property) => {
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
              ? `K${property.price.toFixed(2)}`
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

  // This filter logic will now apply to the `properties` state, and `filteredProperties` will be updated by the modal
  const displayProperties = filteredProperties.filter((property) => {
    if (activeTab === "ALL") return true
    return property.term_category === activeTab
  })

  // New functions for modal control and filter application
  const handleFilterApply = (newFilteredProperties: Property[]) => {
    setFilteredProperties(newFilteredProperties)
    setFilterModalVisible(false)
  }

  const handleFilterClose = () => {
    setFilterModalVisible(false)
  }

  const renderActionButton = (property: Property) => {
    if (property.term_category === "SHORT") {
      return (
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => handleReserve(property.id)}
          disabled={reserving === property.id}
        >
          {reserving === property.id ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.reserveButtonText}>Reserve</Text>
          )}
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCallOwner(property.contact || property.lister?.phone_number || "", property.id)}
        >
          <Ionicons name="call-outline" size={16} color="white" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      )
    }
  }

  const renderStars = useCallback((count: number) => {
    const stars = []
    const fullStars = Math.floor(count)
    const hasHalfStar = count % 1 >= 0.5
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name="star" size={12} color="black" />)
    }
    if (hasHalfStar) {
      stars.push(<FontAwesome key="star-half" name="star-half-full" size={12} color="black" />)
    }
    return <View style={styles.starsContainer}>{stars}</View>
  }, [])

  const renderPropertyItem = useCallback(
    ({ item }: { item: Property }) => (
      <View style={styles.hotelCard}>
        <View style={styles.imageContainer}>
          <Image
            source={item.photos?.[0]?.image ? { uri: item.photos[0].image } : require("@/assets/appartments/1.jpg")}
            style={styles.hotelImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.hotelInfo}>
          <View style={styles.priceRatingRow}>
            <Text style={styles.priceText}>
              {item.rental_price != null
                ? `K${item.rental_price}`
                : item.price != null
                  ? `K${item.price.toFixed(2)}`
                  : "Price on request"}
              {item.term_category === "SHORT" && <Text style={styles.priceUnit}>/night</Text>}
              {item.term_category === "LONG" && <Text style={styles.priceUnit}>/month</Text>}
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(item.rating || 0)}
              <Text style={styles.ratingText}>{(item.rating || 0).toFixed(1)}</Text>
            </View>
          </View>
          <Text style={styles.hotelName} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            {item.address}
          </Text>
          {item.features && item.features.length > 0 && (
            <Text style={styles.featuresText} numberOfLines={1}>
              {item.features.join(" • ")}
            </Text>
          )}
          <View style={styles.actionButtons}>
            {renderActionButton(item)}
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => handleMessagePress(item)}
              disabled={reserving === item.id}
            >
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [reserving, renderStars],
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rental Properties</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.sortButton}>
            <MaterialIcons name="swap-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={16} color="white" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={displayProperties} // Use displayProperties which is filtered by activeTab
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#00a651"]} tintColor="#00a651" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleFilterClose}
      >
        {/* Pass original properties to FilterScreen for filtering */}
        <FilterScreen properties={properties} onApply={handleFilterApply} onClose={handleFilterClose} />
      </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginTop: 28,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
  },
  sortButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  hotelCard: {
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
  hotelImage: {
    width: "100%",
    height: 200,
  },
  hotelInfo: {
    padding: 16,
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "normal",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  featuresText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    backgroundColor: "#00a651",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#424242", // Dark gray color from the image
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: "white",
    marginLeft: 6, // Space between icon and text
    fontWeight: "600", // Font weight from the image
  },
  callButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  reserveButton: {
    backgroundColor: "#00a651",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  reserveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  messageButton: {
    backgroundColor: "#00a651",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: "white",
    fontWeight: "600",
  },
  loadingContainer: {
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
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  backText: {
    color: "#00a651",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#00a651",
    borderRadius: 8,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
})

export default RentListingScreen
