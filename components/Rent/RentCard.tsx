import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { propertiesAPI } from '@/services/propertiesApi';
import { reservationsAPI } from '@/services/reservationsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messagingService } from '@/services/messaging';

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  photos?: PropertyPhoto[];
  price?: number;
  rental_price?: number;
  sale_price?: number;
  rating?: number;
  bedroom_count?: number;
  bathroom_count?: number;
  property_type: 'COMMERCIAL' | 'LODGE_HOTEL' | 'APARTMENT' | 'HOUSE' | 'BOARDING';
  purpose: 'RENT' | 'BUY' | 'RENT_BUY';
  term_category: 'SHORT' | 'LONG';
  has_pool?: boolean;
  garden?: 'PRIVATE' | 'COMMON' | 'NO';
  security?: boolean;
  lister?: {
    id: number;
    name: string;
    phone_number: string;
    profileImage?: string;
  };
}

interface PropertyPhoto {
  id?: number;
  image: string;
  caption?: string;
  is_primary: boolean;
}

const RentListingScreen = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'SHORT' | 'LONG'>('ALL');
  
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchProperties = useCallback(async () => {
    try {
      // Fetch properties from all categories that support rental
      const [apartments, houses, commercials] = await Promise.all([
        propertiesAPI.apartment.list(),
        propertiesAPI.house.list(),
        propertiesAPI.commercial.list()
      ]);

      // Combine all properties and filter for rentals
      const allProperties = [...apartments, ...houses, ...commercials];
      
      const formattedProperties = allProperties
        .filter((property) => property.purpose === 'RENT' || property.purpose === 'RENT_BUY')
        .map((property) => ({
          id: property.id,
          title: property.title,
          description: property.description || 'No description available',
          address: property.address,
          photos: property.photos || [],
          rental_price: property.price || property.rental_price || 0,
          rating: property.rating || 0,
          bedroom_count: property.bedroom_count || 0,
          bathroom_count: property.bathroom_count || 0,
          property_type: property.property_type,
          purpose: property.purpose,
          term_category: property.term_category || 'LONG', // Default to LONG if not specified
          has_pool: property.has_pool || false,
          garden: property.garden || 'NO',
          security: property.security || false,
          lister: property.lister || null,
          features: [
            `${property.bedroom_count || 0} bed`,
            `${property.bathroom_count || 0} bath`,
            ...(property.has_pool ? ['Pool'] : []),
            ...(property.garden && property.garden !== 'NO' ? ['Garden'] : []),
            ...(property.security ? ['Security'] : []),
          ]
        }));
      
      setProperties(formattedProperties);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, [fetchProperties]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCallOwner = useCallback((phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  }, []);

  const handleReserve = useCallback(async (propertyId: number) => {
    try {
      setReserving(propertyId);
      
      const userId = await AsyncStorage.getItem('user_id');
      
      if (!userId) {
        Alert.alert(
          'Login Required', 
          'Please login to make a reservation',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => router.push('/authentication/signin') }
          ]
        );
        return;
      }
  
      const property = properties.find(p => p.id === propertyId);
      if (!property) throw new Error('Property not found');
  
      const reservationData = {
        listing: {
          id: propertyId,
          title: property.title,
          address: property.address,
          description: property.description || 'No description provided',
          lister: parseInt(userId),
          price: property.rental_price || property.price || 0,
          property_type: property.property_type,
          purpose: property.purpose
        },
        user: parseInt(userId),
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        notes: 'Reserved via mobile app'
      };
  
      await reservationsAPI.create(reservationData);
      
      Alert.alert(
        'Reservation Successful', 
        'Your reservation has been submitted',
        [
          { 
            text: 'View Bookings', 
            onPress: () => router.push('/dashboard/bookingHistory') 
          },
          { 
            text: 'OK', 
            style: 'cancel' 
          }
        ]
      );
      
    } catch (error) {
      handleApiError(error, 'reservation');
    } finally {
      setReserving(null);
    }
  }, [properties, router]);

  const filteredProperties = properties.filter(property => {
    if (activeTab === 'ALL') return true;
    return property.term_category === activeTab;
  });

  const renderActionButton = (property: Property) => {
    if (property.term_category === 'SHORT') {
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
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => property.lister?.phone_number ? handleCallOwner(property.lister.phone_number) : null}
          disabled={!property.lister?.phone_number}
        >
          <Ionicons name="call-outline" size={16} color="white" />
          <Text style={styles.callButtonText}>Call Owner</Text>
        </TouchableOpacity>
      );
    }
  };

  const handleStartConversation = useCallback(async (property: Property) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert(
          'Login Required', 
          'Please login to message the owner',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Login', onPress: () => router.push('/authentication/signin') }
          ]
        );
        return;
      }
  
      if (property.lister && property.lister.id?.toString() === userId) {
        Alert.alert('Notice', 'You cannot message yourself about your own property');
        return;
      }
  
      const thread = await messagingService.startListingConversation(property.id);
      
      if (!thread?.id) throw new Error('Failed to create conversation thread');
  
      router.push({
        pathname: '/conversation',
        params: {
          threadId: thread.id,
          recipientId: property.lister?.id,
          recipientName: property.lister?.name || 'Property Owner',
          recipientImage: property.lister?.profileImage,
          propertyDetails: {
            price: property.rental_price != null ? `K${property.rental_price}` : property.price != null ? `K${property.price.toFixed(2)}` : undefined,
            location: property.address.split(',')[1]?.trim() || property.address,
            address: property.address,
            image: property.photos?.[0]?.image || ''
          }
        }
      });
      
    } catch (error) {
      console.error('Conversation error:', error);
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to start conversation. Please try again.'
      );
    }
  }, [router]);

  const handleApiError = (error: unknown, context: string) => {
    console.error(`${context} error:`, error);
    
    let errorMessage = `Failed to complete ${context}. Please try again.`;
    
    if (error instanceof Error) {
      if ('response' in error) {
        const axiosError = error as { response?: { status: number; data: any } };
        if (axiosError.response?.status === 400) {
          errorMessage = 'Validation error: Please check your input';
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else {
        errorMessage = error.message;
      }
    }
    
    Alert.alert('Error', errorMessage);
  };

  const renderStars = useCallback((count: number) => {
    const stars = [];
    const fullStars = Math.floor(count);
    const hasHalfStar = count % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={`star-${i}`} name="star" size={12} color="black" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesome key="star-half" name="star-half-full" size={12} color="black" />);
    }
    
    return <View style={styles.starsContainer}>{stars}</View>;
  }, []);

  const renderPropertyItem = useCallback(({ item }: { item: Property }) => (
    <View style={styles.hotelCard}>
      <View style={styles.imageContainer}>
        <Image
          source={item.photos?.[0]?.image ? { uri: item.photos[0].image } : require('@/assets/appartments/1.jpg')}
          style={styles.hotelImage}
          resizeMode="cover"
        />
        {/* <View style={styles.termBadge}>
          <Text style={styles.termBadgeText}>
            {item.term_category === 'SHORT' ? 'Short Term' : 'Long Term'}
          </Text>
        </View> */}
      </View>

      <View style={styles.hotelInfo}>
        <View style={styles.priceRatingRow}>
          <Text style={styles.priceText}>
          {item.rental_price != null? `K${item.rental_price}`: item.price != null? `K${item.price.toFixed(2)}`: 'Price on request'}

            {item.term_category === 'SHORT' && <Text style={styles.priceUnit}>/night</Text>}
            {item.term_category === 'LONG' && <Text style={styles.priceUnit}>/month</Text>}
          </Text>
          <View style={styles.ratingContainer}>
            {renderStars(item.rating)}
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.hotelName} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>

        {item.features && item.features.length > 0 && (
          <Text style={styles.featuresText} numberOfLines={1}>
            {item.features.join(' • ')}
          </Text>
        )}

        <View style={styles.actionButtons}>
          {renderActionButton(item)}
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => handleStartConversation(item)}
            disabled={reserving === item.id}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ), [handleReserve, handleStartConversation, reserving, renderStars]);

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

      {/* <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'ALL' && styles.activeTab]}
          onPress={() => setActiveTab('ALL')}
        >
          <Text style={[styles.tabText, activeTab === 'ALL' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'SHORT' && styles.activeTab]}
          onPress={() => setActiveTab('SHORT')}
        >
          <Text style={[styles.tabText, activeTab === 'SHORT' && styles.activeTabText]}>Short Term</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'LONG' && styles.activeTab]}
          onPress={() => setActiveTab('LONG')}
        >
          <Text style={[styles.tabText, activeTab === 'LONG' && styles.activeTabText]}>Long Term</Text>
        </TouchableOpacity>
      </View> */}
      
      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#00a651']}
            tintColor="#00a651"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No properties available</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchProperties}
            >
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 28,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#00a651',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  termBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 166, 81, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  termBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  callButton: {
    backgroundColor: '#00a651',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  callButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  sortButton: {
    padding: 8,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  hotelCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  imageActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  heartButton: {
    marginRight: 8,
  },
  onlineTourBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  onlineTourText: {
    marginLeft: 4,
    fontSize: 12,
  },
  hotelInfo: {
    padding: 16,
  },
  priceRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  featuresText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reserveButton: {
    backgroundColor: '#00a651',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#00a651',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#00a651',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#00a651',
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  backButtonText: {
    color: '#00a651',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RentListingScreen;