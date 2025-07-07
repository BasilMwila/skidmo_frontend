"use client"

import { ownerAPI } from "@/services/userApi"; // Adjust path as needed
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useNavigation, useRouter } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigation from "../BottomNavigation";

interface UserData {
  id?: number
  phone_number: string
  name: string
  email: string
  user_type?: string
  // phone_number?: string
  profile_picture?: string | null
  status_verification?: 'verified' | 'pending' | 'not_verified' // Add this property
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap
  text: string
  onPress?: () => void
}


const ProfileScreen = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const navigation = useNavigation()
  const router = useRouter()

  useEffect(() => {
    navigation.setOptions({ 
      title: "Profile",
    })
  }, [navigation])

  useEffect(() => {
    if (user?.status_verification) {
      const verified = user.status_verification === 'verified';
      setIsVerified(verified);
      AsyncStorage.setItem('is_verified', verified.toString());
    }
  }, [user?.status_verification])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id')
        const verifiedStatus = await AsyncStorage.getItem('is_verified')

        if (verifiedStatus) {
          setIsVerified(verifiedStatus === 'true')
        }

        if (userId) {
          const userData = await ownerAPI.getUserInfo(userId)
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        Alert.alert("Error", "Failed to fetch user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isVerified])

  const handleListProperty = () => {
    console.log("List Property button pressed. isVerified:", isVerified); // Debugging output
  
    if (isVerified) {
      // If verified, redirect to the list screen
      console.log("User is verified. Redirecting to Listings..."); // Debugging output
      router.push("/Listings"); // Adjust the route as needed
    } else {
      // If not verified, show the modal
      console.log("User is not verified. Showing modal..."); // Debugging output
      setModalVisible(true);
    }
  };

  const handleProceed = () => {
    setModalVisible(false)
    router.push("/authentication/edit") // Navigate to edit profile
  }

  const handleClickProceed = () => {
    setModalVisible(false)
    router.push("/authentication/verification") // Navigate to verification
  }

  const handleLogout = async () => {
    try {
      await ownerAPI.logout();
      await AsyncStorage.clear();
      router.replace('/authentication/signin');
      Alert.alert('Logged out', 'You have been logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };


  if (!isVerified) {
    // return <VerificationScreen />;
  }

  if (loading && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00a651" />
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar} />
            <View>
            <Text style={styles.name}>{user?.name || "Joe Doe"}</Text>
            <Text style={styles.name}>{user?.phone_number || "No User"}</Text>
            {/* {user?.phone_number && <Text style={styles.phone}>{user.phone_number}</Text>} */}
          </View>
          </View>
          <Link href="/authentication/edit" asChild>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity style={styles.listButton} onPress={handleListProperty}>
          <Text style={styles.listButtonText}>+ List Property</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>You're one step away</Text>
              <Text style={styles.modalText}>
                Before listing your property on Skidmo, please complete your profile and verify your identity.
              </Text>
              <TouchableOpacity style={styles.proceedButton} onPress={handleClickProceed}>
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.menu}>
          {/* Only show these items to verified users */}
          {isVerified && (
            <>
              <MenuItem 
                icon="list" 
                text="Dashboard" 
                onPress={() => router.push("/dashboard")} 
              />
            </>
          )}

          {/* These items are available to all users */}
          <MenuItem 
              icon="heart-outline" 
              text="Booking history" 
              onPress={() => router.push("/dashboard/bookingHistory")} 
          />
          <MenuItem 
              icon="card-outline" 
              text="Payment methods" 
              onPress={() => router.push("/payments")}
          />
          <MenuItem 
            icon="help-circle-outline" 
            text="Get help" 
            onPress={() => router.push("/help")}
          />
          <MenuItem 
            icon="settings-outline" 
            text="Settings" 
            onPress={() => router.push("/settings")}
          />
          <MenuItem 
            icon="log-out-outline" 
            text="Log out"
            onPress={handleLogout}
          />
        </View>
      </View>
      <View style={styles.bottomNavContainer}>
        <BottomNavigation/>
      </View> 
    </View>
  )
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="black" style={styles.icon} />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
    color: "gray",
  },
  listButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  listButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  proceedButton: {
    backgroundColor: 'green',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    marginTop: 4,
  },
  verifiedStatus: {
    color: 'green',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pendingStatus: {
    color: 'blue',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notVerifiedStatus: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default ProfileScreen