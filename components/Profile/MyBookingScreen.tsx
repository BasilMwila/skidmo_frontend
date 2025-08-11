// "use client"

// import { useEffect, useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native"
// import { MessageCircle, Filter, ArrowLeft } from "react-native-feather"
// import { useRouter } from "expo-router"
// import { reservationsAPI } from "@/services/reservationsAPI"
// import { useNavigation } from "expo-router"

// const MyBookingsScreen = () => {
//   const router = useRouter()
//   const [reservations, setReservations] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigation = useNavigation()

//   useEffect(() => {
//     navigation.setOptions({ title: "My Bookings" })
//   }, [navigation])

//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         const data = await reservationsAPI.getMyReservations()
//         setReservations(data)
//       } catch (error) {
//         console.error("Failed to fetch reservations:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchReservations()
//   }, [])

//   const renderBookingItem = ({ item }) => (
//     <TouchableOpacity style={styles.bookingItem} onPress={() => router.push(`/reservation-details/${item.id}`)}>
//       {/* Status Banner */}
//       {item.status === "confirmed" && (
//         <View style={styles.statusBanner}>
//           <Text style={styles.statusBannerText}>Booking confirmed</Text>
//         </View>
//       )}
//       {item.status === "pending" && (
//         <View style={styles.statusBanner}>
//           <Text style={styles.statusBannerText}>Awaiting confirmation</Text>
//         </View>
//       )}
//       {item.status === "cancelled" && (
//         <View style={styles.removedBanner}>
//           <Text style={styles.removedBannerText}>Booking cancelled</Text>
//         </View>
//       )}

//       <View style={styles.bookingContent}>
//         <Image
//           source={{ uri: item.property_details?.images?.[0] || "https://via.placeholder.com/80" }}
//           style={styles.bookingImage}
//         />

//         <View style={styles.bookingInfo}>
//           <Text style={styles.bookingName}>{item.property_details?.title || "Unknown Property"}</Text>
//           <Text style={styles.bookingDate}>{formatDateRange(item.start_date, item.end_date)}</Text>
//           <Text style={styles.bookingStatus}>
//             Status: <Text style={getStatusStyle(item.status)}>{item.status}</Text>
//           </Text>
//         </View>

//         <View style={styles.actionButtons}>
//           <TouchableOpacity style={styles.messageButton} onPress={() => router.push(`/messages/${item.property}`)}>
//             <MessageCircle stroke="#666" width={20} height={20} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </TouchableOpacity>
//   )

//   // Helper function to format date range
//   const formatDateRange = (startDate, endDate) => {
//     const start = new Date(startDate).toLocaleDateString()
//     const end = new Date(endDate).toLocaleDateString()
//     return `${start} - ${end}`
//   }

//   // Helper function for status styling
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case "confirmed":
//         return styles.statusConfirmed
//       case "pending":
//         return styles.statusPending
//       case "cancelled":
//         return styles.statusCancelled
//       default:
//         return styles.statusDefault
//     }
//   }

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton}>
//             <ArrowLeft stroke="#000" width={24} height={24} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Bookings</Text>
//           <View style={styles.headerSpacer} />
//         </View>
//         <Text style={styles.loadingText}>Loading reservations...</Text>
//       </SafeAreaView>
//     )
//   }

//   if (reservations.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.backButton}>
//             <ArrowLeft stroke="#000" width={24} height={24} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Bookings</Text>
//           <View style={styles.headerSpacer} />
//         </View>
//         <Text style={styles.noReservationsText}>You have no reservations yet</Text>
//       </SafeAreaView>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton}>
//           <ArrowLeft stroke="#000" width={24} height={24} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Bookings</Text>
//         <View style={styles.headerSpacer} />
//       </View>

//       {/* <View style={styles.filterContainer}>
//         <TouchableOpacity style={styles.filterButton}>
//           <Filter stroke="#fff" width={16} height={16} />
//           <Text style={styles.filterText}>Filter</Text>
//         </TouchableOpacity>
//       </View> */}

//       <FlatList
//         data={reservations}
//         renderItem={renderBookingItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
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
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#000",
//   },
//   headerSpacer: {
//     width: 32,
//   },
//   filterContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   filterButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#333",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     alignSelf: "flex-start",
//   },
//   filterText: {
//     color: "#fff",
//     fontSize: 14,
//     marginLeft: 6,
//     fontWeight: "500",
//   },
//   listContainer: {
//     paddingHorizontal: 16,
//   },
//   bookingItem: {
//     marginBottom: 16,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   statusBanner: {
//     backgroundColor: "#E8F5E8",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   statusBannerText: {
//     color: "#2E7D32",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   removedBanner: {
//     backgroundColor: "#FFEBEE",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   removedBannerText: {
//     color: "#D32F2F",
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   bookingContent: {
//     flexDirection: "row",
//     padding: 12,
//     alignItems: "center",
//   },
//   bookingImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   bookingInfo: {
//     flex: 1,
//   },
//   bookingName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#000",
//     marginBottom: 4,
//   },
//   bookingDate: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 4,
//   },
//   bookingStatus: {
//     fontSize: 13,
//     color: "#555",
//   },
//   statusConfirmed: {
//     color: "#00a67e",
//     fontWeight: "500",
//   },
//   statusPending: {
//     color: "#FFA500",
//     fontWeight: "500",
//   },
//   statusCancelled: {
//     color: "#FF0000",
//     fontWeight: "500",
//   },
//   statusDefault: {
//     color: "#555",
//   },
//   actionButtons: {
//     flexDirection: "column",
//     gap: 8,
//   },
//   messageButton: {
//     padding: 8,
//   },
//   loadingText: {
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 16,
//     color: "#666",
//   },
//   noReservationsText: {
//     textAlign: "center",
//     marginTop: 20,
//     fontSize: 16,
//     color: "#666",
//   },
// })

// export default MyBookingsScreen



"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image, Alert } from "react-native"
import { MessageCircle, ArrowLeft } from "react-native-feather"
import { useRouter } from "expo-router"
import { reservationsAPI } from "@/services/reservationsAPI"
import { messagingAPI } from "@/services/messaging"
import { propertiesAPI } from "@/services/propertiesApi"
import { useNavigation } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface PropertyDetails {
  id: string | number
  title: string
  address: string
  images: string[]
  price: number
  property_type: string
  number_of_bedrooms?: number
  number_of_bathrooms?: number
  lister?: {
    id: number
    name?: string
    email?: string
  }
}

interface Reservation {
  id: string | number
  property: string | number
  start_date: string
  end_date: string
  status: "confirmed" | "pending" | "cancelled"
  property_details?: PropertyDetails
}

const MyBookingsScreen = () => {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ title: "My Bookings" })
  }, [navigation])

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsAPI.getMyReservations()

        // Fetch detailed property information for each reservation
        const reservationsWithDetails = await Promise.all(
          data.map(async (reservation: Reservation) => {
            try {
              // Determine property type and fetch details accordingly
              let propertyDetails: PropertyDetails | null = null

              // Try to fetch from different property endpoints
              try {
                propertyDetails = await propertiesAPI.apartment.getById(reservation.property)
              } catch {
                try {
                  propertyDetails = await propertiesAPI.house.getById(reservation.property)
                } catch {
                  try {
                    propertyDetails = await propertiesAPI.commercial.getById(reservation.property)
                  } catch {
                    try {
                      propertyDetails = await propertiesAPI.hotels.getById(reservation.property)
                    } catch (error) {
                      console.error(`Failed to fetch property details for ${reservation.property}:`, error)
                    }
                  }
                }
              }

              return {
                ...reservation,
                property_details: propertyDetails || {
                  id: reservation.property,
                  title: "Unknown Property",
                  address: "Address not available",
                  images: [],
                  price: 0,
                  property_type: "unknown",
                },
              }
            } catch (error) {
              console.error(`Error processing reservation ${reservation.id}:`, error)
              return {
                ...reservation,
                property_details: {
                  id: reservation.property,
                  title: "Unknown Property",
                  address: "Address not available",
                  images: [],
                  price: 0,
                  property_type: "unknown",
                },
              }
            }
          }),
        )

        setReservations(reservationsWithDetails)
      } catch (error) {
        console.error("Failed to fetch reservations:", error)
        Alert.alert("Error", "Failed to load your bookings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const handleMessage = async (reservation: Reservation) => {
    try {
      const userId = await AsyncStorage.getItem("user_id")
      if (!userId) {
        Alert.alert("Login Required", "Please login to message the property owner")
        return
      }

      // Get property details and lister information
      const propertyDetails = reservation.property_details
      if (!propertyDetails?.lister?.id) {
        Alert.alert("No owner info", "Cannot message property owner.")
        return
      }

      const listerIdNum =
        typeof propertyDetails.lister.id === "string"
          ? Number.parseInt(propertyDetails.lister.id, 10)
          : propertyDetails.lister.id

      // Create or get thread
      const thread = await messagingAPI.createThread(listerIdNum)

      // Navigate to chat screen
      router.push({
        pathname: "/chat",
        params: {
          participantId: listerIdNum.toString(),
          threadId: thread.id.toString(),
          propertyId: propertyDetails.id.toString(),
          propertyTitle: propertyDetails.title,
        },
      })
    } catch (error) {
      console.error("Message error:", error)
      Alert.alert("Error", "Failed to start conversation. Please try again.")
    }
  }

  const renderBookingItem = ({ item }: { item: Reservation }) => (
    <TouchableOpacity style={styles.bookingItem} onPress={() => router.push(`/reservation-details/${item.id}`)}>
      {/* Status Banner */}
      {item.status === "confirmed" && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerText}>Booking confirmed</Text>
        </View>
      )}
      {item.status === "pending" && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerText}>Awaiting confirmation</Text>
        </View>
      )}
      {item.status === "cancelled" && (
        <View style={styles.removedBanner}>
          <Text style={styles.removedBannerText}>Booking cancelled</Text>
        </View>
      )}

      <View style={styles.bookingContent}>
        <Image
          source={{
            uri: item.property_details?.images?.[0] || "https://via.placeholder.com/80",
          }}
          style={styles.bookingImage}
        />
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingName}>{item.property_details?.title || "Unknown Property"}</Text>
          <Text style={styles.bookingDate}>{formatDateRange(item.start_date, item.end_date)}</Text>
          <Text style={styles.bookingLocation}>{item.property_details?.address || "Address not available"}</Text>
          <Text style={styles.bookingDetails}>
            {item.property_details?.number_of_bedrooms || 0} bedrooms •{" "}
            {item.property_details?.number_of_bathrooms || 0} bathrooms
          </Text>
          <Text style={styles.bookingPrice}>K{item.property_details?.price || 0} /day</Text>
          <Text style={styles.bookingStatus}>
            Status: <Text style={getStatusStyle(item.status)}>{item.status}</Text>
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(item)}>
            <MessageCircle stroke="#666" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Helper function to format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString()
    const end = new Date(endDate).toLocaleDateString()
    return `${start} - ${end}`
  }

  // Helper function for status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return styles.statusConfirmed
      case "pending":
        return styles.statusPending
      case "cancelled":
        return styles.statusCancelled
      default:
        return styles.statusDefault
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.loadingText}>Loading reservations...</Text>
      </SafeAreaView>
    )
  }

  if (reservations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.noReservationsText}>You have no reservations yet</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft stroke="#000" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={reservations}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerSpacer: {
    width: 32,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  bookingItem: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusBanner: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusBannerText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "500",
  },
  removedBanner: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removedBannerText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "500",
  },
  bookingContent: {
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-start",
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  bookingLocation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  bookingDetails: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CD964",
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 13,
    color: "#555",
  },
  statusConfirmed: {
    color: "#00a67e",
    fontWeight: "500",
  },
  statusPending: {
    color: "#FFA500",
    fontWeight: "500",
  },
  statusCancelled: {
    color: "#FF0000",
    fontWeight: "500",
  },
  statusDefault: {
    color: "#555",
  },
  actionButtons: {
    flexDirection: "column",
    gap: 8,
  },
  messageButton: {
    padding: 8,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  noReservationsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
})

export default MyBookingsScreen
