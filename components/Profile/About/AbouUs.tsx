// app/about/index.js
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';

const AboutApp = () => {
  const router = useRouter();
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      headerShown: false 
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About App</Text>
        </View>
        
        <Text style={styles.title}>Our Application</Text>
        
        <Text style={styles.paragraph}>
          Welcome to our property listing application, designed to make finding and listing properties 
          a seamless experience. Our app connects buyers, renters, and property owners in an intuitive 
          platform with powerful search capabilities.
        </Text>
        
        <Text style={styles.subtitle}>Key Features:</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="search" size={20} color="#00A86B" style={styles.featureIcon} />
          <Text style={styles.featureText}>Advanced property search with filters</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="map" size={20} color="#00A86B" style={styles.featureIcon} />
          <Text style={styles.featureText}>Interactive map view</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="camera" size={20} color="#00A86B" style={styles.featureIcon} />
          <Text style={styles.featureText}>High-quality property images</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="chatbubbles" size={20} color="#00A86B" style={styles.featureIcon} />
          <Text style={styles.featureText}>Direct messaging with agents/owners</Text>
        </View>
        
        <Text style={styles.subtitle}>Version Information</Text>
        <Text style={styles.versionText}>Current Version: 0.0.1</Text>
        <Text style={styles.versionText}>Last Updated: May 2025</Text>
        
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => router.push('/contact')}
        >
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginRight: 24,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
  },
  versionText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  contactButton: {
    backgroundColor: '#00A86B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AboutApp;