import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { DatePickerModal } from 'react-native-paper-dates';
import { propertiesAPI } from '@/services/propertiesApi';
import { reservationsAPI } from '@/services/reservationsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Property {
  id: number;
  title: string;
  address: string;
  rental_price?: number;
  sale_price?: number;
  price?: number;
  bedroom_count?: number;
  bathroom_count?: number;
  photos?: Array<{ image: string }>;
  term_category?: string;
  purpose?: string;
  property_type?: string;
  rating?: number;
  lister?: {
    name: string;
    phone_number: string;
  };
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mobile' | 'apple' | 'google';
  provider?: string;
  value: string;
  isDefault?: boolean;
}

const ReserveScreen = () => {
  const { propertyId, propertyType } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  
  // State for property data
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for date selection
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [checkInVisible, setCheckInVisible] = useState(false);
  const [checkOutVisible, setCheckOutVisible] = useState(false);
  
  // State for guest selection
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  // State for reservation
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Reserve Property' });
    fetchProperty();
    loadPaymentMethods();
  }, [navigation, propertyId]);

  const fetchProperty = async () => {
    try {
      const id = Array.isArray(propertyId) ? propertyId[0] : propertyId;
      const type = Array.isArray(propertyType) ? propertyType[0] : propertyType;
      
      let data;
      if (type === 'apartment' || id.startsWith('APT')) {
        data = await propertiesAPI.apartment.get(parseInt(id.replace('APT', '')));
      } else if (type === 'house' || id.startsWith('HSE')) {
        data = await propertiesAPI.house.get(parseInt(id.replace('HSE', '')));
      } else if (type === 'commercial' || id.startsWith('COM')) {
        data = await propertiesAPI.commercial.get(parseInt(id.replace('COM', '')));
      } else {
        data = await propertiesAPI.getProperty(parseInt(id));
      }
      
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    // For demo purposes, load some sample payment methods
    const sampleMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'visa',
        value: '•••• •••• ••••1234',
        isDefault: true,
      },
      {
        id: '2',
        type: 'mobile',
        provider: 'MTN',
        value: '+26073567',
      },
    ];
    setPaymentMethods(sampleMethods);
    setSelectedPaymentMethod('1');
  };

  const handleDateConfirm = (type: 'checkIn' | 'checkOut') => (params: { date: Date }) => {
    if (type === 'checkIn') {
      setCheckInDate(params.date);
      setCheckInVisible(false);
      // Set checkout date to1day after check-in if not set
      if (!checkOutDate || checkOutDate <= params.date) {
        const nextDay = new Date(params.date);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(nextDay);
      }
    } else {
      setCheckOutDate(params.date);
      setCheckOutVisible(false);
    }
  };

  const calculateTotalDays = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePrice = () => {
    if (!property) return { pricePerDay: 0, serviceCharge: 0, total: 0 };
    
    // Ensure pricePerDay is always a number
    let pricePerDay = property.rental_price ?? property.sale_price ?? property.price ?? 0;
    pricePerDay = Number(pricePerDay) || 0;

    const days = calculateTotalDays();
    const subtotal = pricePerDay * days;
    const serviceCharge = subtotal * 0.05; // 5% service charge
    const total = subtotal + serviceCharge;
    
    return { pricePerDay, serviceCharge, total };
  };

  const handleReserve = async () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Error', 'Please select check-in and check-out dates');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (!property) {
      Alert.alert('Error', 'Property details are missing.');
      return;
    }

    try {
      setReserving(true);
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Login Required', 'Please login to make a reservation');
        return;
      }

      const { total } = calculatePrice();
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const reservationData = {
        user: parseInt(userId, 10),
        property: property?.id,
        status: 'pending',
        start_date: formatDate(checkInDate),
        end_date: formatDate(checkOutDate),
        total_amount: total,
      };

      await reservationsAPI.create(reservationData);
      
      Alert.alert(
        'Reservation Successful',
        'Your reservation has been confirmed!',
        [
          { text: 'View Bookings', onPress: () => router.push('/dashboard/bookings') },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Reservation error:', error);
      Alert.alert('Error', 'Failed to create reservation. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  const renderPropertyCard = () => {
    if (!property) return null;

    return (
      <View style={styles.propertyCard}>
        <Image
          source={
            property.photos?.[0]?.image
              ? { uri: property.photos[0].image }
              : require('@/assets/appartments/1.jpg')
          }
          style={styles.propertyImage}
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyLocation}>{property.address}</Text>
          <View style={styles.propertyDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="bed" size={16} color="#666"/>
              <Text style={styles.detailText}>{property.bedroom_count || 'N/A'} beds</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="shower" size={16} color="#666"/>
              <Text style={styles.detailText}>{property.bathroom_count || 'N/A'} baths</Text>
            </View>
            {property.rating && (
              <View style={styles.detailItem}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.detailText}>{property.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderDateSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Dates</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setCheckInVisible(true)}
        >
          <Text style={styles.dateLabel}>Check-in</Text>
          <Text style={styles.dateValue}>
            {checkInDate ? checkInDate.toLocaleDateString() : 'Select date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#666"/>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setCheckOutVisible(true)}
        >
          <Text style={styles.dateLabel}>Check-out</Text>
          <Text style={styles.dateValue}>
            {checkOutDate ? checkOutDate.toLocaleDateString() : 'Select date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#666"/>
        </TouchableOpacity>
      </View>
      
      {checkInDate && checkOutDate && (
        <Text style={styles.daysText}>
          {calculateTotalDays()} {calculateTotalDays() === 1 ? 'day' : 'days'}
        </Text>
      )}
    </View>
  );

  const renderGuestSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Number of Guests</Text>
      <View style={styles.guestContainer}>
        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Adults</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setAdults(Math.max(1, adults - 1))}
            >
              <Ionicons name="remove" size={20} color="#666"/>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{adults}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setAdults(adults + 1)}
            >
              <Ionicons name="add" size={20} color="#666"/>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.guestRow}>
          <Text style={styles.guestLabel}>Children</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setChildren(Math.max(0, children - 1))}
            >
              <Ionicons name="remove" size={20} color="#666"/>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{children}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setChildren(children + 1)}
            >
              <Ionicons name="add" size={20} color="#666"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPriceCalculator = () => {
    const { pricePerDay, serviceCharge, total } = calculatePrice();
    const days = calculateTotalDays();

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price per day</Text>
            <Text style={styles.priceValue}>K{pricePerDay.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Number of days</Text>
            <Text style={styles.priceValue}>{days}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>K{(pricePerDay * days).toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service charge (5%)</Text>
            <Text style={styles.priceValue}>K{serviceCharge.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>K{total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPaymentMethods = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.paymentMethodItem,
              selectedPaymentMethod === item.id && styles.selectedPaymentMethod
            ]}
            onPress={() => setSelectedPaymentMethod(item.id)}
          >
            <View style={styles.paymentMethodInfo}>
              {item.type === 'visa' && <MaterialIcons name="credit-card" size={24} color="#000" />}
              {item.type === 'mobile' && <Ionicons name="phone-portrait-outline" size={24} color="#000" />}
              {item.type === 'apple' && <Ionicons name="logo-apple" size={24} color="#000" />}
              {item.type === 'google' && <FontAwesome name="google" size={24} color="#000" />}
              <View style={styles.paymentMethodText}>
                <Text style={styles.paymentMethodName}>
                  {item.type === 'visa' ? 'Credit Card' :
                   item.type === 'mobile' ? `${item.provider} Money` :
                   item.type === 'apple' ? 'Apple Pay' : 'Google Pay'}
                </Text>
                <Text style={styles.paymentMethodValue}>{item.value}</Text>
              </View>
            </View>
            {selectedPaymentMethod === item.id && (
              <Ionicons name="checkmark-circle" size={24} color="#00a651"/>
            )}
          </TouchableOpacity>
        )}
        style={styles.paymentMethodsList}
      />
      
      <TouchableOpacity
        style={styles.addPaymentButton}
        onPress={() => router.push('/payments/paymentOptions')}
      >
        <Ionicons name="add" size={20} color="#0a651"/>       <Text style={styles.addPaymentText}>Add a new payment method</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001"/>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderPropertyCard()}
        {renderDateSelector()}
        {renderGuestSelector()}
        {renderPriceCalculator()}
        {renderPaymentMethods()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.reserveButton, reserving && styles.reserveButtonDisabled]}
          onPress={handleReserve}
          disabled={reserving}
        >
          {reserving ? (
            <ActivityIndicator size="small" color="white"/>
          ) : (
            <Text style={styles.reserveButtonText}>Reserve</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={checkInVisible}
        onDismiss={() => setCheckInVisible(false)}
        date={checkInDate as any}
        onConfirm={handleDateConfirm('checkIn') as any}
        label="Select check-in date"
        saveLabel="Save"/>
      
      <DatePickerModal
        locale="en"
        mode="single"
        visible={checkOutVisible}
        onDismiss={() => setCheckOutVisible(false)}
        date={checkOutDate as any}
        onConfirm={handleDateConfirm('checkOut') as any}
        label="Select check-out date"
        saveLabel="Save"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
  },
  daysText: {
    fontSize: 14,
    color: '#00a651',
    fontWeight: 600,
    marginTop: 8,
    textAlign: 'center',
  },
  guestContainer: {
    gap: 16,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestLabel: {
    fontSize: 16,
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
    minWidth: 20,
    textAlign: 'center',
  },
  priceContainer: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00a651',
  },
  paymentMethodsList: {
    marginBottom: 16,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedPaymentMethod: {
    borderColor: '#00a651',
    backgroundColor: '#f0fff4',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodText: {
    gap: 2,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#333',
  },
  paymentMethodValue: {
    fontSize: 14,
    color: '#666',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#00a651',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 166, 81, 0.1)',
    gap: 8,
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#00a651',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  reserveButton: {
    backgroundColor: '#00a651',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReserveScreen; 