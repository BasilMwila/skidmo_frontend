import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ArrowLeft, Home, Search, Heart, MessageCircle, User } from 'react-native-feather';
import { Link, useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import BottomNavigation from '../BottomNavigation';

const NewListingScreen = () => {
  const navigation = useNavigation(); // Use the useNavigate hook for navigation
  const router = useRouter()

   useEffect(() => {
      navigation.setOptions({ title: "New Listing" }) // Set custom title
    }, [navigation])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={handleGoBack}> 
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity> */}
        {/* <Text style={styles.headerTitle}>New listing</Text> */}
      </View>

      <View style={styles.optionsContainer}>
        {/* Use navigate to go to the PropertyForm screen */}

        <Link href="/Listings/listproperty" asChild>
        <TouchableOpacity
          style={styles.optionCard}
        >
          <Text style={styles.optionTitle}>Sell property</Text>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="key-outline" size={24} color="#22c55e" />
          </View>
        </TouchableOpacity>
        </Link>
        
        <Link href="/Listings/listlongterm" asChild>
        <TouchableOpacity
          style={styles.optionCard}
        >
          <Text style={styles.optionTitle}>Long-term renting</Text>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="timer-sand" size={24} color="#22c55e" />
          </View>
        </TouchableOpacity>
        </Link>

        <Link href="/Listings/listshortterm" asChild>
        <TouchableOpacity
          style={styles.optionCard}
        >
          <Text style={styles.optionTitle}>Short-term renting</Text>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#22c55e" />
          </View>
        </TouchableOpacity>
        </Link>
      </View>

      {/* <BottomNavigation/> */}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  optionsContainer: {
    flex: 1,
    padding: 16,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    textDecoration: 'none', // Remove underline from Link
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default NewListingScreen;