// app/open-source-licenses.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

const OpenSourceLicenses = () => {
  const router = useRouter();
    const navigation = useNavigation()
  
    useEffect(() => {
      navigation.setOptions({ 
        title: 'Open Source License',
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
          <Text style={styles.headerTitle}>Open source licenses</Text>
        </View>
        
        <Text style={styles.title}>Open source licenses</Text>
        
        <Text style={styles.paragraph}>
          This app uses the following open source libraries:
        </Text>

        {/* Example library entry */}
        <View style={styles.libraryContainer}>
          <Text style={styles.libraryName}>React Native</Text>
          <Text style={styles.libraryLicense}>MIT License</Text>
        </View>

        <View style={styles.libraryContainer}>
          <Text style={styles.libraryName}>Expo</Text>
          <Text style={styles.libraryLicense}>MIT License</Text>
        </View>

        <View style={styles.libraryContainer}>
          <Text style={styles.libraryName}>React Navigation</Text>
          <Text style={styles.libraryLicense}>MIT License</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  libraryContainer: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  libraryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  libraryLicense: {
    fontSize: 14,
    color: '#666',
  },
});

export default OpenSourceLicenses;