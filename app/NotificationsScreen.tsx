"use client"

import { useRouter } from "expo-router"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Notification {
  id: string
  type: "new_listing" | "price_drop" | "saved_search"
  title: string
  description: string
  timestamp: string
  property?: {
    id: string
    image: string
    price: string
    details: string
    location: string
  }
  isRead: boolean
}

export default function NotificationsScreen() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "new_listing",
      title: "New listing",
      description: "See the new ads for your search",
      timestamp: "Today",
      property: {
        id: "123",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        price: "K320 /day",
        details: "1 room, 40,2 m2",
        location: "Lusaka, Libala South, 16J",
      },
      isRead: false,
    },
  ])

  const handleBack = () => {
    router.back()
  }

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))

    // Navigate to property details if it has property data
    if (notification.property) {
      router.push(`/properties/house/${notification.property.id}`)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return timestamp
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationItem, !notification.isRead && styles.unreadNotification]}
            onPress={() => handleNotificationPress(notification)}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationDescription}>{notification.description}</Text>
              </View>
              <View style={styles.timestampContainer}>
                <Text style={styles.timestamp}>{formatTimestamp(notification.timestamp)}</Text>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </View>
            </View>

            {notification.property && (
              <View style={styles.propertyPreview}>
                <Image source={{ uri: notification.property.image }} style={styles.propertyImage} />
                <View style={styles.propertyDetails}>
                  <Text style={styles.propertyPrice}>{notification.property.price}</Text>
                  <Text style={styles.propertyInfo}>{notification.property.details}</Text>
                  <Text style={styles.propertyLocation}>{notification.property.location}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
            <Text style={styles.emptyStateSubtext}>
              We'll notify you when there are updates about your searches and saved properties.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  unreadNotification: {
    backgroundColor: "#f8f9ff",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
  },
  timestampContainer: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
    marginTop: 4,
  },
  propertyPreview: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  propertyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  propertyDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  propertyInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  propertyLocation: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
})
