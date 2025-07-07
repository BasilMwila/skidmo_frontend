import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Home, Search, Heart, MessageCircle, User } from 'react-native-feather';
import { Link, useNavigation, useRouter } from 'expo-router';
import BottomNavigation from '../BottomNavigation';

const Dashboard = () => {
  const navigation = useNavigation();
  const router = useRouter();

  React.useEffect(() => {
    navigation.setOptions({ title: 'Dashboard' });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.menuContainer}>
          <Link href="/dashboard/mylistings" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>My listings</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/dashboard/bookings" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Bookings</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/dashboard/statistics" asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Statistics</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <BottomNavigation/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1, // This will make the content take up all available space
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Dashboard;