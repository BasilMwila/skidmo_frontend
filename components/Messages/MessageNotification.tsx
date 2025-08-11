// // "use client"

// // import { useEffect, useState } from "react"
// // import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
// // import { Link, useRouter, useNavigation } from "expo-router"
// // import { ownerAPI } from "@/services/userApi"
// // import ConversationBody from "./CoversationBody"

// // const MessagesNotification = () => {
// //   const router = useRouter()
// //   const navigation = useNavigation()
// //   const [authState, setAuthState] = useState({
// //     isAuthenticated: false,
// //     isLoading: true,
// //     error: null,
// //   })

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         const authenticated = await ownerAPI.isAuthenticated()
// //         setAuthState({
// //           isAuthenticated: authenticated,
// //           isLoading: false,
// //           error: null,
// //         })
// //       } catch (error) {
// //         console.error("Auth check error:", error)
// //         setAuthState({
// //           isAuthenticated: false,
// //           isLoading: false,
// //           error: error.message || "Failed to check authentication",
// //         })
// //       }
// //     }

// //     checkAuth()

// //     const unsubscribe = navigation.addListener("focus", checkAuth)

// //     return () => unsubscribe()
// //   }, [router])

// //   if (authState.isLoading) {
// //     return (
// //       <View style={[styles.container, styles.loadingContainer]}>
// //         <ActivityIndicator size="large" color="#00A551" />
// //       </View>
// //     )
// //   }

// //   if (!authState.isAuthenticated) {
// //     return (
// //       <View style={styles.container}>
// //         <View style={styles.imageContainer}>
// //           <Image source={require("@/assets/container_icons/message.png")} style={styles.image} />
// //         </View>
// //         <Text style={styles.title}>Log in to see messages</Text>
// //         <Text style={styles.subtitle}>You can communicate with the vendors to find out more information</Text>
// //         <Link href="/authentication/signin" asChild>
// //           <TouchableOpacity style={styles.loginButton}>
// //             <Text style={styles.loginButtonText}>Log in</Text>
// //           </TouchableOpacity>
// //         </Link>
// //       </View>
// //     )
// //   }

// //   // Authenticated user view - show conversation list
// //   return <ConversationBody />
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //     backgroundColor: "#fff",
// //   },
// //   loadingContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   imageContainer: {
// //     backgroundColor: "#E6F4EA",
// //     padding: 20,
// //     borderRadius: 100,
// //     marginBottom: 20,
// //   },
// //   image: {
// //     width: 80,
// //     height: 80,
// //     resizeMode: "contain",
// //   },
// //   title: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     marginBottom: 10,
// //     textAlign: "center",
// //   },
// //   subtitle: {
// //     fontSize: 14,
// //     color: "gray",
// //     textAlign: "center",
// //     marginBottom: 20,
// //   },
// //   loginButton: {
// //     backgroundColor: "#00A551",
// //     paddingVertical: 12,
// //     paddingHorizontal: 40,
// //     borderRadius: 8,
// //   },
// //   loginButtonText: {
// //     color: "white",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// // })

// // export default MessagesNotification


// "use client"

// import { useEffect, useState } from "react"
// import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
// import { Link, useRouter, useNavigation } from "expo-router"
// import { ownerAPI } from "@/services/userApi"
// import ConversationBody from "./CoversationBody"

// const MessagesNotification = () => {
//   const router = useRouter()
//   const navigation = useNavigation()
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     isLoading: true,
//     error: null,
//   })

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const authenticated = await ownerAPI.isAuthenticated()
//         setAuthState({
//           isAuthenticated: authenticated,
//           isLoading: false,
//           error: null,
//         })
//       } catch (error) {
//         console.error("Auth check error:", error)
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           error: error.message || "Failed to check authentication",
//         })
//       }
//     }

//     checkAuth()

//     const unsubscribe = navigation.addListener("focus", checkAuth)

//     return () => unsubscribe()
//   }, [router])

//   if (authState.isLoading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#00A551" />
//       </View>
//     )
//   }

//   if (!authState.isAuthenticated) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.imageContainer}>
//           <Image source={require("@/assets/container_icons/message.png")} style={styles.image} />
//         </View>
//         <Text style={styles.title}>Log in to see messages</Text>
//         <Text style={styles.subtitle}>You can communicate with the vendors to find out more information</Text>
//         <Link href="/authentication/signin" asChild>
//           <TouchableOpacity style={styles.loginButton}>
//             <Text style={styles.loginButtonText}>Log in</Text>
//           </TouchableOpacity>
//         </Link>
//       </View>
//     )
//   }

//   // Authenticated user view - show conversation list
//   return <ConversationBody />
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     backgroundColor: "#fff",
//   },
//   loadingContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imageContainer: {
//     backgroundColor: "#E6F4EA",
//     padding: 20,
//     borderRadius: 100,
//     marginBottom: 20,
//   },
//   image: {
//     width: 80,
//     height: 80,
//     resizeMode: "contain",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "gray",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   loginButton: {
//     backgroundColor: "#00A551",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//   },
//   loginButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

// export default MessagesNotification


"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native"
import { Link, useRouter, useNavigation } from "expo-router"
import { ownerAPI } from "@/services/userApi"
import ConversationBody from "./CoversationBody"

const APP_GREEN = "#00A551"

const MessagesNotification = () => {
  const router = useRouter()
  const navigation = useNavigation()
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    error: null as string | null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await ownerAPI.isAuthenticated()
        setAuthState({
          isAuthenticated: authenticated,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to check authentication",
        })
      }
    }

    checkAuth()

    const unsubscribe = navigation.addListener("focus", checkAuth)

    return () => unsubscribe()
  }, [router])

  if (authState.isLoading) {
    return (
      <View style={styles.container}>
        {/* WhatsApp-style Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_GREEN} />
          <Text style={styles.loadingText}>Checking login status...</Text>
        </View>
      </View>
    )
  }

  // Authenticated user view - show conversation list
  if (authState.isAuthenticated) {
    return <ConversationBody />
  }

  // Not authenticated - show WhatsApp-like placeholder
  return (
    <View style={styles.container}>
      {/* WhatsApp-style Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Text>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for non-authenticated users */}
      <FlatList
        data={[]}
        ListHeaderComponent={
          <View style={styles.placeholderContainer}>
            <Image
              source={require("@/assets/container_icons/message.png")}
              style={styles.placeholderImage}
            />
            <Text style={styles.placeholderTitle}>Log in to see messages</Text>
            <Text style={styles.placeholderSubtitle}>
              You can communicate with vendors to find out more information
            </Text>
            <Link href="/authentication/signin" asChild>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
        keyExtractor={() => "placeholder"}
        renderItem={null}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button (hidden when not authenticated) */}
    </View>
  )
}

export default MessagesNotification


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5ddd5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#075E54",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5ddd5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#e5ddd5",
  },
  placeholderImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: APP_GREEN,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})