
// "use client"

// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { propertiesAPI } from "@/services/propertiesApi"
// import { wishlistService } from "@/services/wishlistAPI"
// import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons"
// import { useNavigation, useRouter } from "expo-router"
// import { useEffect, useState } from "react"
// import { messagingAPI } from "@/services/messaging"
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   Linking,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native"

// interface Property {
//   id: string
//   title: string
//   price: string
//   address: string
//   number_of_rooms: number
//   number_of_bathrooms: number
//   images: string[] | null
//   hasMap: boolean
//   contact: string
//   rating: number
//   owner_id: string | null
// }

// const BuyScreen = () => {
//   const [saleProperties, setSaleProperties] = useState<Property[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
//   const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
//   const navigation = useNavigation()
//   const router = useRouter()

//   useEffect(() => {
//     navigation.setOptions({ headerShown: false })

//     const fetchSaleProperties = async () => {
//       try {
//         const data = await propertiesAPI.filterProperties({ purchase_type: "sale" })
//         if (!Array.isArray(data.properties)) {
//           console.error("Unexpected response format:", data)
//           setError("Invalid data format from API")
//           return
//         }

//         const saleData = data.properties.map((property: any) => ({
//           id: property.id?.toString() || "",
//           title: property.title,
//           price: `K${Number.parseFloat(property.sale_price || property.price).toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}`,
//           address: property.address,
//           number_of_rooms: property.bedroom_count || property.number_of_rooms || 0,
//           number_of_bathrooms: property.bathroom_count || property.number_of_bathrooms || 0,
//           images: property.photos,
//           hasMap: Boolean(property.location_coordinates),
//           contact: property.owner_phone_number || property.contact || "",
//           rating: property.rating || 0,
//           owner_id: property.owner_id?.toString() || null,
//         }))

//         setSaleProperties(saleData)
//       } catch (err) {
//         console.error("Failed to fetch sale properties:", err)
//         setError("Failed to load properties for sale. Please try again.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchWishlist = async () => {
//       try {
//         const wishlistItems = await wishlistService.getWishlist()
//         const wishlistSet = new Set(
//           wishlistItems.map((item: any) => item.property?.id?.toString() || item.id?.toString()),
//         )
//         setWishlistIds(wishlistSet)
//       } catch (err) {
//         console.error("Failed to fetch wishlist:", err)
//       }
//     }

//     fetchWishlist()
//     fetchSaleProperties()
//   }, [navigation])

//   const handleGoBack = () => {
//     router.back()
//   }

//   const handleToggleWishlist = async (propertyId: string) => {
//     if (togglingIds.has(propertyId)) return

//     setTogglingIds((prev) => new Set(prev).add(propertyId))

//     try {
//       await wishlistService.toggleWishlistItem(propertyId, "sale")
//       setWishlistIds((prev) => {
//         const newSet = new Set(prev)
//         if (newSet.has(propertyId)) {
//           newSet.delete(propertyId)
//         } else {
//           newSet.add(propertyId)
//         }
//         return newSet
//       })
//     } catch (error) {
//       console.error("Error toggling wishlist:", error)
//     } finally {
//       setTogglingIds((prev) => {
//         const newSet = new Set(prev)
//         newSet.delete(propertyId)
//         return newSet
//       })
//     }
//   }

//   const handleMessagePress = async (property: Property) => {
//     if (!property.owner_id) {
//       Alert.alert("Error", "Owner information not available")
//       return
//     }

//     try {
//       // Get current user ID (ensure it's a number)
//       const currentUserId = Number(await AsyncStorage.getItem("user_id"))
//       const ownerId = Number(property.owner_id)

//       if (!currentUserId || !ownerId) {
//         Alert.alert("Error", "User information not available")
//         return
//       }

//       console.log("Starting conversation between:", currentUserId, ownerId)

//       // Create or get thread
//       const thread = await messagingAPI.createOrGetThread(currentUserId, ownerId)

//       // Prepare property details to pass to chat
//       const propertyDetails = {
//         id: property.id,
//         title: property.title,
//         price: property.price,
//         address: property.address,
//         number_of_rooms: property.number_of_rooms,
//         number_of_bathrooms: property.number_of_bathrooms,
//         image: property.images && property.images.length > 0 ? property.images[0] : null,
//       }

//       // Navigate to chat screen with property details
//       router.push({
//         pathname: "/chat",
//         params: {
//           threadId: thread.id.toString(),
//           userId: ownerId.toString(),
//           propertyId: property.id,
//           userName: "Property Owner",
//           propertyDetails: JSON.stringify(propertyDetails),
//         },
//       })
//     } catch (error) {
//       console.error("Error starting conversation:", error)
//       Alert.alert("Error", "Failed to start conversation. Please try again.")
//     }
//   }

//   const renderStars = (count: number) => {
//     return (
//       <View style={styles.starsContainer}>
//         {Array(Math.floor(count))
//           .fill(0)
//           .map((_, index) => (
//             <FontAwesome key={index} name="star" size={12} color="black" />
//           ))}
//         {count % 1 >= 0.5 && <FontAwesome name="star-half-full" size={12} color="black" />}
//       </View>
//     )
//   }

//   const renderPropertyItem = ({ item }: { item: Property }) => (
//     <View style={styles.propertyCard}>
//       <View style={styles.imageContainer}>
//         <Image
//           source={
//             item.images && item.images.length > 0 ? { uri: item.images[0] } : require("@/assets/appartments/1.jpg")
//           }
//           style={styles.propertyImage}
//         />
//         <View style={styles.imageActions}>
//           <TouchableOpacity
//             style={styles.actionIconButton}
//             onPress={() => handleToggleWishlist(item.id)}
//             disabled={togglingIds.has(item.id)}
//           >
//             {togglingIds.has(item.id) ? (
//               <ActivityIndicator size="small" color="#00a651" />
//             ) : (
//               <Ionicons
//                 name={wishlistIds.has(item.id) ? "heart" : "heart-outline"}
//                 size={22}
//                 color={wishlistIds.has(item.id) ? "red" : "black"}
//               />
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionIconButton}>
//             <Ionicons name="ellipsis-horizontal" size={22} color="black" />
//           </TouchableOpacity>
//         </View>
//         {item.hasMap && (
//           <View style={styles.mapBadge}>
//             <Ionicons name="map-outline" size={16} color="white" />
//             <Text style={styles.mapText}>Map</Text>
//           </View>
//         )}
//       </View>
//       <View style={styles.propertyInfo}>
//         <Text style={styles.priceText}>{item.price}</Text>
//         <Text style={styles.detailsText}>
//           {`${item.number_of_rooms} room${item.number_of_rooms !== 1 ? "s" : ""}, ${item.number_of_bathrooms} bath${item.number_of_bathrooms !== 1 ? "s" : ""}`}
//         </Text>
//         <Text style={styles.locationText}>{item.address}</Text>
//         <View style={styles.ratingContainer}>
//           {renderStars(item.rating)}
//           <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
//         </View>
//         <View style={styles.actionButtons}>
//           <TouchableOpacity
//             style={styles.callButton}
//             onPress={() => {
//               if (item.contact) {
//                 Linking.openURL(`tel:${item.contact}`)
//               } else {
//                 console.warn("Contact number is missing for property ID:", item.id)
//               }
//             }}
//           >
//             <Text style={styles.buttonText}>Call</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.messageButton} onPress={() => handleMessagePress(item)}>
//             <Text style={styles.buttonText}>Message</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
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
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Properties for Sale</Text>
//         <View style={styles.priceIndicator}>
//           <Feather name="arrow-down" size={16} color="#00a651" />
//           <Feather name="arrow-up" size={16} color="#ff3b30" />
//         </View>
//       </View>

//       <View style={styles.filterBar}>
//         <TouchableOpacity style={styles.filterButton}>
//           <Ionicons name="options-outline" size={16} color="white" />
//           <Text style={styles.filterButtonText}>Filter</Text>
//         </TouchableOpacity>
//       </View>

//       {saleProperties.length > 0 ? (
//         <FlatList
//           data={saleProperties}
//           renderItem={renderPropertyItem}
//           keyExtractor={(item, index) => `${item.id}-${index}`}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>No properties for sale available</Text>
//         </View>
//       )}

//       <View style={styles.bottomNav}>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="home-outline" size={24} color="black" />
//           <Text style={styles.navText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="search-outline" size={24} color="black" />
//           <Text style={styles.navText}>Explore</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="heart-outline" size={24} color="black" />
//           <Text style={styles.navText}>Wishlists</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="chatbubble-outline" size={24} color="black" />
//           <Text style={styles.navText}>Messages</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.navItem}>
//           <Ionicons name="person-outline" size={24} color="black" />
//           <Text style={styles.navText}>Log in</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// // Styles remain unchanged
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
//     marginTop: 20,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   priceIndicator: {
//     flexDirection: "row",
//   },
//   filterBar: {
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
//   listContainer: {
//     padding: 16,
//   },
//   propertyCard: {
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
//   actionIconButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   mapBadge: {
//     position: "absolute",
//     bottom: 12,
//     left: 12,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   mapText: {
//     color: "white",
//     marginLeft: 4,
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   propertyInfo: {
//     padding: 16,
//   },
//   priceText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   detailsText: {
//     fontSize: 14,
//     marginBottom: 2,
//   },
//   locationText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//   },
//   starsContainer: {
//     flexDirection: "row",
//     marginBottom: 12,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   ratingText: {
//     marginLeft: 4,
//     fontSize: 14,
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
//   },
//   messageButton: {
//     backgroundColor: "#00a651",
//     borderRadius: 8,
//     paddingVertical: 12,
//     flex: 1,
//     marginLeft: 8,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     paddingVertical: 8,
//   },
//   navItem: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 4,
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
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
// })

// export default BuyScreen



"use client"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { propertiesAPI } from "@/services/propertiesApi"
import { wishlistService } from "@/services/wishlistAPI"
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { messagingAPI } from "@/services/messaging"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal, // Import Modal
} from "react-native"
import FilterScreen from "@/components/Explore/Filters" // Import FilterScreen

interface Property {
  id: string
  title: string
  price: string
  address: string
  number_of_rooms: number
  number_of_bathrooms: number
  images: string[] | null
  hasMap: boolean
  contact: string
  rating: number
  owner_id: string | null
}

const BuyScreen = () => {
  const [saleProperties, setSaleProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set())
  const [filterModalVisible, setFilterModalVisible] = useState(false) // New state for modal visibility
  const [filteredSaleProperties, setFilteredSaleProperties] = useState<Property[]>([]) // New state for filtered properties

  const navigation = useNavigation()
  const router = useRouter()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
    const fetchSaleProperties = async () => {
      try {
        const data = await propertiesAPI.filterProperties({ purchase_type: "sale" })
        if (!Array.isArray(data.properties)) {
          console.error("Unexpected response format:", data)
          setError("Invalid data format from API")
          return
        }
        const saleData = data.properties.map((property: any) => ({
          id: property.id?.toString() || "",
          title: property.title,
          price: `K${Number.parseFloat(property.sale_price || property.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          address: property.address,
          number_of_rooms: property.bedroom_count || property.number_of_rooms || 0,
          number_of_bathrooms: property.bathroom_count || property.number_of_bathrooms || 0,
          images: property.photos,
          hasMap: Boolean(property.location_coordinates),
          contact: property.owner_phone_number || property.contact || "",
          rating: property.rating || 0,
          owner_id: property.owner_id?.toString() || null,
        }))
        setSaleProperties(saleData)
        setFilteredSaleProperties(saleData) // Initialize filtered properties
      } catch (err) {
        console.error("Failed to fetch sale properties:", err)
        setError("Failed to load properties for sale. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    const fetchWishlist = async () => {
      try {
        const wishlistItems = await wishlistService.getWishlist()
        const wishlistSet = new Set(
          wishlistItems.map((item: any) => item.property?.id?.toString() || item.id?.toString()),
        )
        setWishlistIds(wishlistSet)
      } catch (err) {
        console.error("Failed to fetch wishlist:", err)
      }
    }
    fetchWishlist()
    fetchSaleProperties()
  }, [navigation])

  const handleGoBack = () => {
    router.back()
  }

  const handleToggleWishlist = async (propertyId: string) => {
    if (togglingIds.has(propertyId)) return
    setTogglingIds((prev) => new Set(prev).add(propertyId))
    try {
      await wishlistService.toggleWishlistItem(propertyId, "sale")
      setWishlistIds((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(propertyId)) {
          newSet.delete(propertyId)
        } else {
          newSet.add(propertyId)
        }
        return newSet
      })
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    } finally {
      setTogglingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(propertyId)
        return newSet
      })
    }
  }

  const handleMessagePress = async (property: Property) => {
    if (!property.owner_id) {
      Alert.alert("Error", "Owner information not available")
      return
    }
    try {
      // Get current user ID (ensure it's a number)
      const currentUserId = Number(await AsyncStorage.getItem("user_id"))
      const ownerId = Number(property.owner_id)
      if (!currentUserId || !ownerId) {
        Alert.alert("Error", "User information not available")
        return
      }
      console.log("Starting conversation between:", currentUserId, ownerId)
      // Create or get thread
      const thread = await messagingAPI.createOrGetThread(currentUserId, ownerId)

      // Prepare property details to pass to chat
      const propertyDetails = {
        id: property.id,
        title: property.title,
        price: property.price,
        address: property.address,
        number_of_rooms: property.number_of_rooms,
        number_of_bathrooms: property.number_of_bathrooms,
        image: property.images && property.images.length > 0 ? property.images[0] : null,
      }

      // Navigate to chat screen with property details
      router.push({
        pathname: "/chat",
        params: {
          threadId: thread.id.toString(),
          userId: ownerId.toString(),
          propertyId: property.id,
          userName: "Property Owner",
          propertyDetails: JSON.stringify(propertyDetails),
        },
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      Alert.alert("Error", "Failed to start conversation. Please try again.")
    }
  }

  const handleFilterApply = (newFilteredProperties: Property[]) => {
    setFilteredSaleProperties(newFilteredProperties)
    setFilterModalVisible(false)
  }

  const handleFilterClose = () => {
    setFilterModalVisible(false)
  }

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array(Math.floor(count))
          .fill(0)
          .map((_, index) => (
            <FontAwesome key={index} name="star" size={12} color="black" />
          ))}
        {count % 1 >= 0.5 && <FontAwesome name="star-half-full" size={12} color="black" />}
      </View>
    )
  }

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <View style={styles.propertyCard}>
      <View style={styles.imageContainer}>
        <Image
          source={
            item.images && item.images.length > 0 ? { uri: item.images[0] } : require("@/assets/appartments/1.jpg")
          }
          style={styles.propertyImage}
        />
        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => handleToggleWishlist(item.id)}
            disabled={togglingIds.has(item.id)}
          >
            {togglingIds.has(item.id) ? (
              <ActivityIndicator size="small" color="#00a651" />
            ) : (
              <Ionicons
                name={wishlistIds.has(item.id) ? "heart" : "heart-outline"}
                size={22}
                color={wishlistIds.has(item.id) ? "red" : "black"}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconButton}>
            <Ionicons name="ellipsis-horizontal" size={22} color="black" />
          </TouchableOpacity>
        </View>
        {item.hasMap && (
          <View style={styles.mapBadge}>
            <Ionicons name="map-outline" size={16} color="white" />
            <Text style={styles.mapText}>Map</Text>
          </View>
        )}
      </View>
      <View style={styles.propertyInfo}>
        <Text style={styles.priceText}>{item.price}</Text>
        <Text
          style={styles.detailsText}
        >{`${item.number_of_rooms} room${item.number_of_rooms !== 1 ? "s" : ""}, ${item.number_of_bathrooms} bath${item.number_of_bathrooms !== 1 ? "s" : ""}`}</Text>
        <Text style={styles.locationText}>{item.address}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {
              if (item.contact) {
                Linking.openURL(`tel:${item.contact}`)
              } else {
                console.warn("Contact number is missing for property ID:", item.id)
              }
            }}
          >
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton} onPress={() => handleMessagePress(item)}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properties for Sale</Text>
        <View style={styles.priceIndicator}>
          <Feather name="arrow-down" size={16} color="#00a651" />
          <Feather name="arrow-up" size={16} color="#ff3b30" />
        </View>
      </View>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="options-outline" size={16} color="white" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      {filteredSaleProperties.length > 0 ? (
        <FlatList
          data={filteredSaleProperties} // Use filteredSaleProperties here
          renderItem={renderPropertyItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No properties for sale available</Text>
        </View>
      )}
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
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleFilterClose}
      >
        {/* Pass original properties to FilterScreen for filtering */}
        <FilterScreen properties={saleProperties} onApply={handleFilterApply} onClose={handleFilterClose} />
      </Modal>
    </SafeAreaView>
  )
}
// Styles remain unchanged
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
  },
  priceIndicator: {
    flexDirection: "row",
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
    top: 8,
    right: 8,
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
  },
  mapBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mapText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  propertyInfo: {
    padding: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
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
  },
  messageButton: {
    backgroundColor: "#00a651",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
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
})
export default BuyScreen
