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
  ActivityIndicator
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ArrowLeft, Home, Search, Heart, MessageCircle, User } from 'react-native-feather';
import { Link, useNavigation, useRouter } from 'expo-router';
import { propertiesAPI } from '../api/propertiesAPI'; // Adjust the import path

const MyListingsScreen = () => {
    const [listings, setListings] = useState([]);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const router = useRouter();
  
    // Set a custom title for the screen
    useEffect(() => {
      navigation.setOptions({ title: 'My Listing' });
    }, [navigation]);
  
    const calculateDaysLeft = (expiryDate) => {
      if (!expiryDate) return 0;
      
      const expiry = new Date(expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    };
  
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.listProperties();
        
        // Transform the API response to match your listing structure
        const formattedListings = response.map(listing => ({
          id: listing.id.toString(),
          title: listing.title || `${listing.rooms} rooms, ${listing.size}m²`,
          location: listing.address,
          price: `K${listing.price}`,
          priceUnit: listing.listing_type === 'hotel' ? '/night' : '/day',
          daysLeft: calculateDaysLeft(listing.expiry_date),
          image: listing.images?.[0] || 'https://placeholder.com/default-image.jpg',
          status: listing.is_published ? 'active' : 'removed',
          originalData: listing // Keep original data for reference
        }));
        
        setListings(formattedListings);
        setShowEmptyState(formattedListings.length === 0);
      } catch (error) {
        console.error('Error fetching listings:', error);
        Alert.alert('Error', 'Failed to fetch listings. Please try again later.');
        setShowEmptyState(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
  
    useEffect(() => {
      fetchListings();
    }, []);
  
    const onRefresh = async () => {
      setRefreshing(true);
      await fetchListings();
    };
  
    const handleEditListing = (listingId) => {
      // Navigate to edit screen with the listing ID
      router.push(`/Listings/edit/${listingId}`);
    };
  
    const renderListingItem = ({ item }) => (
      <View style={styles.listingItem}>
        {item.status === 'active' ? (
          <View style={styles.daysLeftBadge}>
            <Text style={styles.daysLeftText}>There are {item.daysLeft} days left</Text>
          </View>
        ) : (
          <View style={styles.removedBadge}>
            <Text style={styles.removedText}>Removed from publication</Text>
          </View>
        )}
        
        <View style={styles.listingContent}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.listingImage}
            resizeMode="cover"
          />
          
          <View style={styles.listingDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.priceUnit}>{item.priceUnit}</Text>
            </View>
            
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditListing(item.id)}
          >
            <Feather name="edit-2" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  
    const EmptyState = () => (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyStateIconContainer}>
          <Feather name="folder" size={50} color="#22c55e" />
        </View>
        
        <Text style={styles.emptyStateTitle}>You don't have any ads posted yet</Text>
        <Text style={styles.emptyStateSubtitle}>Your published ads will be stored here</Text>
        
        <Link href="/Listings/index" asChild>
          <TouchableOpacity style={styles.listButton}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.listButtonText}>List</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  
    if (loading && !refreshing) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loadingText}>Loading your listings...</Text>
          </View>
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My listings</Text>
        </View>
        
        {!showEmptyState && (
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={16} color="#fff" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        )}
        
        {showEmptyState ? (
          <EmptyState />
        ) : (
          <FlatList
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
        
        <View style={styles.tabBar}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.tabItem}>
              <Home stroke="#000" width={24} height={24} />
              <Text style={styles.tabLabel}>Home</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.tabItem}>
              <Search stroke="#000" width={24} height={24} />
              <Text style={styles.tabLabel}>Explore</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/wishlists" asChild>
            <TouchableOpacity style={styles.tabItem}>
              <Heart stroke="#000" width={24} height={24} />
              <Text style={styles.tabLabel}>Wishlists</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/messages" asChild>
            <TouchableOpacity style={styles.tabItem}>
              <MessageCircle stroke="#000" width={24} height={24} />
              <Text style={styles.tabLabel}>Messages</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/authentication/account" asChild>
            <TouchableOpacity style={styles.tabItem}>
              <User stroke="#00a67e" width={24} height={24} />
              <Text style={styles.tabLabelActive}>Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    );
  };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  filterButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
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
  daysLeftBadge: {
    backgroundColor: '#FFF3CD',
    padding: 8,
  },
  daysLeftText: {
    color: '#856404',
    fontSize: 14,
  },
  removedBadge: {
    backgroundColor: '#FFEBEE',
    padding: 8,
  },
  removedText: {
    color: '#C62828',
    fontSize: 14,
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
    fontSize: 14,
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
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
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  listButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    color: '#22c55e',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  activeTabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#22c55e',
  },
  
});

export default MyListingsScreen;