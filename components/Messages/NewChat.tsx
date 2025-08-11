"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
import { Text } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useNavigation } from "expo-router"
import { messagingService } from "@/services/messaging"
import { ownerAPI } from "@/services/userApi"
import { fetchCurrentUser } from "@/types/userHelpers"
import { Image } from "react-native"

interface User {
  id: number
  username: string
  email: string
  profileImage?: string
  first_name?: string
  last_name?: string
}

const NewChat: React.FC = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    navigation.setOptions({
      title: "New Chat",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    })
  }, [navigation])

  const loadCurrentUser = useCallback(async () => {
    try {
      const user = await fetchCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to load current user:", error)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      // This would typically be an API call to get all users or recent contacts
      // For now, we'll use a placeholder implementation
      const response = (await ownerAPI.getAllUsers?.()) || []
      const allUsers = Array.isArray(response) ? response : []

      // Filter out current user
      const otherUsers = allUsers.filter((user) => user.id !== currentUser?.id)
      setUsers(otherUsers)
      setFilteredUsers(otherUsers)
    } catch (error) {
      console.error("Failed to load users:", error)
      Alert.alert("Error", "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [currentUser])

  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setFilteredUsers(users)
        return
      }

      try {
        setIsSearching(true)
        // Filter existing users by username or email
        const filtered = users.filter(
          (user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(query.toLowerCase()),
        )
        setFilteredUsers(filtered)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    },
    [users],
  )

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  useEffect(() => {
    if (currentUser) {
      loadUsers()
    }
  }, [currentUser, loadUsers])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchUsers])

  const handleUserSelect = async (selectedUser: User) => {
    try {
      setIsLoading(true)
      if (!currentUser || !currentUser.id) {
        Alert.alert("Error", "Current user not loaded")
        return
      }
      // Get or create thread with both users as participants
      const thread = await messagingService.createOrGetThread(currentUser.id, selectedUser.id)
      // Navigate to chat screen
      router.push({
        pathname: "/chat",
        params: {
          threadId: thread.id,
          recipientId: selectedUser.id,
          recipientName: selectedUser.username,
          recipientImage: selectedUser.profileImage,
        },
      })
    } catch (error) {
      console.error("Failed to start conversation:", error)
      Alert.alert("Error", "Failed to start conversation")
    } finally {
      setIsLoading(false)
    }
  }

  const renderUser = ({ item: user }: { item: User }) => {
    const displayName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username

    return (
      <TouchableOpacity style={styles.userItem} onPress={() => handleUserSelect(user)} disabled={isLoading}>
        <View style={styles.avatarContainer}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.emptyText}>Loading users...</Text>
        </View>
      )
    }

    if (searchQuery && filteredUsers.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No users found</Text>
          <Text style={styles.emptySubtext}>Try searching with a different username or email</Text>
        </View>
      )
    }

    if (users.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No users available</Text>
          <Text style={styles.emptySubtext}>There are no other users to start a conversation with</Text>
        </View>
      )
    }

    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && <ActivityIndicator size="small" color="#4CAF50" style={styles.searchLoader} />}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchLoader: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  defaultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
})

export default NewChat
