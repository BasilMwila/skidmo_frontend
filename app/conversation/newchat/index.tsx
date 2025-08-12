"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  SafeAreaView,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { ownerAPI, type User } from "@/services/userApi"
import { messagingAPI } from "@/services/messaging"
import { fetchCurrentUser } from "@/types/userHelpers"

const APP_GREEN = "#00a651"

// Type guard for searchUsers
function hasSearchUsers(api: any): api is typeof ownerAPI & { searchUsers: (query: string) => Promise<User[]> } {
  return typeof api.searchUsers === 'function';
}

const NewChatScreen = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    loadInitialUsers()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers()
      } else {
        loadInitialUsers()
      }
    }, 300)
    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const loadInitialUsers = async () => {
    try {
      setLoading(true)
      const allUsers = await ownerAPI.getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      Alert.alert("Error", "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async () => {
    try {
      setSearchLoading(true)
      let searchResults: User[] = []
      if (hasSearchUsers(ownerAPI)) {
        searchResults = await ownerAPI.searchUsers(searchQuery)
      } else {
        // fallback to filtering
        const allUsers = await ownerAPI.getAllUsers()
        searchResults = allUsers.filter(
          (user: User) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      setUsers(searchResults)
    } catch (error) {
      // fallback to filtering
      const allUsers = await ownerAPI.getAllUsers()
      const filtered = allUsers.filter(
        (user: User) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setUsers(filtered)
    } finally {
      setSearchLoading(false)
    }
  }

const startChat = async (user: User) => {
  try {
      const currentUser = await fetchCurrentUser()
      if (!currentUser || !currentUser.id) {
        Alert.alert("Error", "Current user not loaded")
        return
      }
      if (typeof user.id !== "number" && typeof user.id !== "string") {
        Alert.alert("Error", "Invalid user ID for chat.")
        return
      }
      const thread = await messagingAPI.createOrGetThread(Number(currentUser.id), Number(user.id))
    router.push({
        pathname: "/chat",
      params: {
        userId: user.id.toString(),
          userName: user.name || "Unknown User",
        threadId: thread.id.toString(),
      },
    })
  } catch (error) {
      let errorMessage = "Failed to start chat"
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: any; status?: number } }
        if (err.response?.data) {
          if (typeof err.response.data === "object") {
        errorMessage = Object.values(err.response.data).flat().join(", ")
          } else if (typeof err.response.data === "string") {
        errorMessage = err.response.data
          }
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const err = error as { message: string }
        errorMessage = err.message
      }
      Alert.alert("Error", errorMessage)
  }
}

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => startChat(item)}
      activeOpacity={0.85}
      disabled={loading || searchLoading}
    >
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.name?.charAt(0)?.toUpperCase() || "?"}</Text>
          </View>
        )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name || "Unknown User"}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {item.phone_number && <Text style={styles.userPhone}>{item.phone_number}</Text>}
      </View>
      {item.status_verification === "verified" && (
        <Ionicons name="checkmark-circle" size={22} color={APP_GREEN} style={{ marginLeft: 8 }} />
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Start a New Chat</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={APP_GREEN} />
        </TouchableOpacity>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        {searchLoading && <ActivityIndicator size="small" color={APP_GREEN} style={{ marginRight: 10 }} />}
      </View>
      {/* Users List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_GREEN} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.usersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={54} color="#ccc" />
              <Text style={styles.emptyText}>{searchQuery ? "No users found" : "No users available"}</Text>
              {searchQuery && <Text style={styles.emptySubtext}>Try searching with a different term</Text>}
            </View>
          }
        />
      )}
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
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    marginLeft: 8,
    backgroundColor: "transparent",
    paddingVertical: 4,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: APP_GREEN,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: APP_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 12,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
})

export default NewChatScreen
