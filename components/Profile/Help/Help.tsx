import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';

const GetHelpScreen = () => {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Booking History',
      headerShown: false 
    });
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get help</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={80}
      >
        <ScrollView style={styles.messagesContainer}>
          <View style={styles.supportMessage}>
            <Text style={styles.supportMessageText}>
              Our support team is working 24/7 hours and will help you resolve any issue.
            </Text>
          </View>
          
          <View style={styles.systemMessage}>
            <Text style={styles.systemMessageText}>
              Good afternoon. Write your question.
            </Text>
            <Text style={styles.timeStamp}>09:40</Text>
          </View>
          
          <View style={styles.userMessage}>
            <Text style={styles.userMessageText}>
              How to add a payment method?
            </Text>
            <Text style={styles.userTimeStamp}>09:41</Text>
          </View>
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Feather name="arrow-up" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16, // Added padding to replace SafeAreaView
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
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  supportMessage: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  supportMessageText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  systemMessage: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#333',
  },
  timeStamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userMessage: {
    backgroundColor: '#e7f7e8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 14,
    color: '#333',
  },
  userTimeStamp: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GetHelpScreen;