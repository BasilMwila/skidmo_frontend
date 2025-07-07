import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';

export default function VisaScreen() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [nameAndSurname, setNameAndSurname] = useState('');
  const [cvc, setCvc] = useState('');
  const [date, setDate] = useState('');
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Visa Payments',
      headerShown: false 
    });
  }, [navigation]);

  const handleAddCard = () => {
    // Add the card and navigate back with the new payment method
    router.push({
      pathname: '/payments/addedPaymentMethod',
      params: { 
        newPayment: JSON.stringify({
          id: Date.now().toString(),
          type: 'visa',
          value: cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
        })
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VISA</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Card number</Text>
        <TextInput
          style={styles.input}
          placeholder="5568 8990 8877 9907"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
        />
        {cardNumber ? (
          <TouchableOpacity style={styles.clearButton} onPress={() => setCardNumber('')}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <TextInput
        style={[styles.input, styles.nameInput]}
        placeholder="Name and surname"
        value={nameAndSurname}
        onChangeText={setNameAndSurname}
      />
      
      <View style={styles.rowInputs}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVC"
          value={cvc}
          onChangeText={setCvc}
          keyboardType="numeric"
          maxLength={3}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="MM/YY"
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddCard}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add card</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  inputLabel: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#666',
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  nameInput: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
    backgroundColor: '#f5f5f5',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00a651',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});