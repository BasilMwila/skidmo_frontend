"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StyleSheet, TouchableOpacity, View } from "react-native"

interface NotificationButtonProps {
  hasUnread?: boolean
}

export function NotificationButton({ hasUnread = true }: NotificationButtonProps) {
  const router = useRouter()

  const handlePress = () => {
    router.push("/NotificationsScreen") // Ensure this path matches your notifications screen path
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Ionicons name="notifications-outline" size={24} color="#000" />
      {hasUnread && <View style={styles.badge} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
  },
})
