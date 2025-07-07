import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Changed to Expo icons

interface ChatHeadingProps {
  price: string;
  location: string;
  address: string;
  image: any; // Allow for both uri objects and require statements
  onBack: () => void;
  onViewDetails: () => void;
}

const ChatHeading: React.FC<ChatHeadingProps> = ({
  price,
  location,
  address,
  image,
  onBack,
  onViewDetails,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.placeholder} />
      </View>
      
      <TouchableOpacity style={styles.propertyContainer} onPress={onViewDetails}>
        <Image 
          source={typeof image === 'string' ? { uri: image } : image} 
          style={styles.propertyImage} 
          resizeMode="cover"
        />
        <View style={styles.propertyInfo}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{price}</Text>
          </View>
          <Text style={styles.locationText}>{location}</Text>
          <Text style={styles.addressText} numberOfLines={1}>{address}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
      
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  propertyContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
});

export default ChatHeading;