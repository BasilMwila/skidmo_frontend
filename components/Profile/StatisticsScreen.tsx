// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
// import { ArrowLeft, Home, Search, Heart, MessageCircle, User, Filter } from 'react-native-feather';
// import { Link, useNavigation, useRouter } from 'expo-router'; // Import expo-router hooks and components
// import BottomNavigation from '../BottomNavigation';

// const StatisticsScreen = () => {
//   const navigation = useNavigation(); // Use the useNavigation hook for navigation
//   const router = useRouter(); // Use the useRouter hook for programmatic navigation

//   // Set a custom title for the screen
//   React.useEffect(() => {
//     navigation.setOptions({ title: 'Statistics' });
//   }, [navigation]);

//   // Handle the back button press
//   const handleGoBack = () => {
//     router.back();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         {/* <TouchableOpacity onPress={handleGoBack}>
//           <ArrowLeft stroke="#000" width={24} height={24} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Statistics</Text>
//         <View style={{ width: 24 }} /> */}
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Date Filter */}
//         <TouchableOpacity style={styles.filterButton}>
//           <Filter stroke="#fff" width={16} height={16} />
//           <Text style={styles.filterText}>Date</Text>
//         </TouchableOpacity>

//         {/* Stats Overview */}
//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Text style={styles.statTitle}>Views</Text>
//             <Text style={styles.statValue}>14</Text>
//             <Text style={[styles.statChange, { color: '#e74c3c' }]}>-10%</Text>
//             <Text style={styles.statPeriod}>with the previous period</Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statTitle}>Contacts</Text>
//             <Text style={styles.statValue}>5</Text>
//             <Text style={[styles.statChange, { color: '#2ecc71' }]}>+5%</Text>
//             <Text style={styles.statPeriod}>with the previous period</Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statTitle}>Likes</Text>
//             <Text style={styles.statValue}>10</Text>
//             <Text style={[styles.statChange, { color: '#2ecc71' }]}>+10%</Text>
//             <Text style={styles.statPeriod}>with the previous period</Text>
//           </View>

//           <View style={styles.statItem}>
//             <Text style={styles.statTitle}>Boo</Text>
//             <Text style={styles.statValue}>5</Text>
//             <Text style={[styles.statChange, { color: '#e74c3c' }]}>-7%</Text>
//             <Text style={styles.statPeriod}>with the previous period</Text>
//           </View>
//         </View>

//         {/* Indicators Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Indicators</Text>
//           <View style={styles.sectionItem}>
//             <Text style={styles.sectionItemLabel}>Active ads</Text>
//             <Text style={styles.sectionItemValue}>2</Text>
//           </View>
//         </View>

//         {/* Expenses Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Expenses</Text>
//           <View style={styles.sectionItem}>
//             <Text style={styles.sectionItemLabel}>Amount to be received</Text>
//             <Text style={styles.sectionItemValue}>K...</Text>
//           </View>
//           <View style={styles.sectionItem}>
//             <Text style={styles.sectionItemLabel}>Skidmo's commission</Text>
//             <Text style={styles.sectionItemValue}>K...</Text>
//           </View>
//           <View style={styles.sectionItem}>
//             <Text style={styles.sectionItemLabel}>My income</Text>
//             <Text style={styles.sectionItemValue}>K...</Text>
//           </View>
//         </View>
//       </ScrollView>

//       {/* <BottomNavigation/> */}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#333',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 16,
//     alignSelf: 'flex-start',
//     marginBottom: 20,
//   },
//   filterText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 24,
//   },
//   statItem: {
//     width: '48%',
//     marginBottom: 20,
//   },
//   statTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   statChange: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   statPeriod: {
//     fontSize: 12,
//     color: '#666',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   sectionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   sectionItemLabel: {
//     fontSize: 16,
//   },
//   sectionItemValue: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   tabBar: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     height: 60,
//     backgroundColor: '#fff',
//   },
//   tabItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabLabel: {
//     fontSize: 12,
//     marginTop: 4,
//     color: '#000',
//   },
//   tabLabelActive: {
//     fontSize: 12,
//     marginTop: 4,
//     color: '#00a67e',
//     fontWeight: '500',
//   },
// });

// export default StatisticsScreen;
"use client"

import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from "react-native"
import { Filter } from "react-native-feather"
import { useNavigation, useRouter } from "expo-router"

// Import the new statistics API and its interfaces from propertiesAPI
import { propertiesAPI, type OverviewStats } from "@/services/propertiesApi"

export const StatisticsScreen = () => {
  const navigation = useNavigation()
  const router = useRouter()

  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set a custom title for the screen
  React.useEffect(() => {
    navigation.setOptions({ title: "Statistics" })
  }, [navigation])

  // Fetch statistics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Use propertiesAPI.statistics.getOverviewStats()
        const data = await propertiesAPI.statistics.getOverviewStats()
        setOverviewStats(data)
        setError(null)
      } catch (err: any) {
        console.error("Failed to fetch overview statistics:", err)
        setError("Failed to load statistics. Please try again.")
        setOverviewStats(null) // Clear previous data on error
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true) // Set loading to true to re-trigger fetch
            setError(null) // Clear error
            // Re-fetch data using the new path
            propertiesAPI.statistics
              .getOverviewStats()
              .then(setOverviewStats)
              .catch((err) => {
                console.error("Failed to re-fetch statistics:", err)
                setError("Failed to load statistics. Please try again.")
              })
              .finally(() => setLoading(false))
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // Helper to format currency
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "K0.00"
    return `K${amount.toFixed(2)}`
  }

  // Helper to get platform health color (example logic)
  const getHealthColor = (score: number | undefined) => {
    if (score === undefined || score === null) return "#666"
    if (score >= 80) return "#2ecc71" // Green for good health
    if (score >= 50) return "#f39c12" // Orange for moderate
    return "#e74c3c" // Red for low health
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* The original header was commented out, keeping it that way */}
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

        {/* Stats Overview - Updated to reflect backend data */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Total Properties</Text>
            <Text style={styles.statValue}>{overviewStats?.total_properties ?? 0}</Text>
            {/* No percentage change from backend for this specific metric */}
            <Text style={styles.statPeriod}>Currently listed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Active Users</Text>
            <Text style={styles.statValue}>{overviewStats?.active_users ?? 0}</Text>
            {/* No percentage change from backend for this specific metric */}
            <Text style={styles.statPeriod}>Last 30 days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Monthly Revenue</Text>
            <Text style={styles.statValue}>{formatCurrency(overviewStats?.monthly_revenue)}</Text>
            {/* No percentage change from backend for this specific metric */}
            <Text style={styles.statPeriod}>Current month</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Platform Health</Text>
            <Text style={[styles.statValue, { color: getHealthColor(overviewStats?.platform_health) }]}>
              {overviewStats?.platform_health !== undefined ? `${overviewStats.platform_health.toFixed(1)}%` : "N/A"}
            </Text>
            {/* No percentage change from backend for this specific metric */}
            <Text style={styles.statPeriod}>Overall score</Text>
          </View>
        </View>

        {/* Indicators Section - Updated to reflect backend data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Indicators</Text>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Total Properties</Text>
            <Text style={styles.sectionItemValue}>{overviewStats?.total_properties ?? 0}</Text>
          </View>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Active Users (30d)</Text>
            <Text style={styles.sectionItemValue}>{overviewStats?.active_users ?? 0}</Text>
          </View>
        </View>

        {/* Expenses Section - Updated to reflect backend data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Overview</Text>
          <View style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Current Monthly Revenue</Text>
            <Text style={styles.sectionItemValue}>{formatCurrency(overviewStats?.monthly_revenue)}</Text>
          </View>
          {/* Skidmo's commission and My income are not directly provided by the backend overview endpoint.
              If these are needed, they would require additional backend logic or separate API calls. */}
          <Text style={styles.noteText}>*Commission and net income details require further backend calculation.</Text>
        </View>
      </ScrollView>
      {/* <BottomNavigation/> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00a651",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  filterText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    width: "48%",
    marginBottom: 20,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statChange: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  statPeriod: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionItemLabel: {
    fontSize: 16,
  },
  sectionItemValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  noteText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    height: 60,
    backgroundColor: "#fff",
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#000",
  },
  tabLabelActive: {
    fontSize: 12,
    marginTop: 4,
    color: "#00a67e",
    fontWeight: "500",
  },
})
