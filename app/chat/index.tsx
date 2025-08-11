"use client"

import { messagingAPI, type Message, type Thread } from "@/services/messaging"
import { propertiesAPI } from "@/services/propertiesApi"
import { ownerAPI, type User } from "@/services/userApi"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface ChatMessage extends Message {
  isOwn: boolean
  senderName?: string
}

interface PropertyInfo {
  id: string
  title?: string
  price?: string
  address?: string
  number_of_rooms?: number
  number_of_bathrooms?: number
  image?: string
}

// Helper function to format price safely
const formatPrice = (price: any): string => {

  if (price === null || price === undefined || price === "") {
    return "Price not available"
  }

  // If it's already a formatted string with K, return as is
  if (typeof price === "string" && price.toLowerCase().includes("k")) {
    return price
  }

  // If it's a string, try to extract numeric value
  if (typeof price === "string") {
    // Remove any non-numeric characters except decimal point
    const numericString = price.replace(/[^0-9.]/g, "")
    const numericValue = Number.parseFloat(numericString)

    if (isNaN(numericValue)) {
      return "Price not available"
    }

    return `K${numericValue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // If it's a number
  if (typeof price === "number") {
    if (isNaN(price)) {
      return "Price not available"
    }

    return `K${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Fallback
  return "Price not available"
}

export default function ChatScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [thread, setThread] = useState<Thread | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [participant, setParticipant] = useState<User | null>(null)
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null)
  const flatListRef = useRef<FlatList>(null)

  // Parse parameters
  const participantId = Array.isArray(params.userId) ? params.userId[0] : params.userId
  const propertyId = Array.isArray(params.propertyId) ? params.propertyId[0] : params.propertyId
  const userName = Array.isArray(params.userName) ? params.userName[0] : params.userName
  const threadId = Array.isArray(params.threadId) ? params.threadId[0] : params.threadId
  const propertyDetailsParam = Array.isArray(params.propertyDetails)
    ? params.propertyDetails[0]
    : params.propertyDetails

  const initializeChat = async () => {
    try {
      setLoading(true)

      // Get current user ID
      const userId = await AsyncStorage.getItem("user_id")
      if (!userId) {
        throw new Error("User not authenticated")
      }
      const currentUserId = Number.parseInt(userId)
      setCurrentUserId(currentUserId)

      // Get participant info
      if (!participantId) {
        throw new Error("No participant ID provided")
      }
      const participantIdNum = Number.parseInt(participantId)

      try {
        const participantData = await ownerAPI.getUserInfo(participantId)
        setParticipant(participantData)
      } catch (error) {
        console.error("Error fetching participant:", error)
        // Use fallback data
        setParticipant({
          id: participantIdNum,
          name: userName || `User ${participantId}`,
          email: "",
          phone_number: "",
          status_verification: "unverified",
        })
      }

      // Get property info - prioritize passed property details
      if (propertyDetailsParam) {
        try {
          const parsedPropertyDetails = JSON.parse(propertyDetailsParam)
          console.log("Parsed property details:", parsedPropertyDetails)
          console.log("Price from parsed details:", parsedPropertyDetails.price)
          setPropertyInfo(parsedPropertyDetails)
        } catch (error) {
          console.error("Error parsing property details:", error)
          // Fall back to fetching from API if parsing fails
          if (propertyId) {
            await fetchPropertyFromAPI(propertyId)
          }
        }
      } else if (propertyId) {
        // Fallback to API fetch if no property details were passed
        await fetchPropertyFromAPI(propertyId)
      }

      // Handle thread - use existing threadId or create new thread
      let currentThread: Thread | null = null
      if (threadId) {
        try {
          currentThread = await messagingAPI.getThread(Number.parseInt(threadId))
          setThread(currentThread)
        } catch (error) {
          console.error("Error fetching thread:", error)
        }
      }

      if (!currentThread) {
        // Create or get existing thread - make sure we have both user IDs
        if (!currentUserId || !participantIdNum) {
          throw new Error("Both user IDs are required to create a thread")
        }

        try {
          currentThread = await messagingAPI.createOrGetThread({
            participant1Id: currentUserId,
            participant2Id: participantIdNum,
            propertyId: propertyId ? Number(propertyId) : undefined,
          })
          setThread(currentThread)
        } catch (error) {
          console.error("Error creating/getting thread:", error)
          Alert.alert("Error", "Failed to start conversation")
          return
        }
      }

      // Load messages for this thread
      if (currentThread) {
        await loadMessages(currentThread.id)
      }
    } catch (error) {
      console.error("Error initializing chat:", error)
      Alert.alert("Error", error.message || "Failed to initialize chat")
    } finally {
      setLoading(false)
    }
  }

  const fetchPropertyFromAPI = async (propertyId: string) => {
    try {
      const propertyData = await propertiesAPI.getPropertyDetails(propertyId)
      console.log("Property data from API:", propertyData)
      console.log("Sale price:", propertyData.sale_price)
      console.log("Price:", propertyData.price)

      setPropertyInfo({
        id: propertyId,
        title: propertyData.title,
        // Store the raw price value for formatting later
        price: propertyData.sale_price || propertyData.price,
        address: propertyData.address,
        number_of_rooms: propertyData.bedroom_count,
        number_of_bathrooms: propertyData.bathroom_count,
        image: propertyData.photos?.[0],
      })
    } catch (error) {
      console.error("Error fetching property details:", error)
      // Fallback to basic property info
      setPropertyInfo({
        id: propertyId,
        title: "Property",
        price: "N/A",
        address: "Address not available",
      })
    }
  }

  const loadMessages = async (threadId: number) => {
    try {
      const threadMessages = await messagingAPI.getThreadMessages(threadId)

      // Transform messages to include isOwn flag
      const transformedMessages: ChatMessage[] = threadMessages.map((msg) => ({
        ...msg,
        isOwn: msg.sender === currentUserId,
        senderName: msg.sender === currentUserId ? "You" : participant?.name || "User",
      }))

      // Sort messages by created time (oldest first, newest last)
      const sortedMessages = transformedMessages.sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime(),
      )

      setMessages(sortedMessages)

      // Mark unread messages as read (only for messages from other users)
      const unreadMessages = threadMessages.filter((msg) => msg.sender !== currentUserId && !msg.read)
      for (const message of unreadMessages) {
        try {
          await messagingAPI.markMessageAsRead(message.id)
        } catch (error) {
          console.error("Error marking message as read:", error)
        }
      }

      // Scroll to bottom after loading messages
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (error) {
      Alert.alert("Error", "Failed to load messages")
    }
  }

  const sendMessage = async () => {
    const messageText = newMessage.trim()
    if (!messageText || !thread || sending || !participant) return

    try {
      setSending(true)
      setNewMessage("")

      // Send message
      const sentMessage = await messagingAPI.createMessage({
        thread: thread.id,
        text: messageText,
      })

      if (!sentMessage || sentMessage.id === undefined || sentMessage.id === null) {
        Alert.alert("Error", "Failed to send message: No message ID returned.")
        setSending(false)
        return
      }

      // Add message to local state
      const newChatMessage: ChatMessage = {
        ...sentMessage,
        isOwn: true,
        senderName: "You",
      }

      setMessages((prev) => [...prev, newChatMessage])

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    } catch (error) {
      Alert.alert("Error", "Failed to send message")
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return (
      <View style={[styles.messageContainer, item.isOwn ? styles.ownMessage : styles.otherMessage]}>
        <View style={[styles.messageBubble, item.isOwn ? styles.ownBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, item.isOwn ? styles.ownMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.messageTime, item.isOwn ? styles.ownMessageTime : styles.otherMessageTime]}>
          {new Date(item.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    )
  }

  useEffect(() => {
    initializeChat()
  }, [participantId])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (thread) {
      // Set up periodic refresh for new messages
      interval = setInterval(() => {
        loadMessages(thread.id)
      }, 3000) // Refresh every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [thread])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{participant?.name || userName || "Chat"}</Text>
          {propertyInfo && (
            <Text style={styles.propertyTitle}>{propertyInfo.title || `Property ${propertyInfo.id}`}</Text>
          )}
        </View>
      </View>

      {/* Property Card - only show if we have property info */}
      {propertyInfo && (
        <TouchableOpacity
          style={styles.propertyCard}
          onPress={() => {
            console.log("Navigating to property details:", propertyInfo.id)
            router.push(`/properties/${propertyInfo.id}`)
          }}
        >
          <Image
            source={propertyInfo.image ? { uri: propertyInfo.image } : { uri: "https://via.placeholder.com/150" }}
            style={styles.propertyImage}
          />
          <View style={styles.propertyInfoContainer}>
            <Text style={styles.propertyPrice}>{formatPrice(propertyInfo.price)}</Text>
            <Text style={styles.propertyDetails}>
              {propertyInfo.number_of_rooms
                ? `${propertyInfo.number_of_rooms} room${propertyInfo.number_of_rooms !== 1 ? "s" : ""}`
                : ""}
              {propertyInfo.number_of_bathrooms
                ? `, ${propertyInfo.number_of_bathrooms} bath${propertyInfo.number_of_bathrooms !== 1 ? "s" : ""}`
                : ""}
            </Text>
            <Text style={styles.propertyLocation}>{propertyInfo.address || "Address not available"}</Text>
          </View>
          <View style={styles.propertyArrow}>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>
      )}

      {/* Messages with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </KeyboardAvoidingView>

      {/* Input Area - fixed at bottom */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!newMessage.trim() || sending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? <ActivityIndicator size="small" color="#666" /> : <Ionicons name="send" size={20} color="#666" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  propertyTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  propertyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  propertyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  propertyInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  propertyDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  propertyArrow: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  ownMessage: {
    alignItems: "flex-end",
  },
  otherMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownBubble: {
    backgroundColor: "#4CAF50",
  },
  otherBubble: {
    backgroundColor: "#F0F0F0",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#FFF",
  },
  otherMessageText: {
    color: "#000",
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    color: "#666",
  },
  ownMessageTime: {
    textAlign: "right",
  },
  otherMessageTime: {
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "#FFF",
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
})
