// app/terms-and-conditions.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

const TermsAndConditions = () => {
  const router = useRouter();
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Terms and Conditions',
      headerShown: false 
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
        </View>
        
        <Text style={styles.title}>Terms and Conditions</Text>
        
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => router.push('/terms/payment')}
        >
          <Text style={styles.optionText}>Terms and Conditions of payment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.optionItem}
          onPress={() => router.push('/settings/termsofservice')}
        >
          <Text style={styles.optionText}>Terms and Conditions of app use</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
  },
});

export default TermsAndConditions;
