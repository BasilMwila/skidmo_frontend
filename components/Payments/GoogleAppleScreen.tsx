import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function GoogleAppleScreen() {
  const router = useRouter();
    const navigation = useNavigation()
  
    useEffect(() => {
      navigation.setOptions({ 
        title: 'Google | Apple',
        headerShown: false 
      });
    }, [navigation]);

  const handleContinueWithApple = () => {
    // Handle Apple authentication
    // Then navigate back with the new payment method
    router.push({
      pathname: '/payments/addedPaymentMethod',
      params: {
        newPayment: JSON.stringify({
          id: Date.now().toString(),
          type: 'apple',
          value: 'Apple Pay'
        })
      }
    });
  };

  const handleContinueWithGoogle = () => {
    // Handle Google authentication
    router.push({
      pathname: '/payment-methods',
      params: {
        newPayment: JSON.stringify({
          id: Date.now().toString(),
          type: 'google',
          value: 'Google Pay'
        })
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.appleButton}
        onPress={handleContinueWithApple}
      >
        <Ionicons name="logo-apple" size={24} color="#000" />
        <Text style={styles.appleButtonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleContinueWithGoogle}
      >
        <Ionicons name="logo-google" size={24} color="#4285F4" />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  appleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  googleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#4285F4',
  },
});