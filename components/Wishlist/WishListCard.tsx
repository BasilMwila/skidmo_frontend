// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
// import { useNavigation } from 'expo-router';
// import { propertiesAPI } from "@/services/propertiesApi"; // Adjust the import path as needed

// interface Property {
//   id: number;
//   title: string;
//   price: number | string;
//   address: string;
//   rating?: number;
//   images?: string | null;
//   number_of_bedrooms: number;
//   number_of_bathrooms: number;
//   purchase_type: 'rent' | 'sale';
// }

// const WishListCard = () => {
//   const navigation = useNavigation();
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     navigation.setOptions({ title: 'Wishlist' });
//     fetchWishlistProperties();
//   }, [navigation]);

//   const fetchWishlistProperties = async () => {
//     try {
//       setLoading(true);
//       // In a real app, you would fetch the user's wishlist from your API
//       // For now, we'll fetch all properties or you can implement wishlist logic
//       const response = await propertiesAPI.listProperties();
//       setProperties(response);
//     } catch (err) {
//       setError(err.message || 'Failed to fetch properties');
//       console.error('Fetch properties error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderPropertyItem = ({ item }: { item: Property }) => (
//     <View style={styles.card}>
//       {item.images ? (
//         <Image source={{ uri: item.images }} style={styles.image} />
//       ) : (
//         <Image source={require('@/assets/appartments/1.jpg')} style={styles.image} />
//       )}
//       <TouchableOpacity style={styles.heartIcon}>
//         {/* <Icon name="heart" size={24} color="red" /> */}
//       </TouchableOpacity>
//       <View style={styles.infoContainer}>
//         <Text style={styles.price}>
//           K{item.price} {item.purchase_type === 'rent' ? '/night' : ''}
//         </Text>
//         <Text style={styles.name}>{item.title}</Text>
//         <Text style={styles.location}>{item.address}</Text>
//         <Text style={styles.details}>
//           {item.number_of_bedrooms} beds | {item.number_of_bathrooms} baths
//         </Text>
//         {item.rating && (
//           <View style={styles.ratingContainer}>
//             <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
//           </View>
//         )}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Reserve</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Message</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="green" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={fetchWishlistProperties} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={properties}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderPropertyItem}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>Your wishlist is empty</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   retryButton: {
//     backgroundColor: 'green',
//     padding: 10,
//     borderRadius: 5,
//     width: 100,
//     alignItems: 'center',
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: 'gray',
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     margin: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 3,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   heartIcon: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 5,
//   },
//   infoContainer: {
//     padding: 10,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 5,
//   },
//   location: {
//     color: "gray",
//   },
//   details: {
//     color: "gray",
//     marginBottom: 5,
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 5,
//   },
//   rating: {
//     fontSize: 14,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   button: {
//     backgroundColor: "green",
//     padding: 10,
//     borderRadius: 5,
//     flex: 1,
//     marginHorizontal: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default WishListCard;

import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from 'expo-router';
import { wishlistService } from "@/services/wishlistAPI"; // ✅ Corrected
import { Ionicons } from "@expo/vector-icons";

interface Property {
  id: string;
  title: string;
  price: number | string;
  address: string;
  rating?: number;
  images?: string[] | null;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  purchase_type: 'rent' | 'sale';
}

const WishListCard = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Wishlist' });
    fetchWishlistProperties();
  }, [navigation]);

  const fetchWishlistProperties = async () => {
    try {
      setLoading(true);
      const wishlistItems = await wishlistService.getWishlist();

      // ✅ Assumes backend returns structure like { id, property: {...} }
      const mapped = wishlistItems.map((item: any) => {
        const property = item.property || item; // fallback if already flattened
        return {
          id: property.id.toString(),
          title: property.title,
          price: property.price || 0,
          address: property.address,
          rating: property.rating || 0,
          images: property.photos || [],
          number_of_bedrooms: property.bedroom_count || 0,
          number_of_bathrooms: property.bathroom_count || 0,
          purchase_type: property.purchase_type || 'rent',
        };
      });

      setProperties(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch wishlist');
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <View style={styles.card}>
      <Image
        source={item.images && item.images.length > 0
          ? { uri: item.images[0] }
          : require('@/assets/appartments/1.jpg')}
        style={styles.image}
      />

      <TouchableOpacity style={styles.heartIcon}>
        <Ionicons name="heart" size={24} color="red" />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.price}>
          K{item.price} {item.purchase_type === 'rent' ? '/night' : ''}
        </Text>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.location}>{item.address}</Text>
        <Text style={styles.details}>
          {item.number_of_bedrooms} beds | {item.number_of_bathrooms} baths
        </Text>
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Reserve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchWishlistProperties} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPropertyItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          </View>
        }
      />
    </View>
  );
};

// 🔧 Styles remain the same — already provided in your version

export default WishListCard;
