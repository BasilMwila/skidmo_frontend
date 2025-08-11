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

const APP_GREEN = "#00A551"

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
      setThreads(userThreads)
    } catch (error) {
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
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={APP_GREEN} />
      </SafeAreaView>
    )
  }

  return (
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={APP_GREEN} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Start chatting</Text>
            <Text style={styles.emptySubtext}>Search or tap the + icon to start a conversation.</Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={startNewChat}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D1D6D0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 30 : 20,
    backgroundColor: "#D1D6D0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
  },
  conversationItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 1,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: APP_GREEN,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#e5ddd5",
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
})