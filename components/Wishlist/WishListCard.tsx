// "use client"

// import { useEffect, useState } from "react"
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
//   Alert,
// } from "react-native"
// import { useNavigation, useRouter } from "expo-router"
// import { wishlistService } from "@/services/wishlistAPI"
// import { Ionicons } from "@expo/vector-icons"
// import { messagingAPI } from "@/services/messaging"
// import AsyncStorage from "@react-native-async-storage/async-storage"

// interface Property {
//   id?: string
//   title?: string
//   price?: number | string
//   address?: string
//   rating?: number
//   images?: string[] | null
//   number_of_bedrooms?: number
//   number_of_bathrooms?: number
//   purchase_type?: "rent" | "sale"
//   property_type?: string
//   owner_id?: string | null
//   lister?: {
//     id?: string | number
//     name?: string
//     profileImage?: string
//     phone_number?: string
//   }
// }

// const WishListCard = () => {
//   const navigation = useNavigation()
//   const router = useRouter()
//   const [properties, setProperties] = useState<Property[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     navigation.setOptions({ title: "Wishlist" })
//     fetchWishlistProperties()
//   }, [navigation])

//   const fetchWishlistProperties = async () => {
//     try {
//       setLoading(true)
//       const wishlistItems = await wishlistService.getWishlist()
//       console.log("Raw wishlistItems from API:", wishlistItems)

//       const mapped = wishlistItems.map((item: any) => {
//         const property = item.property || item
//         console.log("Raw property object:", property) // Debug log

//         // Extract owner information from multiple possible sources
//         const ownerId =
//           property.owner_id?.toString() ||
//           property.lister?.id?.toString() ||
//           property.user_id?.toString() ||
//           property.created_by?.toString() ||
//           item.user_id?.toString() ||
//           item.owner_id?.toString() ||
//           null

//         console.log("Extracted owner ID for property", property.id, ":", ownerId)

//         return {
//           id: property.id?.toString() ?? "unknown",
//           title: property.title ?? "Untitled Property",
//           price: property.price ?? property.rental_price ?? property.sale_price ?? 0,
//           address: property.address ?? "Unknown Address",
//           rating: property.rating ?? 0,
//           images: property.photos ?? property.images ?? [],
//           number_of_bedrooms: property.bedroom_count ?? property.number_of_bedrooms ?? 0,
//           number_of_bathrooms: property.bathroom_count ?? property.number_of_bathrooms ?? 0,
//           purchase_type: property.purchase_type ?? "rent",
//           property_type: property.property_type,
//           owner_id: ownerId,
//           lister: {
//             id: ownerId,
//             name:
//               property.lister?.name || property.owner_name || property.user_name || item.user_name || "Property Owner",
//             profileImage: property.lister?.profileImage || property.owner_image || null,
//             phone_number: property.lister?.phone_number || property.owner_phone_number || property.contact || "",
//           },
//         }
//       })

//       console.log("Mapped properties:", mapped)
//       setProperties(mapped)
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch wishlist")
//       console.error("Fetch wishlist error:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleMessage = async (item: Property) => {
//     console.log("handleMessage called with item:", item)

//     try {
//       const userId = await AsyncStorage.getItem("user_id")
//       if (!userId) {
//         Alert.alert("Login Required", "Please login to message the owner", [
//           { text: "Cancel", style: "cancel" },
//           { text: "Login", onPress: () => router.push("/authentication/signin") },
//         ])
//         return
//       }

//       // Check for owner information from multiple sources
//       const ownerId = item.owner_id || item.lister?.id?.toString()

//       console.log("Owner ID found:", ownerId)

//       if (!ownerId) {
//         Alert.alert("Error", "No owner information found for this property.")
//         return
//       }

//       if (ownerId.toString() === userId) {
//         Alert.alert("Notice", "You cannot message yourself about your own property")
//         return
//       }

//       // Ensure owner ID is a number
//       const ownerIdNum = typeof ownerId === "string" ? Number.parseInt(ownerId, 10) : Number(ownerId)
//       if (!ownerIdNum || isNaN(ownerIdNum)) {
//         Alert.alert("Error", "Invalid owner information for this property.")
//         return
//       }

//       console.log("Creating thread between user", userId, "and owner", ownerIdNum)

//       // Create or get thread using messagingAPI
//       const thread = await messagingAPI.createOrGetThread(Number(userId), ownerIdNum)

//       if (!thread?.id) throw new Error("Failed to create conversation thread")

//       console.log("Thread created:", thread)

//       // Navigate to chat screen with property details
//       router.push({
//         pathname: "/chat",
//         params: {
//           threadId: thread.id.toString(),
//           userId: ownerIdNum.toString(),
//           propertyId: item.id || "",
//           userName: item.lister?.name || "Property Owner",
//           propertyDetails: JSON.stringify({
//             id: item.id || "",
//             title: item.title || "Untitled Property",
//             price: item.price != null ? `K${item.price}` : "Price on request",
//             address: item.address || "Unknown Address",
//             number_of_rooms: item.number_of_bedrooms || 0,
//             number_of_bathrooms: item.number_of_bathrooms || 0,
//             image: item.images && item.images.length > 0 ? item.images[0] : null,
//           }),
//         },
//       })
//     } catch (error) {
//       console.error("Conversation error:", error)
//       Alert.alert("Error", error instanceof Error ? error.message : "Failed to start conversation. Please try again.")
//     }
//   }

//   const renderPropertyItem = ({ item }: { item: Property }) => (
//     <View style={styles.card}>
//       <View style={styles.imageContainer}>
//         <Image
//           source={
//             item.images && item.images.length > 0 ? { uri: item.images[0] } : require("@/assets/appartments/1.jpg")
//           }
//           style={styles.image}
//         />
//         <TouchableOpacity style={styles.heartIcon}>
//           <Ionicons name="heart" size={20} color="#22C55E" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.moreIcon}>
//           <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.infoContainer}>
//         <View style={styles.priceRatingRow}>
//           <View style={styles.priceContainer}>
//             <Text style={styles.price}>K{String(item.price ?? 0)}</Text>
//             <Text style={styles.priceUnit}>/night</Text>
//           </View>
//           {typeof item.rating === "number" && !isNaN(item.rating) && (
//             <View style={styles.ratingContainer}>
//               <Ionicons name="star" size={14} color="#F59E0B" />
//               <Text style={styles.rating}>{item.rating.toFixed(1)} (1899)</Text>
//             </View>
//           )}
//         </View>

//         <Text style={styles.name}>
//           {typeof item.title === "string" || typeof item.title === "number" ? item.title : "Untitled Property"}
//         </Text>

//         <View style={styles.starsContainer}>
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Ionicons key={star} name="star" size={12} color="#22C55E" />
//           ))}
//         </View>

//         <Text style={styles.location}>
//           {typeof item.address === "string" || typeof item.address === "number" ? item.address : "Unknown Address"}
//         </Text>

//         <Text style={styles.cancellation}>Free cancellation</Text>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.reserveButton}
//             onPress={() =>
//               router.push({
//                 pathname: "/reserve",
//                 params: {
//                   propertyId: item.id?.toString(),
//                   propertyType: item.property_type?.toLowerCase() || "apartment",
//                 },
//               })
//             }
//           >
//             <Text style={styles.buttonText}>Reserve</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(item)}>
//             <Text style={styles.buttonText}>Message</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   )

//   useEffect(() => {
//     console.log("Properties passed to FlatList:", properties)
//   }, [properties])

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#22C55E" />
//       </View>
//     )
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={fetchWishlistProperties} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={properties.filter((p) => typeof p === "object" && p !== null)}
//         keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
//         renderItem={renderPropertyItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContainer}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>Your wishlist is empty</Text>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   )
// }

// export default WishListCard

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   listContainer: {
//     padding: 16,
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
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   retryButton: {
//     backgroundColor: "#22C55E",
//     padding: 10,
//     borderRadius: 8,
//     width: 100,
//     alignItems: "center",
//   },
//   retryButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#6B7280",
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   heartIcon: {
//     position: "absolute",
//     top: 12,
//     right: 50,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   moreIcon: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   infoContainer: {
//     padding: 16,
//   },
//   priceRatingRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "baseline",
//   },
//   price: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   priceUnit: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginLeft: 2,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rating: {
//     fontSize: 14,
//     color: "#374151",
//     marginLeft: 4,
//     fontWeight: "500",
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   starsContainer: {
//     flexDirection: "row",
//     marginBottom: 4,
//   },
//   location: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   cancellation: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 16,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   reserveButton: {
//     backgroundColor: "#22C55E",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: "center",
//   },
//   messageButton: {
//     backgroundColor: "#22C55E",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// })


"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native"
import { useNavigation, useRouter } from "expo-router"
import { wishlistService } from "@/services/wishlistAPI"
import { propertiesAPI } from "@/services/propertiesApi"
import { Ionicons } from "@expo/vector-icons"
import { messagingAPI } from "@/services/messaging"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MapFloatingButton } from "@/components/ui/MapFloatingButton"

interface Property {
  id?: string
  title?: string
  price?: number | string
  address?: string
  rating?: number
  images?: string[] | null
  number_of_bedrooms?: number
  number_of_bathrooms?: number
  purchase_type?: "rent" | "sale"
  property_type?: string
  owner_id?: string | null
  contact?: string
  lister?: {
    id?: string | number
    name?: string
    profileImage?: string
    phone_number?: string
  }
}

const WishListCard = () => {
  const navigation = useNavigation()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    navigation.setOptions({ title: "Wishlist" })
    fetchWishlistProperties()
  }, [navigation])

  const fetchPropertyDetails = async (propertyId: string, purchaseType: string) => {
    try {
      // Fetch full property details from the properties API
      let propertyData = null

      if (purchaseType === "sale") {
        // For sale properties, use the filter method like in buy screen
        const data = await propertiesAPI.filterProperties({ purchase_type: "sale" })
        propertyData = data.properties?.find((p: any) => p.id?.toString() === propertyId)
      } else {
        // For rental properties, try different property types
        try {
          const [apartments, houses, commercials] = await Promise.all([
            propertiesAPI.apartment.list(),
            propertiesAPI.house.list(),
            propertiesAPI.commercial.list(),
          ])

          const allProperties = [...apartments, ...houses, ...commercials]
          propertyData = allProperties.find((p: any) => p.id?.toString() === propertyId)
        } catch (err) {
          console.log("Error fetching rental properties:", err)
        }
      }

      return propertyData
    } catch (error) {
      console.error(`Error fetching property details for ${propertyId}:`, error)
      return null
    }
  }

  const fetchWishlistProperties = async () => {
    try {
      setLoading(true)
      const wishlistItems = await wishlistService.getWishlist()
      console.log("Raw wishlistItems from API:", wishlistItems)

      // Fetch full property details for each wishlist item
      const propertiesWithDetails = await Promise.all(
        wishlistItems.map(async (item: any) => {
          const property = item.property || item
          const propertyId = property.id?.toString()
          const purchaseType = property.purchase_type || item.purchase_type || "rent"

          console.log(`Fetching details for property ${propertyId} with type ${purchaseType}`)

          // Fetch full property details from backend
          const fullPropertyData = await fetchPropertyDetails(propertyId, purchaseType)

          if (fullPropertyData) {
            console.log(`Full property data for ${propertyId}:`, fullPropertyData)

            // Map the full property data like in buy/rent screens
            return {
              id: fullPropertyData.id?.toString() ?? propertyId,
              title: fullPropertyData.title ?? property.title ?? "Untitled Property",
              price:
                purchaseType === "sale"
                  ? fullPropertyData.sale_price || fullPropertyData.price || property.price || 0
                  : fullPropertyData.rental_price || fullPropertyData.price || property.price || 0,
              address: fullPropertyData.address ?? property.address ?? "Unknown Address",
              rating: fullPropertyData.rating ?? property.rating ?? 0,
              images: fullPropertyData.photos ?? property.photos ?? property.images ?? [],
              number_of_bedrooms: fullPropertyData.bedroom_count ?? property.bedroom_count ?? 0,
              number_of_bathrooms: fullPropertyData.bathroom_count ?? property.bathroom_count ?? 0,
              purchase_type: purchaseType,
              property_type: fullPropertyData.property_type ?? property.property_type,
              // Extract owner information from full property data
              owner_id: fullPropertyData.owner_id?.toString() ?? fullPropertyData.lister?.id?.toString() ?? null,
              contact:
                fullPropertyData.owner_phone_number ??
                fullPropertyData.contact ??
                fullPropertyData.lister?.phone_number ??
                "",
              lister: {
                id: fullPropertyData.owner_id ?? fullPropertyData.lister?.id ?? null,
                name: fullPropertyData.lister?.name ?? fullPropertyData.owner_name ?? "Property Owner",
                profileImage: fullPropertyData.lister?.profileImage ?? null,
                phone_number:
                  fullPropertyData.owner_phone_number ??
                  fullPropertyData.contact ??
                  fullPropertyData.lister?.phone_number ??
                  "",
              },
            }
          } else {
            // Fallback to wishlist data if full property data is not available
            console.log(`Could not fetch full data for property ${propertyId}, using wishlist data`)
            return {
              id: propertyId ?? "unknown",
              title: property.title ?? "Untitled Property",
              price: property.price ?? 0,
              address: property.address ?? "Unknown Address",
              rating: property.rating ?? 0,
              images: property.photos ?? property.images ?? [],
              number_of_bedrooms: property.bedroom_count ?? 0,
              number_of_bathrooms: property.bathroom_count ?? 0,
              purchase_type: purchaseType,
              property_type: property.property_type,
              owner_id: null, // No owner info available
              contact: "",
              lister: null,
            }
          }
        }),
      )

      console.log("Properties with full details:", propertiesWithDetails)
      setProperties(propertiesWithDetails.filter((p) => p !== null))
    } catch (err: any) {
      setError(err.message || "Failed to fetch wishlist")
      console.error("Fetch wishlist error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = async (item: Property) => {
    console.log("handleMessage called with item:", item)

    try {
      const userId = await AsyncStorage.getItem("user_id")
      if (!userId) {
        Alert.alert("Login Required", "Please login to message the owner", [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/authentication/signin") },
        ])
        return
      }

      // Check for owner information
      const ownerId = item.owner_id || item.lister?.id?.toString()

      console.log("Owner ID found:", ownerId)

      if (!ownerId) {
        Alert.alert("Error", "Owner information not available for this property.")
        return
      }

      if (ownerId.toString() === userId) {
        Alert.alert("Notice", "You cannot message yourself about your own property")
        return
      }

      // Ensure owner ID is a number
      const ownerIdNum = typeof ownerId === "string" ? Number.parseInt(ownerId, 10) : Number(ownerId)
      if (!ownerIdNum || isNaN(ownerIdNum)) {
        Alert.alert("Error", "Invalid owner information for this property.")
        return
      }

      console.log("Creating thread between user", userId, "and owner", ownerIdNum)

      // Create or get thread using messagingAPI
      const thread = await messagingAPI.createOrGetThread(Number(userId), ownerIdNum)

      if (!thread?.id) throw new Error("Failed to create conversation thread")

      console.log("Thread created:", thread)

      // Navigate to chat screen with property details
      router.push({
        pathname: "/chat",
        params: {
          threadId: thread.id.toString(),
          userId: ownerIdNum.toString(),
          propertyId: item.id || "",
          userName: item.lister?.name || "Property Owner",
          propertyDetails: JSON.stringify({
            id: item.id || "",
            title: item.title || "Untitled Property",
            price: item.price != null ? `K${item.price}` : "Price on request",
            address: item.address || "Unknown Address",
            number_of_rooms: item.number_of_bedrooms || 0,
            number_of_bathrooms: item.number_of_bathrooms || 0,
            image: item.images && item.images.length > 0 ? item.images[0] : null,
          }),
        },
      })
    } catch (error) {
      console.error("Conversation error:", error)
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to start conversation. Please try again.")
    }
  }

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.images && item.images.length > 0 ? { uri: item.images[0] } : require("@/assets/appartments/1.jpg")
          }
          style={styles.image}
        />
        <TouchableOpacity style={styles.heartIcon}>
          <Ionicons name="heart" size={20} color="#22C55E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreIcon}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.priceRatingRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>K{String(item.price ?? 0)}</Text>
            <Text style={styles.priceUnit}>/night</Text>
          </View>
          {typeof item.rating === "number" && !isNaN(item.rating) && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.rating}>{item.rating.toFixed(1)} (1899)</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>
          {typeof item.title === "string" || typeof item.title === "number" ? item.title : "Untitled Property"}
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons key={star} name="star" size={12} color="#22C55E" />
          ))}
        </View>

        <Text style={styles.location}>
          {typeof item.address === "string" || typeof item.address === "number" ? item.address : "Unknown Address"}
        </Text>

        <Text style={styles.cancellation}>Free cancellation</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.reserveButton}
            onPress={() =>
              router.push({
                pathname: "/reserve",
                params: {
                  propertyId: item.id?.toString(),
                  propertyType: item.property_type?.toLowerCase() || "apartment",
                },
              })
            }
          >
            <Text style={styles.buttonText}>Reserve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(item)}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  useEffect(() => {
    console.log("Properties passed to FlatList:", properties)
  }, [properties])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchWishlistProperties} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={properties.filter((p) => typeof p === "object" && p !== null)}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderPropertyItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          </View>
        }
      />

    <MapFloatingButton />
    </SafeAreaView>
  )
}

export default WishListCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContainer: {
    padding: 16,
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
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#22C55E",
    padding: 10,
    borderRadius: 8,
    width: 100,
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
    fontSize: 18,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  moreIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
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
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  priceUnit: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 4,
    fontWeight: "500",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  cancellation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  reserveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  messageButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
})
