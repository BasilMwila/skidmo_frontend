// ReceivedMessage.tsx
import type React from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ReceivedMessageProps {
  message: string
  time: string
  profileImage?: string
}

const ReceivedMessage: React.FC<ReceivedMessageProps> = ({ message, time, profileImage }) => {
  return (
    <View style={styles.container}>
      <View style={styles.messageRow}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={16} color="#666" />
            </View>
          )}
        </View>
        <View style={styles.bubble}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: "80%",
  },
  bubble: {
    backgroundColor: "#ECECEC",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  defaultAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ReceivedMessage
