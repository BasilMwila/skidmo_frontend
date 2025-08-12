"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  Image,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { messagingAPI, type MessageThread } from "@/services/messaging"
import { ownerAPI, type User } from "@/services/userApi"
import BottomNavigation from "../BottomNavigation"

const APP_GREEN = "#00a651"

interface ConversationItemProps {
  thread: MessageThread
  currentUserId: number
  onPress: () => void
}

const ConversationItem: React.FC<ConversationItemProps> = ({ thread, currentUserId, onPress }) => {
  const [participant, setParticipant] = useState<User | null>(null)

  useEffect(() => {
    loadParticipant()
  }, [thread.participants])

  const loadParticipant = async () => {
    try {
      // Defensive: always extract the ID
      const other = thread.participants.find((p: any) => {
        if (p && typeof p === 'object' && p !== null && Object.prototype.hasOwnProperty.call(p, 'id')) {
          return Number((p as any).id) !== Number(currentUserId);
        }
        return Number(p) !== Number(currentUserId);
      });
      let otherParticipantId;
      if (other && typeof other === 'object' && other !== null && Object.prototype.hasOwnProperty.call(other, 'id')) {
        otherParticipantId = (other as any).id;
      } else {
        otherParticipantId = other;
      }

      if (!otherParticipantId) {
        setParticipant(null);
        return;
      }

      // Now always a primitive
      const userData = await ownerAPI.getUserInfo(otherParticipantId.toString());
      setParticipant(userData);
    } catch (error) {
      // API call failed, use fallback user data
      const other = thread.participants.find((p: any) => {
        if (p && typeof p === 'object' && p !== null && Object.prototype.hasOwnProperty.call(p, 'id')) {
          return Number((p as any).id) !== Number(currentUserId);
        }
        return Number(p) !== Number(currentUserId);
      });
      let otherParticipantId;
      if (other && typeof other === 'object' && other !== null && Object.prototype.hasOwnProperty.call(other, 'id')) {
        otherParticipantId = (other as any).id;
      } else {
        otherParticipantId = other;
      }
      if (otherParticipantId) {
        // Create a fallback user object with basic info
        const fallbackUser = {
          id: otherParticipantId,
          name: `User ${otherParticipantId}`,
          email: "",
          phone_number: "",
          status_verification: "unverified" as const,
        }
        setParticipant(fallbackUser)
      }
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
      {/* Avatar */}
      {participant?.profileImage ? (
        <Image source={{ uri: participant.profileImage }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{participant?.name?.charAt(0)?.toUpperCase() || "?"}</Text>
        </View>
      )}

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        <View style={styles.topRow}>
          <Text style={styles.userName}>{participant?.name || "Unknown User"}</Text>
          <Text style={styles.timeText}>{formatTime(thread.last_message?.timestamp || "")}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text numberOfLines={1} style={styles.lastMessage}>
            {thread.last_message?.text || "No messages yet"}
          </Text>
          {thread.unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{thread.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function ConversationBody() {
  const router = useRouter()
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  useEffect(() => {
    initializeConversations()
  }, [])

  const initializeConversations = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id")
      if (userId) {
        setCurrentUserId(Number.parseInt(userId))
      }
      await loadConversations()
    } catch (error) {}
  }

  const loadConversations = async () => {
    try {
      setLoading(true)
      const userThreads = await messagingAPI.getThreads()
      // Ensure we always have an array, even if API returns undefined/null
      setThreads(Array.isArray(userThreads) ? userThreads : [])
    } catch (error) {
      console.error("Error fetching threads:", error)
      setThreads([]) // Set empty array on error
      Alert.alert("Error", "Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await loadConversations()
    } finally {
      setRefreshing(false)
    }
  }

  const openConversation = (thread: MessageThread) => {
    if (!currentUserId) {
      Alert.alert("Error", "Current user not found");
      return;
    }
    const normalizedCurrentUserId = Number(currentUserId);
    console.log('thread.participants:', thread.participants, 'currentUserId:', currentUserId);
    const otherParticipant = thread.participants.find((p: any) => {
      if (p && typeof p === 'object' && p !== null && Object.prototype.hasOwnProperty.call(p, 'id')) {
        return Number(p.id) !== normalizedCurrentUserId;
      }
      return Number(p) !== normalizedCurrentUserId;
    });
    let otherParticipantId: string | number | undefined;
    if (otherParticipant && typeof otherParticipant === 'object' && otherParticipant !== null && Object.prototype.hasOwnProperty.call(otherParticipant, 'id')) {
      otherParticipantId = (otherParticipant as any).id;
    } else {
      otherParticipantId = otherParticipant;
    }

    if (!otherParticipantId) {
      console.error("otherParticipantId is invalid!", { thread, currentUserId, otherParticipant });
      Alert.alert("Error", "Could not determine the other participant in this conversation.");
      return;
    }

    console.log('Opening conversation with:', {
      thread,
      currentUserId,
      otherParticipantId,
      otherParticipantIdType: typeof otherParticipantId
    })
    
    router.push({
      pathname: "/chat",
      params: {
        userId: otherParticipantId.toString(),
        userName: thread.title || "Chat",
        threadId: thread.id.toString(),
      },
    })
  }

  const startNewChat = () => {
    router.push({
      pathname: "/conversation/newchat"
    })
  }

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={APP_GREEN} />
          </View>
        </SafeAreaView>
        <View style={styles.bottomNavContainer}>
          <BottomNavigation />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* List of Chats */}
        <FlatList
          data={threads}
          renderItem={({ item }) => (
            <ConversationItem thread={item} currentUserId={currentUserId || 0} onPress={() => openConversation(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={APP_GREEN} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>Start chatting</Text>
              <Text style={styles.emptySubtext}>Tap the message icon below to start a conversation.</Text>
            </View>
          }
        />
      </SafeAreaView>
      <View style={styles.bottomNavContainer}>
        <BottomNavigation />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 30 : 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f8f8",
  },
  conversationItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: APP_GREEN,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: APP_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  badge: {
    marginLeft: 8,
    backgroundColor: APP_GREEN,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginTop: 8,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
})