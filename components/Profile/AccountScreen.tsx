import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useNavigation, router } from 'expo-router';
import { ownerAPI } from '@/services/userApi';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const [authState, setAuthState] = useState<{
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
    }>({
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        navigation.setOptions({ title: 'Account' });
        
        const checkAuth = async () => {
            try {
                const authenticated = await ownerAPI.isAuthenticated();
                setAuthState({
                    isAuthenticated: authenticated,
                    isLoading: false,
                    error: null
                });
                
                // Redirect to dashboard if authenticated
                if (authenticated) {
                    router.replace('/authentication/account');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Failed to check authentication'
                });
            }
        };

        checkAuth();
        
        // Add listener for authentication changes when screen comes into focus
        const unsubscribe = navigation.addListener('focus', checkAuth);
        
        return unsubscribe;
    }, [navigation]);

    if (authState.isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Log in to your account to book, sell or buy real estate</Text>
            
            <Link href="/authentication/signin/" asChild>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginText}>Log in</Text>
                </TouchableOpacity>
            </Link>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.option}
                onPress={() => router.push('/help')}
              >
                <Ionicons name="help-circle-outline" size={20} color="black" />
                <Text style={styles.optionText}>Get help</Text>
              </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.option}
                  onPress={() => router.push('/settings')}
                  >
                  <Ionicons name="settings-outline" size={20} color="black" />
                  <Text style={styles.optionText}>Settings</Text>
                </TouchableOpacity>
            </View>
            {/* <BottomNavigation/> */}
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#0AAD4D',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsContainer: {
        marginTop: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default ProfileScreen;