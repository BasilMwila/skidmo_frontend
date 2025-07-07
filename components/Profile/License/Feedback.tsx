// app/feedback/index.js
import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';

const RadioButton = ({ selected, onPress, label }) => {
  return (
    <TouchableOpacity style={styles.radioOption} onPress={onPress}>
      <View style={styles.radioCircle}>
        {selected && <View style={styles.selectedRadioCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const FeedbackForm = () => {
  const router = useRouter();
  const [userType, setUserType] = useState('Owner');
  const [feedbackType, setFeedbackType] = useState(null);
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      title: 'Feedback Form',
      headerShown: false 
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!feedbackType) {
      Alert.alert('Error', 'Please select a feedback type');
      return;
    }
    if (!description) {
      Alert.alert('Error', 'Please describe your feedback');
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log({
      userType,
      feedbackType,
      description,
      email
    });

    Alert.alert('Success', 'Thank you for your feedback!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Give us feedback</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Listed by</Text>
        
        <View style={styles.radioGroup}>
          <RadioButton 
            selected={userType === 'Owner'} 
            onPress={() => setUserType('Owner')} 
            label="Owner" 
          />
          <RadioButton 
            selected={userType === 'Agent'} 
            onPress={() => setUserType('Agent')} 
            label="Agent" 
          />
        </View>
        
        <Text style={styles.sectionTitle}>What do you want to write to us about</Text>
        
        <View style={styles.radioGroup}>
          <RadioButton 
            selected={feedbackType === 'Listing search'} 
            onPress={() => setFeedbackType('Listing search')} 
            label="Listing search" 
          />
          <RadioButton 
            selected={feedbackType === "I can't place a listing"} 
            onPress={() => setFeedbackType("I can't place a listing")} 
            label="I can't place a listing" 
          />
          <RadioButton 
            selected={feedbackType === 'Blocking'} 
            onPress={() => setFeedbackType('Blocking')} 
            label="Blocking" 
          />
          <RadioButton 
            selected={feedbackType === 'Payment'} 
            onPress={() => setFeedbackType('Payment')} 
            label="Payment" 
          />
          <RadioButton 
            selected={feedbackType === 'Suggestions'} 
            onPress={() => setFeedbackType('Suggestions')} 
            label="Suggestions" 
          />
        </View>
        
        <Text style={styles.sectionTitle}>Describe your problem in more detail</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Please describe your issue..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        
        <Text style={styles.sectionTitle}>Add screenshot (optional)</Text>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => console.log('Add photo pressed')}
        >
          <Ionicons name="add" size={24} color="black" />
          <Text style={styles.uploadButtonText}>Add photos</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Email address to which we will send the reply</Text>
        <TextInput
          style={styles.emailInput}
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleSubmit}
        >
          <Text style={styles.sendButtonText}>Send Feedback</Text>
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
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  radioGroup: {
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00A86B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00A86B',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  emailInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00A86B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 2,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackForm;