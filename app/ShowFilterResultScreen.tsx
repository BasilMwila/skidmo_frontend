// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Alert,
//   ActivityIndicator,
//   Modal,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { reservationsAPI } from "@/services/reservationsAPI";
// import { messagingAPI } from "@/services/messaging";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// interface Property {
//   id: string | number;
//   title: string;
//   price: number | string;
//   address: string;
//   rating?: number;
//   images?: string[];
//   number_of_bedrooms?: number;
//   number_of_bathrooms?: number;
//   purchase_type?: "rent" | "sale";
//   property_type?: string;
//   lister?: { id: number; name?: string; email?: string; };
// }

// export const PropertyCard = ({ item, onReserve, onMessage, reserving, messaging }: {
//   item: Property;
//   onReserve: (property: Property) => void;
//   onMessage: (property: Property) => void;
//   reserving: boolean;
//   messaging: boolean;
// }) => {
//   return (
//   <View style={styles.card}>
//       {/* Image */}
//     <Image
//       source={
//         item.images && item.images.length > 0
//           ? { uri: item.images[0] }
//           : require("@/assets/appartments/1.jpg")
//       }
//       style={styles.image}
//     />

//       {/* Heart Icon */}
//     <TouchableOpacity style={styles.heartIcon}>
//       <Ionicons name="heart" size={24} color="red" />
//     </TouchableOpacity>

//       {/* Property Details */}
//     <View style={styles.infoContainer}>
//         {/* Price */}
//       <Text style={styles.price}>
//           K{String(item.price ?? 0)} /day
//       </Text>

//         {/* Title */}
//       <Text style={styles.name}>{item.title}</Text>

//         {/* Location */}
//         <Text style={styles.location}>
//           {item.number_of_bedrooms ?? 0} rooms, {item.number_of_bathrooms ?? 0} bathrooms
//           <Text style={styles.address}>{item.address}</Text>
//       </Text>

//         {/* Rating */}
//       {typeof item.rating === "number" && !isNaN(item.rating) && (
//         <View style={styles.ratingContainer}>
//           <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
//         </View>
//       )}

//         {/* Buttons */}
//       <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.button, styles.reserveButton]}
//             onPress={() => onReserve(item)}
//             disabled={reserving}
//           >
//             {reserving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reserve</Text>}
//         </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.messageButton]}
//             onPress={() => onMessage(item)}
//             disabled={messaging}
//           >
//             {messaging ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Message</Text>}
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// );
// };

// export default function ShowFilterResultScreen() {
//   const route = useRoute<any>();
//   const navigation = useNavigation();
//   let properties: Property[] = [];
//   try {
//     if (typeof route.params?.properties === 'string') {
//       properties = JSON.parse(route.params.properties);
//     } else if (Array.isArray(route.params?.properties)) {
//       properties = route.params.properties;
//     }
//   } catch (e) {
//     console.error('Failed to parse properties:', e);
//     properties = [];
//   }

//   const [reservingId, setReservingId] = useState<string | number | null>(null);
//   const [messagingId, setMessagingId] = useState<string | number | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");

//   const router = useRouter();

//   const handleReserve = (property) => {
//     router.push({
//       pathname: '/reserve',
//       params: {
//         propertyId: property.id?.toString(),
//         propertyType: property.property_type?.toLowerCase() || 'apartment',
//       },
//     });
//   };

//   const handleMessage = async (property: Property) => {
//     try {
//       setMessagingId(property.id);
//       const userId = await AsyncStorage.getItem('user_id');
//       if (!userId) {
//         Alert.alert('Login Required', 'Please login to message the owner');
//         return;
//       }
//       // For demo, assume lister.id is the recipient
//       if (!property.lister || !property.lister.id) {
//         Alert.alert('No owner info', 'Cannot message property owner.');
//         return;
//       }
//       const listerIdNum = typeof property.lister.id === 'string' ? parseInt(property.lister.id, 10) : property.lister.id;
//       // Create or get thread
//       const thread = await messagingAPI.createThread(listerIdNum);
//       // Navigate to chat screen (adjust route as needed)
//       navigation.navigate('chat', {
//         participantId: listerIdNum.toString(),
//         threadId: thread.id.toString(),
//         propertyId: (typeof property.id === 'string' ? property.id : property.id.toString()),
//       });
//     } catch (error) {
//       setModalMessage('Failed to start conversation.');
//       setModalVisible(true);
//       console.error('Message error:', error);
//     } finally {
//       setMessagingId(null);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Rent</Text>
//         <TouchableOpacity style={styles.filterButton}>
//           <Ionicons name="filter" size={16} color="#fff" />
//           <Text style={styles.filterButtonText}>Filter</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.sortButton}>
//           <Ionicons name="ios-arrow-up-down" size={16} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Property List */}
//       <FlatList
//         data={properties}
//         keyExtractor={(item, index) => (item.id ? item.id.toString() : `property-${index}`)}
//         renderItem={({ item }) => (
//           <PropertyCard
//             item={item}
//             onReserve={handleReserve}
//             onMessage={handleMessage}
//             reserving={reservingId === item.id}
//             messaging={messagingId === item.id}
//           />
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No properties found.</Text>
//           </View>
//         }
//       />

//       {/* Footer Navigation */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.footerItem}>
//           <Ionicons name="home" size={24} color="#1a8917" />
//           <Text style={styles.footerLabel}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerItem}>
//           <Ionicons name="search" size={24} color="#1a8917" />
//           <Text style={styles.footerLabel}>Explore</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerItem}>
//           <Ionicons name="heart" size={24} color="#1a8917" />
//           <Text style={styles.footerLabel}>Wishlists</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerItem}>
//           <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1a8917" />
//           <Text style={styles.footerLabel}>Messages</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerItem}>
//           <Ionicons name="log-in" size={24} color="#1a8917" />
//           <Text style={styles.footerLabel}>Log in</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>{modalMessage}</Text>
//             <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
//               <Text style={styles.modalButtonText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }



// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#1a8917",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   filterButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#333",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   filterButtonText: {
//     color: "#fff",
//     marginLeft: 4,
//   },
//   sortButton: {
//     backgroundColor: "#333",
//     padding: 8,
//     borderRadius: 8,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     margin: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//     overflow: "hidden",
//   },
//   image: {
//     width: "100%",
//     height: 220,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   heartIcon: {
//     position: "absolute",
//     top: 16,
//     right: 16,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 6,
//     zIndex: 2,
//     elevation: 2,
//   },
//   infoContainer: { padding: 16 },
//   price: { fontSize: 20, fontWeight: "bold", color: '#1a8917' },
//   name: { fontSize: 20, fontWeight: "bold", marginVertical: 6 },
//   location: { color: "#666", fontSize: 15 },
//   address: { color: "#666", fontSize: 14 },
//   ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
//   rating: { fontSize: 15 },
//   buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
//   button: {
//     backgroundColor: "#1a8917",
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     flex: 1,
//     marginHorizontal: 6,
//     alignItems: "center",
//   },
//   buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
//   emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   emptyText: { fontSize: 18, color: "gray" },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 24,
//     alignItems: 'center',
//     minWidth: 220,
//   },
//   modalText: {
//     fontSize: 18,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   modalButton: {
//     backgroundColor: '#1a8917',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     marginTop: 8,
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//     paddingVertical: 12,
//   },
//   footerItem: {
//     alignItems: "center",
//   },
//   footerLabel: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 4,
//   },
// }); 




"use client"

import { useState } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { messagingAPI } from "@/services/messaging"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

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
  square_meters?: number
  lister?: { id: number; name?: string; email?: string }
}

export const PropertyCard = ({
  item,
  onReserve,
  onMessage,
  reserving,
  messaging,
}: {
  item: Property
  onReserve: (property: Property) => void
  onMessage: (property: Property) => void
  reserving: boolean
  messaging: boolean
}) => {
  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={
            item.images && item.images.length > 0 ? { uri: item.images[0] } : require("@/assets/appartments/1.jpg")
          }
          style={styles.image}
        />
        {/* Heart Icon */}
        <TouchableOpacity style={styles.heartIcon}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
        {/* More Options */}
        <TouchableOpacity style={styles.moreIcon}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
        {/* Map Button */}
        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map-outline" size={16} color="#fff" />
          <Text style={styles.mapButtonText}>Map</Text>
        </TouchableOpacity>
      </View>

      {/* Online Tour Badge */}
      <View style={styles.onlineTourContainer}>
        <TouchableOpacity style={styles.onlineTourBadge}>
          <Ionicons name="videocam-outline" size={16} color="#666" />
          <Text style={styles.onlineTourText}>Online tour</Text>
        </TouchableOpacity>
      </View>

      {/* Property Details */}
      <View style={styles.infoContainer}>
        {/* Price and Rating Row */}
        <View style={styles.priceRatingRow}>
          <Text style={styles.price}>K{String(item.price ?? 0)} /day</Text>
          {typeof item.rating === "number" && !isNaN(item.rating) && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating.toFixed(1)} (19)</Text>
            </View>
          )}
        </View>

        {/* Property Info */}
        <Text style={styles.propertyInfo}>
          {item.number_of_bedrooms ?? 0} rooms, {item.square_meters ?? "44,7"} m2
        </Text>

        {/* Address */}
        <Text style={styles.address}>{item.address}</Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.reserveButton]}
            onPress={() => onReserve(item)}
            disabled={reserving}
          >
            {reserving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reserve</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.messageButton]}
            onPress={() => onMessage(item)}
            disabled={messaging}
          >
            {messaging ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Message</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default function ShowFilterResultScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation()
  let properties: Property[] = []

  try {
    if (typeof route.params?.properties === "string") {
      properties = JSON.parse(route.params.properties)
    } else if (Array.isArray(route.params?.properties)) {
      properties = route.params.properties
    }
  } catch (e) {
    console.error("Failed to parse properties:", e)
    properties = []
  }

  const [reservingId, setReservingId] = useState<string | number | null>(null)
  const [messagingId, setMessagingId] = useState<string | number | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const router = useRouter()

  const handleReserve = (property) => {
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
              ? `K${property.price.toFixed(2)}`
              : "Price on request",
        address: property.address,
        number_of_rooms: property.bedroom_count || 0,
        number_of_bathrooms: property.bathroom_count || 0,
        image: property.photos && property.photos.length > 0 ? property.photos[0].image : null,
      }

      // Navigate to chat screen with property details
      router.push({
        pathname: "/conversation/newchat",
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

  const handleBack = () => {
    router.back()
  }

  const handleFilter = () => {
    router.push("/FilterScreen")
  }

  const handleSort = () => {
    // Implement sort functionality
    Alert.alert("Sort", "Sort functionality to be implemented")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rent</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <Ionicons name="filter" size={16} color="#fff" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
            <Ionicons name="swap-vertical" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property List */}
      <FlatList
        data={properties}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : `property-${index}`)}
        renderItem={({ item }) => (
          <PropertyCard
            item={item}
            onReserve={handleReserve}
            onMessage={handleMessage}
            reserving={reservingId === item.id}
            messaging={messagingId === item.id}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties found.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#666",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontSize: 14,
  },
  sortButton: {
    backgroundColor: "#666",
    padding: 8,
    borderRadius: 6,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 50,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  moreIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  mapButton: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A4A4A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
  onlineTourContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  onlineTourBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  onlineTourText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  infoContainer: {
    padding: 16,
    paddingTop: 8,
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#000",
    marginLeft: 4,
  },
  propertyInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reserveButton: {
    backgroundColor: "#4CD964",
  },
  messageButton: {
    backgroundColor: "#4CD964",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    minWidth: 220,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4CD964",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
