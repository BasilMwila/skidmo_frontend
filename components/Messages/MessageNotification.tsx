import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useRouter, useNavigation } from 'expo-router';
import {ownerAPI} from "@/services/userApi";

const MessagesNotification = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authenticated = await ownerAPI.isAuthenticated();
                setAuthState({
                    isAuthenticated: authenticated,
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                console.error('Auth check error:', error);
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    error: error.message || 'Failed to check authentication'
                });
            }
        };

        checkAuth();
        
        const unsubscribe = navigation.addListener('focus', checkAuth);
        
        return () => unsubscribe();
    }, [router]);

    if (authState.isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!authState.isAuthenticated) {
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={require("@/assets/container_icons/message.png")} style={styles.image} />
                </View>
                <Text style={styles.title}>Log in to see messages</Text>
                <Text style={styles.subtitle}>
                    You can communicate with the vendors to find out more information
                </Text>
                <Link href="/authentication/signin" asChild>
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Log in</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        );
    }

    // Authenticated user view
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={require("@/assets/container_icons/message.png")} style={styles.image} />
            </View>
            <Text style={styles.title}>No messages yet</Text>
            <Text style={styles.subtitle}>
                Start a conversation with vendors to get more information
            </Text>
            
            {/* Floating action button for new chat */}
            <TouchableOpacity 
                style={styles.newChatButton}
                onPress={() => router.push("/conversation/newchat/index")}
            >
                <Text style={styles.newChatButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        backgroundColor: "#E6F4EA",
        padding: 20,
        borderRadius: 100,
        marginBottom: 20,
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: "#00A551",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    newChatButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00A551',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    newChatButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

export default MessagesNotification;