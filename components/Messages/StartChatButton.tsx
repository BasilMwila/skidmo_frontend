"use client"

import { useState } from "react"
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator, type ViewStyle } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { messagingAPI } from "@/services/messaging"

interface StartChatButtonProps {
  ownerId: number
  ownerName: string
  propertyId?: number
  propertyTitle?: string
  inquiryType?: "buy" | "rent"
  buttonText?: string
  style?: ViewStyle
}

export default function StartChatButton({
  ownerId,
  ownerName,
  propertyId,
  propertyTitle,
  inquiryType = "rent",
  buttonText = "Message Owner",
  style,
}: StartChatButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStartChat = async () => {
    try {
      setLoading(true)
      console.log("Starting chat with owner:", ownerId)

      // Start the conversation
      let thread
      if (propertyId && propertyTitle) {
        thread = await messagingAPI.startPropertyInquiry(ownerId, propertyId, inquiryType, propertyTitle)
      } else {
        thread = await messagingAPI.startListingConversation(ownerId, propertyId || 0, propertyTitle)
      }

      console.log("Thread created/found:", thread.id)

      // Navigate to chat screen
      router.push({
        pathname: "/chat",
        params: {
          participantId: ownerId.toString(),
          threadId: thread.id.toString(),
          propertyId: propertyId?.toString(),
        },
      })
    } catch (error) {
      console.error("Error starting chat:", error)
      Alert.alert("Error", "Failed to start conversation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, style, loading && styles.buttonDisabled]}
      onPress={handleStartChat}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <>
          <Ionicons name="chatbubble" size={20} color="#FFF" />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
  },
  buttonDisabled: {
    backgroundColor: "#CCC",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})
