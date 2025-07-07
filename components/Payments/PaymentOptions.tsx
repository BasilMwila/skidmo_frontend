import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

export default function PaymentOptions() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Payment Options',
      headerShown: false 
    });
  }, [navigation]);

  useEffect(() => {
    if (params.newPayment) {
      const newPayment = JSON.parse(params.newPayment);
      setPaymentMethods(prev => [...prev, newPayment]);
    }
  }, [params.newPayment]);

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const renderPaymentMethod = ({ item }) => (
    <View style={styles.paymentMethodItem}>
      <View style={styles.paymentMethodInfo}>
        {item.type === 'visa' && <MaterialIcons name="credit-card" size={24} color="#000" />}
        {item.type === 'mobile' && <Ionicons name="phone-portrait-outline" size={24} color="#000" />}
        {item.type === 'apple' && <Ionicons name="logo-apple" size={24} color="#000" />}
        {item.type === 'google' && <FontAwesome name="google" size={24} color="#000" />}
        <Text style={styles.paymentMethodText}>
          {item.type === 'visa' ? `•••• •••• •••• ${item.value.slice(-4)}` : item.value}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removePaymentMethod(item.id)}>
        <Ionicons name="close" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const renderPaymentOptions = () => {
    if (paymentMethods.length === 0) {
      return (
        <View style={styles.paymentOptionsContainer}>
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => router.push('/payments/visa')}
          >
            <MaterialIcons name="credit-card" size={24} color="#000" />
            <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => router.push('/payments/mobile')}
          >
            <Ionicons name="phone-portrait-outline" size={24} color="#000" />
            <Text style={styles.paymentOptionText}>Mobile Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.paymentOption}
            onPress={() => router.push('/payments/google')}
          >
            <View style={styles.digitalWalletIcons}>
              <FontAwesome name="google" size={20} color="#000" style={styles.walletIcon} />
              {/* <Ionicons name="logo-apple" size={20} color="#000" /> */}
            </View>
            <Text style={styles.paymentOptionText}>Digital Wallet</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={item => item.id}
        style={styles.paymentMethodsList}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      
      {renderPaymentOptions()}
      
      {paymentMethods.length > 0 && (
        <TouchableOpacity 
          style={styles.addPaymentButton}
          onPress={() => router.push('/payments/add-method')}
        >
          <Ionicons name="add" size={24} color="#00a651" />
          <Text style={[styles.addPaymentText, { color: '#00a651' }]}>Add payment method</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentOptionsContainer: {
    marginTop: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentOptionText: {
    marginLeft: 15,
    fontSize: 16,
  },
  digitalWalletIcons: {
    flexDirection: 'row',
    width: 24,
    justifyContent: 'space-between',
  },
  walletIcon: {
    marginRight: 5,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 16,
    borderWidth: 1,
    borderColor: '#00a651',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 166, 81, 0.1)',
  },
  addPaymentText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  paymentMethodsList: {
    marginTop: 10,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginLeft: 15,
    fontSize: 16,
  },
});