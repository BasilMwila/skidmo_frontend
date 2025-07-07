import { ownerAPI } from '@/services/userApi';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Checkbox } from 'react-native-paper';

const SignUpScreen = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    password: '',
    password2: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

   useEffect(() => {
      navigation.setOptions({ title: 'Account' });
    }, [navigation]);
  

  const handleSignUp = async () => {
    // Basic validation

    if (!formData.name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!formData.phone_number || !formData.password || !formData.password2) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.password2) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      await ownerAPI.register({
        name: formData.name,
        phone_number: formData.phone_number,
        password: formData.password,
        password2: formData.password2,
      });

      Alert.alert('Success', 'Account created successfully!', [
        { 
          text: 'OK', 
          onPress: () => router.push('/authentication/signin') 
        }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} login will be available soon`);
    // Implement actual social login logic here
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Joe Doe" 
          placeholderTextColor="#aaa" 
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          autoCapitalize="none"
          autoFocus
        />
        <TextInput 
          style={styles.input} 
          placeholder="097 123 4567" 
          placeholderTextColor="#aaa" 
          value={formData.phone_number}
          onChangeText={(text) => handleInputChange('phone_number', text)}
          autoCapitalize="none"
          autoFocus
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#aaa" 
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirm Password" 
          placeholderTextColor="#aaa" 
          secureTextEntry
          value={formData.password2}
          onChangeText={(text) => handleInputChange('password2', text)}
        />
        
        <View style={styles.termsContainer}>
          <Checkbox.Android
            status={acceptTerms ? 'checked' : 'unchecked'}
            onPress={() => setAcceptTerms(!acceptTerms)}
            color="#0AAD4D"
            uncheckedColor="#aaa"
          />
          <Text style={styles.termsText}>
           <Text> 
            By selecting agree and continue, I agree to to the {' '} 
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
            Open source Licence.
            </Text>
            <Text style={styles.secondText}>Read the Terms and Tonditions</Text>
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.agreeButton, loading && styles.agreeText]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.agreeText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View> */}

        {/* Social Login Buttons */}
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Email')}
        >
          <Ionicons style={styles.socialIcon} name="mail-outline" size={20} color="black" />
          <Text style={styles.socialText}>Continue with Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Facebook')}
        >
          <Ionicons style={styles.socialIcon} name="logo-facebook" size={20} color="#3b5998" />
          <Text style={styles.socialText}>Continue with Facebook</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Google')}
        >
          <Ionicons style={styles.socialIcon} name="logo-google" size={20} color="#DB4437" />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => handleSocialLogin('Apple')}
        >
          <Ionicons style={styles.socialIcon} name="logo-apple" size={20} color="black" />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>
        
        {/* <Text style={styles.signupText}>
          Already have an account?{' '}
          <Link href="/authentication/signin" asChild>
              <Text style={styles.signupLink}>Sign in</Text>
          </Link>
          </Text> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row', 
  },
  termsText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
  },
  signupText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
   signupLink: {
    color: 'black',
    fontWeight: 'bold',
  },
  agreeButton: {
    backgroundColor: '#0AAD4D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  agreeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  socialIcon: {
    position: 'absolute',
    left: 0,
    top: 10,
    marginLeft: 10,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
    alignItems: 'center',
  },
});


export default SignUpScreen;