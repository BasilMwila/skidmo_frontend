import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, Home, Search, Heart, MessageCircle, User, Filter } from 'react-native-feather';
import { Link, useNavigation, useRouter } from 'expo-router'; // Import expo-router hooks and components
import BottomNavigation from '../BottomNavigation';

const StatisticsScreen = () => {
  const navigation = useNavigation(); // Use the useNavigation hook for navigation
  const router = useRouter(); // Use the useRouter hook for programmatic navigation

  // Set a custom title for the screen
  React.useEffect(() => {
    navigation.setOptions({ title: 'Statistics' });
  }, [navigation]);

  // Handle the back button press
  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={handleGoBack}>
          <ArrowLeft stroke="#000" width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
        <View style={{ width: 24 }} /> */}
      </View>

      <ScrollView style={styles.content}>
        {/* Date Filter */}
        <TouchableOpacity style={styles.filterButton}>
          <Filter stroke="#fff" width={16} height={16} />
          <Text style={styles.filterText}>Date</Text>
        </TouchableOpacity>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Views</Text>
            <Text style={styles.statValue}>14</Text>
            <Text style={[styles.statChange, { color: '#e74c3c' }]}>-10%</Text>
            <Text style={styles.statPeriod}>with the previous period</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Contacts</Text>
            <Text style={styles.statValue}>5</Text>
            <Text style={[styles.statChange, { color: '#2ecc71' }]}>+5%</Text>
            <Text style={styles.statPeriod}>with the previous period</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Likes</Text>
            <Text style={styles.statValue}>10</Text>
            <Text style={[styles.statChange, { color: '#2ecc71' }]}>+10%</Text>
            <Text style={styles.statPeriod}>with the previous period</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Boo</Text>
            <Text style={styles.statValue}>5</Text>
            <Text style={[styles.statChange, { color: '#e74c3c' }]}>-7%</Text>
            <Text style={styles.statPeriod}>with the previous period</Text>
          </View>
        </View>

        {/* Indicators Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indicators</Text>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Active ads</Text>
            <Text style={styles.sectionItemValue}>2</Text>
          </View>
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Amount to be received</Text>
            <Text style={styles.sectionItemValue}>K...</Text>
          </View>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Skidmo's commission</Text>
            <Text style={styles.sectionItemValue}>K...</Text>
          </View>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>My income</Text>
            <Text style={styles.sectionItemValue}>K...</Text>
          </View>
        </View>
      </ScrollView>

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  filterText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: '48%',
    marginBottom: 20,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statPeriod: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionItemLabel: {
    fontSize: 16,
  },
  sectionItemValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: 60,
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
  },
  tabLabelActive: {
    fontSize: 12,
    marginTop: 4,
    color: '#00a67e',
    fontWeight: '500',
  },
});

export default StatisticsScreen;