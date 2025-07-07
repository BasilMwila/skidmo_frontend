import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

const PaymentMethodsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({ 
      title: 'Payment Methods',
      headerShown: false 
    });
  }, [navigation]);

  const handleAddPayment = () => {
    // Navigate to your add payment screen
    router.push('/payments/paymentOptions'); // Change this to your actual add payment route
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment methods</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.paymentContainer}>
          <TouchableOpacity 
            style={styles.addPaymentButton}
            onPress={handleAddPayment}
          >
            <AntDesign name="plus" size={20} color="black" />
            <Text style={styles.addPaymentText}>Add payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20, // Adjusts for the status bar height
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1, // Adds space at the top
  },
  paymentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start', // Aligns content to the top
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginTop: 20, // Additional space from top if needed
  },
  addPaymentText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default PaymentMethodsScreen;