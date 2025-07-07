import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const MyListingHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My listings</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Filter Button */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={18} color="#fff" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {/* Listings */}
      <ScrollView style={styles.listingsContainer}>
        {/* Listing 1 */}
        <View style={styles.listingCard}>
          <View style={styles.daysLeftBanner}>
            <Text style={styles.daysLeftText}>There are 12 days left</Text>
          </View>
          <View style={styles.listingContent}>
            <Image 
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20listings%20%281%29-oqwvzHNeZUy2u0tsuBMLFXVNhesw0M.png' }} 
              style={styles.listingImage}
              resizeMode="cover"
            />
            <View style={styles.listingDetails}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>K290</Text>
                <Text style={styles.priceUnit}>/day</Text>
              </View>
              <Text style={styles.roomDetails}>2 rooms, 46,2 m²</Text>
              <Text style={styles.location}>Lusaka, Libala South, 1</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Listing 2 */}
        <View style={styles.listingCard}>
          <View style={styles.daysLeftBanner}>
            <Text style={styles.daysLeftText}>There are 21 days left</Text>
          </View>
          <View style={styles.listingContent}>
            <Image 
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20listings%20%281%29-oqwvzHNeZUy2u0tsuBMLFXVNhesw0M.png' }} 
              style={styles.listingImage}
              resizeMode="cover"
            />
            <View style={styles.listingDetails}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>K388</Text>
                <Text style={styles.priceUnit}>/night</Text>
              </View>
              <Text style={styles.roomDetails}>Southern Sun Ridgeway Lusaka</Text>
              <Text style={styles.location}>Lusaka, Corner Church Road & I...</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Listing 3 - Removed */}
        <View style={styles.listingCard}>
          <View style={styles.removedBanner}>
            <Text style={styles.removedText}>Removed from publication</Text>
          </View>
          <View style={styles.listingContent}>
            <Image 
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20listings%20%281%29-oqwvzHNeZUy2u0tsuBMLFXVNhesw0M.png' }} 
              style={styles.listingImage}
              resizeMode="cover"
            />
            <View style={styles.listingDetails}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>K290</Text>
                <Text style={styles.priceUnit}>/day</Text>
              </View>
              <Text style={styles.roomDetails}>2 rooms, 46,2 m²</Text>
              <Text style={styles.location}>Lusaka, Libala South, 1</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color="#666" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#666" />
          <Text style={styles.navText}>Wishlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="person" size={24} color="#0a9c5f" />
          <Text style={styles.activeNavText}>Account</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    width: 80,
  },
  filterText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  listingsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listingCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  daysLeftBanner: {
    backgroundColor: '#FFF3D9',
    padding: 8,
  },
  daysLeftText: {
    color: '#D68C00',
    fontSize: 14,
  },
  removedBanner: {
    backgroundColor: '#FFE8E8',
    padding: 8,
  },
  removedText: {
    color: '#E53935',
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
    justifyContent: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  roomDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
    alignSelf: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  activeNavItem: {
    color: '#0a9c5f',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeNavText: {
    fontSize: 12,
    color: '#0a9c5f',
    marginTop: 4,
  },
});

export default MyListingHistory;