// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native';
// import { MessageCircle } from 'react-native-feather';
// import { useRouter } from 'expo-router';
// import { reservationsAPI } from '@/services/reservationsAPI'; // Adjust path as needed
// import { useNavigation } from 'expo-router';

// const BookingHistory = () => {
//   const router = useRouter();
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//       navigation.setOptions({ title: 'Booking History' });
//     }, [navigation]);

//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         const data = await reservationsAPI.getAll();
//         setReservations(data);
//       } catch (error) {
//         console.error('Failed to fetch reservations:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservations();
//   }, []);

//   const renderBookingItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.bookingItem}
//       onPress={() => router.push(`/dasboard/bookingDetails/${item.id}`)}
//     >
//       <Image 
//         source={{ uri: item.listing_details?.images?.[0] || 'https://via.placeholder.com/50' }} 
//         style={styles.bookingImage} 
//       />
//       <View style={styles.bookingInfo}>
//         <Text style={styles.bookingName}>
//           {item.listing_details?.title || 'Unknown Property'}
//         </Text>
//         <Text style={styles.bookingDate}>
//           {item.guest_count ? `Guests: ${item.guest_count}` : 'Guests not specified'}
//         </Text>
//         <Text style={styles.bookingStatus}>
//           Status: <Text style={getStatusStyle(item.status)}>{item.status || 'unknown'}</Text>
//         </Text>
//         <Text style={styles.bookingPrice}>
//           {item.listing_details?.price ? `Price: K${item.listing_details.price}` : 'Price not available'}
//         </Text>
//       </View>
//       <TouchableOpacity 
//         style={styles.messageButton}
//         onPress={() => router.push({
//           pathname: "/conversation",
//           params: { listingId: item.listing }
//         })}
//       >
//         <MessageCircle stroke="#000" width={24} height={24} />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   // Helper function for status styling
//   const getStatusStyle = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'confirmed':
//         return styles.statusConfirmed;
//       case 'pending':
//         return styles.statusPending;
//       case 'cancelled':
//         return styles.statusCancelled;
//       case 'completed':
//         return styles.statusCompleted;
//       default:
//         return styles.statusDefault;
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>Loading reservations...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (reservations.length === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.noReservationsText}>You have no reservations yet</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={reservations}
//         renderItem={renderBookingItem}
//         keyExtractor={item => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   listContainer: {
//     paddingHorizontal: 16,
//     paddingTop: 10,
//   },
//   bookingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   bookingImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   bookingInfo: {
//     flex: 1,
//   },
//   bookingName: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   bookingDate: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   bookingStatus: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 4,
//   },
//   bookingPrice: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
//   statusConfirmed: {
//     color: '#00a67e',
//     fontWeight: '500',
//   },
//   statusPending: {
//     color: '#FFA500',
//     fontWeight: '500',
//   },
//   statusCancelled: {
//     color: '#FF0000',
//     fontWeight: '500',
//   },
//   statusCompleted: {
//     color: '#4169E1',
//     fontWeight: '500',
//   },
//   statusDefault: {
//     color: '#555',
//   },
//   messageButton: {
//     padding: 8,
//   },
//   noReservationsText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#666',
//   },
// });

// export default BookingHistory;


"use client"

import { reservationsAPI } from "@/services/reservationsAPI"
import { useNavigation, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ArrowLeft, Edit3, Filter, MessageCircle } from "react-native-feather"

const BookingHistory = () => {
  const router = useRouter()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ title: "Booking History" })
  }, [navigation])

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsAPI.getAll()
        setReservations(data)
      } catch (error) {
        console.error("Failed to fetch reservations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReservations()
  }, [])

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity style={styles.bookingItem} onPress={() => router.push(`/dasboard/bookingDetails/${item.id}`)}>
      {/* Status Banner */}
      {item.status === "confirmed" && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerText}>There are 12 days left</Text>
        </View>
      )}
      {item.status === "pending" && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerText}>There are 21 days left</Text>
        </View>
      )}
      {item.status === "cancelled" && (
        <View style={styles.removedBanner}>
          <Text style={styles.removedBannerText}>Removed from publication</Text>
        </View>
      )}

      <View style={styles.bookingContent}>
        <Image
          source={{ uri: item.listing_details?.images?.[0] || "https://via.placeholder.com/80" }}
          style={styles.bookingImage}
        />

        <View style={styles.bookingInfo}>
          <Text style={styles.bookingPrice}>
            {item.listing_details?.price ? `K${item.listing_details.price}` : "Price not available"}
            <Text style={styles.priceUnit}> /day</Text>
          </Text>
          <Text style={styles.bookingDetails}>
            {item.guest_count ? `${item.guest_count} rooms, 46.2 m²` : "2 rooms, 46.2 m²"}
          </Text>
          <Text style={styles.bookingLocation}>{item.listing_details?.title || "Lusaka, Libala South, 1"}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              /* Handle edit */
            }}
          >
            <Edit3 stroke="#666" width={20} height={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() =>
              router.push({
                pathname: "/conversation",
                params: { listingId: item.listing },
              })
            }
          >
            <MessageCircle stroke="#666" width={20} height={20} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}> My Booking History</Text>
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
          <TouchableOpacity style={styles.backButton}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My listings</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.noReservationsText}>You have no reservations yet</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft stroke="#000" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My listings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Filter stroke="#fff" width={16} height={16} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
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
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusBannerText: {
    color: "#FF8C00",
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
    alignItems: "center",
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
  bookingPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "400",
    color: "#666",
  },
  bookingDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  bookingLocation: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "column",
    gap: 8,
  },
  editButton: {
    padding: 8,
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

export default BookingHistory
