import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useNavigation } from 'expo-router';
import { messagingService, Message, Thread } from '@/services/messaging';
import { fetchCurrentUser, clearUserCache } from '@/types/userHelpers';

interface ChatScreenProps {
  route?: {
    params?: {
      threadId?: number;
      recipientId?: number;
      recipientName?: string;
      recipientImage?: string;
      propertyDetails?: {
        price: string;
        location: string;
        address: string;
        image: string;
      };
    };
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route = { params: {} } }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const { 
    threadId: initialThreadId, 
    recipientId, 
    recipientName, 
    recipientImage,
    propertyDetails 
  } = route.params || {};
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const loadUser = useCallback(async () => {
    try {
      const user = await fetchCurrentUser();
      
      if (!user) {
        Alert.alert(
          'Session Expired',
          'Please login again to continue',
          [
            {
              text: 'OK',
              onPress: () => {
                clearUserCache();
                router.push('/authentication/signin');
              }
            }
          ]
        );
        return null;
      }

      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Failed to load user:', error);
      Alert.alert('Error', 'Failed to load user data');
      return null;
    }
  }, [router]);

  const loadChatData = useCallback(async (user: User) => {
    try {
      if (!initialThreadId) {
        // Handle case for new chat thread
        if (recipientId) {
          const newThread = await messagingService.createThread({
            participants: [user.id, recipientId]
          });
          setThread(newThread);
          setMessages([]);
        }
        return;
      }
      
      const [threadData, messagesData] = await Promise.all([
        messagingService.getThreadById(initialThreadId),
        messagingService.getThreadMessages(initialThreadId)
      ]);
      
      setThread(threadData);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
      await messagingService.markMessagesAsRead(initialThreadId);
    } catch (error) {
      console.error('Failed to load chat data:', error);
      Alert.alert('Error', 'Failed to load chat messages');
    }
  }, [initialThreadId, recipientId]);

  const loadUserAndChat = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await loadUser();
      if (user) {
        await loadChatData(user);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadUser, loadChatData]);

  useFocusEffect(
    useCallback(() => {
      loadUserAndChat();
      return () => {};
    }, [loadUserAndChat])
  );

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || !thread?.id || !currentUser?.id) return;

    try {
      setIsSending(true);
      const newMessage = {
        text: trimmedMessage,
        thread_id: thread.id,
        sender_id: currentUser.id
      };

      // Optimistic UI update
      const tempMessage: Message = {
        id: Date.now(), // temporary ID
        text: trimmedMessage,
        created_at: new Date().toISOString(),
        is_read: true,
        sender: {
          id: currentUser.id,
          username: currentUser.username,
          profileImage: currentUser.profileImage
        }
      };

      setMessages(prev => [...prev, tempMessage]);
      setMessage('');
      
      // Send to server
      const sentMessage = await messagingService.sendMessage(newMessage);
      
      // Replace temp message with actual message from server
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? sentMessage : msg
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
      // Remove the optimistic update if failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = (msg: Message) => {
    const isCurrentUser = msg.sender.id === currentUser?.id;
    const time = new Date(msg.created_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return isCurrentUser ? (
      <SentMessage
        key={msg.id}
        message={msg.text}
        time={time}
        profileImage={msg.sender.profileImage}
      />
    ) : (
      <ReceivedMessage
        key={msg.id}
        message={msg.text}
        time={time}
        profileImage={recipientImage || msg.sender.profileImage}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {propertyDetails ? (
          <View style={styles.propertyHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Image
              source={{ uri: propertyDetails.image }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyPrice}>{propertyDetails.price}</Text>
              <Text style={styles.propertyAddress}>{propertyDetails.address}</Text>
              <Text style={styles.propertyLocation}>{propertyDetails.location}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.simpleHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            {recipientImage && (
              <Image
                source={{ uri: recipientImage }}
                style={styles.recipientImage}
              />
            )}
            <Text style={styles.headerTitle}>{recipientName || 'Chat'}</Text>
            <View style={{ width: 24 }} />
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.length > 0 ? (
              messages.map(renderMessage)
            ) : (
              <View style={styles.emptyChatContainer}>
                <Text style={styles.emptyChatText}>No messages yet</Text>
                <Text style={styles.emptyChatSubtext}>
                  Start the conversation with {recipientName || 'the recipient'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach-outline" size={24} color="#888" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!isSending}
            onSubmitEditing={handleSend}
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton, 
              message.trim() ? styles.activeSendButton : null
            ]}
            onPress={handleSend}
            disabled={isSending || !message.trim()}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons 
                name="send" 
                size={20} 
                color={message.trim() ? "#fff" : "#888"} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  propertyImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  propertyLocation: {
    fontSize: 12,
    color: '#888',
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 15,
  },
  recipientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  messagesContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyChatText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  emptyChatSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginHorizontal: 10,
    maxHeight: 100,
    fontSize: 16,
    lineHeight: 20,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSendButton: {
    backgroundColor: '#4CAF50',
  },
});

export default ChatScreen;