import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function MobileMoneyScreen() {
  const router = useRouter();
    const navigation = useNavigation()
  
    useEffect(() => {
      navigation.setOptions({ 
        title: 'Moblie Money',
        headerShown: false 
      });
    }, [navigation]);
  
  const providers = [
    { id: '1', name: 'Airtel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Airtel_logo.svg/1200px-Airtel_logo.svg.png' },
    { id: '2', name: 'MTN', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/1200px-MTN_Logo.svg.png' },
    { id: '3', name: 'Zamtel', logo: 'https://www.zamtel.zm/wp-content/uploads/2020/05/zamtel-logo.png' },
  ];

  return (
    <View style={styles.container}>
      {providers.map(provider => (
        <TouchableOpacity 
          key={provider.id}
          style={styles.providerItem}
          onPress={() => router.push(`/mobile-money-provider/${provider.name}`)}
        >
          <Image 
            source={{ uri: provider.logo }} 
            style={styles.providerLogo} 
            resizeMode="contain"
          />
          <Text style={styles.providerName}>{provider.name}</Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#ccc" 
            style={styles.chevron}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 5,
  },
  providerName: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
});