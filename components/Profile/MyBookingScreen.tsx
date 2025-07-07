import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from 'react-native';
import { MessageCircle } from 'react-native-feather';
import { useRouter } from 'expo-router';
import { reservationsAPI } from '@/services/reservationsAPI'; // Adjust path as needed
import { useNavigation } from 'expo-router';

const MyBookingsScreen = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
      navigation.setOptions({ title: 'My Bookings' });
    }, [navigation]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsAPI.getMyReservations();
        setReservations(data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookingItem}
      onPress={() => router.push(`/reservation-details/${item.id}`)}
    >
      <Image 
        source={{ uri: item.property_details?.images?.[0] || 'https://via.placeholder.com/50' }} 
        style={styles.bookingImage} 
      />
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingName}>
          {item.property_details?.title || 'Unknown Property'}
        </Text>
        <Text style={styles.bookingDate}>
          {formatDateRange(item.start_date, item.end_date)}
        </Text>
        <Text style={styles.bookingStatus}>
          Status: <Text style={getStatusStyle(item.status)}>{item.status}</Text>
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.messageButton}
        onPress={() => router.push(`/messages/${item.property}`)}
      >
        <MessageCircle stroke="#000" width={24} height={24} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Helper function to format date range
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  // Helper function for status styling
  const getStatusStyle = (status) => {
    switch(status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'pending':
        return styles.statusPending;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading reservations...</Text>
      </SafeAreaView>
    );
  }

  if (reservations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noReservationsText}>You have no reservations yet</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reservations}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  bookingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 13,
    color: '#555',
  },
  statusConfirmed: {
    color: '#00a67e',
    fontWeight: '500',
  },
  statusPending: {
    color: '#FFA500',
    fontWeight: '500',
  },
  statusCancelled: {
    color: '#FF0000',
    fontWeight: '500',
  },
  statusDefault: {
    color: '#555',
  },
  messageButton: {
    padding: 8,
  },
  noReservationsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default MyBookingsScreen;