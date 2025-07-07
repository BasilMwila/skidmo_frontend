import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

export default function MobileMoneyProviderScreen() {
  const router = useRouter();
  const { provider } = useLocalSearchParams();
  const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation()
  
    useEffect(() => {
      navigation.setOptions({ 
        title: 'Mobile Money Provider',
        headerShown: false 
      });
    }, [navigation]);

  const getProviderLogo = () => {
    switch(provider) {
      case 'Airtel':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Airtel_logo.svg/1200px-Airtel_logo.svg.png';
      case 'MTN':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/1200px-MTN_Logo.svg.png';
      case 'Zamtel':
        return 'https://www.zamtel.zm/wp-content/uploads/2020/05/zamtel-logo.png';
      default:
        return '';
    }
  };

  const handleAddPayment = () => {
    // Add the payment method and navigate back
    router.push({
      pathname: '/payments/addedPaymentMethod',
      params: { 
        newPayment: JSON.stringify({
          id: Date.now().toString(),
          type: 'mobile',
          provider: provider,
          value: phoneNumber
        })
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.providerContainer}>
        <Image 
          source={{ uri: getProviderLogo() }} 
          style={styles.providerLogo} 
          resizeMode="contain"
        />
        <Text style={styles.providerName}>{provider}</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="+260 97 123 4567"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddPayment}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  providerName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00a651',
    padding: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});