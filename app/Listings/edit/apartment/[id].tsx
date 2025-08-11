// app/listings/edit/apartment/[id].tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { propertiesAPI } from '@/services/propertiesApi';

const EditApartmentScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await propertiesAPI.apartment.getMyProperty(id);
        setListing(data);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to load listing');
        router.back();
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Edit Apartment: {listing.title}</Text>
      {/* Add your edit form here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default EditApartmentScreen;