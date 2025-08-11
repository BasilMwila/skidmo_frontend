"use client"
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import PropertyDetailsLayout from '@/components/properties/PropertyDetails';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Property Details' });
  }, [navigation]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = Array.isArray(id) ? id[0] : id;
        const data = await require('@/services/propertiesApi').propertiesAPI.commercial.get(parseInt(propertyId));
        setProperty(data);
      } catch (err) {
        setError('Failed to load property details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  return (
    <PropertyDetailsLayout
      property={property}
      loading={loading}
      error={error}
      onBack={() => router.back()}
      showFullDescription={showFullDescription}
      setShowFullDescription={setShowFullDescription}
    />
  );
}
