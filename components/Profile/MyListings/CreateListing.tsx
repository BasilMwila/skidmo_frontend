import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ArrowLeft, Home, Search, Heart, MessageCircle, User } from 'react-native-feather';
import { Link, useNavigation, useRouter } from 'expo-router';
import { propertiesAPI } from '@/services/propertiesApi';

const MyListingsScreen = () => {
    const [listings, setListings] = useState([]);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const router = useRouter();
  
    useEffect(() => {
      navigation.setOptions({ title: 'My Listings' });
    }, [navigation]);
  
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        
        // Fetch properties from all categories that belong to the current user
        const [apartments, houses, commercials, hotels] = await Promise.all([
          propertiesAPI.apartment.myProperties(),
          propertiesAPI.house.myProperties(),
          propertiesAPI.commercial.myProperties(),
          propertiesAPI.hotels.myProperties()
        ]);

        // Combine all properties
        const allListings = [...apartments, ...houses, ...commercials, ...hotels];
        
        const formattedListings = allListings.map(listing => ({
          id: `${listing.property_type.substring(0, 3).toUpperCase()}${listing.id}`,
          title: listing.title || 'Untitled Property',
          location: listing.address,
          price: `K${typeof listing.price === 'string' ? parseFloat(listing.price).toFixed(2) : '0.00'}`,
          priceUnit: listing.purpose === 'RENT' ? 
            (listing.term_category === 'SHORT' ? '/night' : '/month') : 
            '',
          image: listing.photos?.[0]?.image || 'https://placeholder.com/default-image.jpg',
          propertyType: listing.property_type,
          originalData: listing
        }));
        
        setListings(formattedListings);
        setShowEmptyState(formattedListings.length === 0);
      } catch (error) {
        console.error('Error fetching my listings:', error);
        Alert.alert('Error', 'Failed to fetch your listings. Please try again later.');
        setShowEmptyState(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
  
    useEffect(() => {
      fetchMyListings();
    }, []);
  
    const onRefresh = async () => {
      setRefreshing(true);
      await fetchMyListings();
    };
  
    const handleEditListing = (listing) => {
      // Determine the correct edit route based on property type
      let editRoute;
      switch (listing.propertyType) {
        case 'APARTMENT':
          editRoute = '/listings/edit/apartment/';
          break;
        case 'HOUSE':
          editRoute = '/listings/edit/house/';
          break;
        case 'COMMERCIAL':
          editRoute = '/listings/edit/commercial/';
          break;
        case 'HOTEL':
          editRoute = '/listings/edit/hotel/';
          break;
        default:
          editRoute = '/listings/edit/';
      }
      router.push(`${editRoute}${listing.id}`);
    };

    const handleDeleteListing = async (listing) => {
      try {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this listing?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: async () => {
                // Determine the correct API endpoint based on property type
                let deleteFunction;
                switch (listing.propertyType) {
                  case 'APARTMENT':
                    deleteFunction = propertiesAPI.apartment.deleteMyProperty;
                    break;
                  case 'HOUSE':
                    deleteFunction = propertiesAPI.house.deleteMyProperty;
                    break;
                  case 'COMMERCIAL':
                    deleteFunction = propertiesAPI.commercial.deleteMyProperty;
                    break;
                    case 'HOTEL':
                      deleteFunction = propertiesAPI.hotels.deleteMyProperty;
                      break;
                  default:
                    throw new Error('Invalid property type');
                }
                
                await deleteFunction(parseInt(listing.id.replace(/^\D+/g, '')));
                fetchMyListings(); // Refresh the list after deletion
              }
            }
          ]
        );
      } catch (error) {
        console.error('Delete error:', error);
        Alert.alert('Error', 'Failed to delete listing');
      }
    };
  
    const renderListingItem = ({ item }) => (
      <View style={styles.listingItem}>
        {/* <View style={item.status === 'available' ? styles.activeBadge : styles.inactiveBadge}>
          <Text style={styles.badgeText}>
            {item.status === 'available' ? 'Active' : 'Inactive'}
          </Text>
        </View> */}
        
        <View style={styles.listingContent}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.listingImage}
            resizeMode="cover"
          />
          
          <View style={styles.listingDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price}</Text>
              {item.priceUnit && <Text style={styles.priceUnit}>{item.priceUnit}</Text>}
            </View>
            
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
            <Text style={styles.propertyTypeText}>
              {item.propertyType.toLowerCase().replace('_', ' ')}
            </Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditListing(item)}
            >
              <Feather name="edit-2" size={20} color="#4CAF50" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteListing(item)}
            >
              <Feather name="trash-2" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  
    const EmptyState = () => (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateIconContainer}>
          <Feather name="package" size={50} color="#9E9E9E" />
        </View>
        
        <Text style={styles.emptyStateTitle}>No Listings Found</Text>
        <Text style={styles.emptyStateSubtitle}>You haven't created any listings yet</Text>
        
        <Link href="/listings/create" asChild>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Create Listing</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  
    if (loading && !refreshing) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading your listings...</Text>
          </View>
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        {showEmptyState ? (
          <EmptyState />
        ) : (
          <FlatList
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
          />
        )}
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  listingItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    padding: 8,
  },
  inactiveBadge: {
    backgroundColor: '#FFF3E0',
    padding: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
  },
  listingContent: {
    flexDirection: 'row',
    padding: 12,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  listingDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  propertyTypeText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 4,
  },
  actionButton: {
    padding: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#424242',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default MyListingsScreen;