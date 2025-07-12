// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import { Link, useNavigation } from 'expo-router';
// import { ownerAPI } from '@/services/userApi';
// import WishlistHistory from "./WishListHistory";

// const WishlistNotification = () => {
//     const navigation = useNavigation();
//     const [authState, setAuthState] = useState({
//         isAuthenticated: false,
//         isLoading: true,
//         error: null
//     });

//     useEffect(() => {
//         navigation.setOptions({ title: 'Wishlist' });
        
//         const checkAuth = async () => {
//             try {
//                 const authenticated = await ownerAPI.isAuthenticated();
//                 setAuthState({
//                     isAuthenticated: authenticated,
//                     isLoading: false,
//                     error: null
//                 });
//             } catch (error) {
//                 console.error('Auth check error:', error);
//                 setAuthState({
//                     isAuthenticated: false,
//                     isLoading: false,
//                     error: error.message || 'Failed to check authentication'
//                 });
//             }
//         };

//         checkAuth();
        
//         // Optional: Add a listener for authentication changes if your app supports it
//         const unsubscribe = navigation.addListener('focus', checkAuth);
        
//         return unsubscribe;
//     }, [navigation]);

//     if (authState.isLoading) {
//         return (
//             <View style={[styles.container, styles.loadingContainer]}>
//                 <ActivityIndicator size="large" />
//             </View>
//         );
//     }

//     if (authState.error) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.errorText}>Error: {authState.error}</Text>
//                 <TouchableOpacity 
//                     style={styles.loginButton}
//                     onPress={() => checkAuth()}
//                 >
//                     <Text style={styles.loginButtonText}>Retry</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     if (authState.isAuthenticated) {
//         return (
//             <View style={styles.container}>
//                 <WishlistHistory/>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <View style={styles.imageContainer}>
//                 <Image 
//                     source={require("@/assets/container_icons/wishlist.png")} 
//                     style={styles.image} 
//                 />
//             </View>
//             <Text style={styles.title}>Log in to see Wishlist</Text>
//             <Text style={styles.subtitle}>
//                 You can communicate with the vendors to find out more information
//             </Text>
//             <Link href="/authentication/signin" asChild>
//                 <TouchableOpacity style={styles.loginButton}>
//                     <Text style={styles.loginButtonText}>Log in</Text>
//                 </TouchableOpacity>
//             </Link>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//         backgroundColor: "#fff",
//     },
//     loadingContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     imageContainer: {
//         backgroundColor: "#E6F4EA",
//         padding: 20,
//         borderRadius: 100,
//         marginBottom: 20,
//     },
//     image: {
//         width: 80,
//         height: 80,
//         resizeMode: "contain",
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginBottom: 10,
//         textAlign: "center",
//     },
//     subtitle: {
//         fontSize: 14,
//         color: "gray",
//         textAlign: "center",
//         marginBottom: 20,
//         maxWidth: 300,
//     },
//     loginButton: {
//         backgroundColor: "#00A551",
//         paddingVertical: 12,
//         paddingHorizontal: 40,
//         borderRadius: 8,
//         minWidth: 150,
//         alignItems: 'center',
//     },
//     loginButtonText: {
//         color: "white",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
//     actionButton: {
//         backgroundColor: "#00A551",
//         paddingVertical: 12,
//         paddingHorizontal: 40,
//         borderRadius: 8,
//         minWidth: 200,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     actionButtonText: {
//         color: "white",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
// });

// export default WishlistNotification;

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useNavigation } from 'expo-router';
import { ownerAPI } from '@/services/userApi';
import WishlistHistory from "./WishListHistory";

const WishlistNotification = () => {
  const navigation = useNavigation();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await ownerAPI.isAuthenticated();
      setAuthState({
        isAuthenticated: authenticated,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: error.message || "Failed to check authentication",
      });
    }
  }, []);

  useEffect(() => {
    if (navigation?.setOptions) {
      navigation.setOptions({ title: "Wishlist" });
    }

    checkAuth();

    const unsubscribe = navigation.addListener("focus", checkAuth);
    return unsubscribe;
  }, [navigation, checkAuth]);

  if (authState.isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (authState.error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {authState.error}</Text>
        <TouchableOpacity style={styles.loginButton} onPress={checkAuth}>
          <Text style={styles.loginButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (authState.isAuthenticated) {
    return (
      <View style={styles.container}>
        <WishlistHistory />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/container_icons/wishlist.png")}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>Log in to see Wishlist</Text>
      <Text style={styles.subtitle}>
        You can communicate with the vendors to find out more information
      </Text>
      <Link href="/authentication/signin" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  imageContainer: {
    backgroundColor: "#E6F4EA",
    padding: 20,
    borderRadius: 100,
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 300,
  },
  loginButton: {
    backgroundColor: "#00A551",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default WishlistNotification;
