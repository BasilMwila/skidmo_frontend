import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons, Feather, AntDesign, FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { ownerAPI } from '@/services/userApi';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerificationScreen from './VerificationScreen';

interface UserData {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  date_of_birth?: string;
  nrc_number?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  town?: string;
  province?: string;
  postal_code?: string;
  nrc_front?: string;
  nrc_back?: string;
  passport_photo?: string;
  drivers_license_front?: string;
  drivers_license_back?: string;
  bank_statement?: string;
  utility_bill?: string;
  selfie?: string;
}

interface DocumentUploaderProps {
  title: string;
  documentUrl?: string;
  onUpload: (uri: string) => void;
  isImage?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ title, documentUrl, onUpload, isImage = false }) => {
  const handlePress = async () => {
    if (documentUrl) {
      Alert.alert(
        title,
        'What would you like to do?',
        [
          {
            text: 'View Document',
            onPress: () => console.log('Preview would open here'),
          },
          {
            text: 'Replace Document',
            onPress: pickDocument,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      await pickDocument();
    }
  };

  const pickDocument = async () => {
    try {
      let result;
      
      if (isImage) {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
          onUpload(result.assets[0].uri);
        }
      } else {
        result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });

        if (result.type === 'success') {
          onUpload(result.uri);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select document');
      console.error(err);
    }
  };

  return (
    <View style={styles.documentContainer}>
      <Text style={styles.documentTitle}>{title}</Text>
      
      <TouchableOpacity 
        style={documentUrl ? styles.documentPreview : styles.documentUpload} 
        onPress={handlePress}
      >
        {documentUrl ? (
          <>
            <Text style={styles.documentPreviewText}>Document uploaded</Text>
            <Feather name="check-circle" size={20} color="#00a651" />
          </>
        ) : (
          <>
            <Text style={styles.documentUploadText}>
              {isImage ? 'Upload Image' : 'Upload Document'}
            </Text>
            <Feather name="upload" size={20} color="#666" />
          </>
        )}
      </TouchableOpacity>
      
      {documentUrl && (
        <Image 
          source={{ uri: documentUrl }}
          style={{ width: '100%', height: 150, marginTop: 10, borderRadius: 5 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
      
  useEffect(() => {
    navigation.setOptions({ title: 'Account' });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        const verifiedStatus = await AsyncStorage.getItem('is_verified');
        
        if (userId) {
          const userData = await ownerAPI.getUserInfo(userId);
          setUser(userData);
          setFormData(userData);
          
          if (verifiedStatus === 'true') {
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        await ownerAPI.updateUserInfo(formData, userId)
        const updatedData = await ownerAPI.getUserInfo(userId);
        setUser(updatedData);
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update user data:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (fieldName: keyof UserData, uri: string) => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user_id');
      
      if (userId) {
        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append('file', {
          uri,
          type: 'image/jpeg', // or get actual mime type
          name: `${fieldName}_${Date.now()}.jpg`,
        });

        // Upload to server
        const response = await ownerAPI.uploadDocument(
          userId, 
          fieldName, 
          formDataToSend
        );

        // Update local state
        setFormData(prev => ({
          ...prev,
          [fieldName]: response.fileUrl // adjust based on your API response
        }));

        Alert.alert('Success', 'Document uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await ownerAPI.logout();
      await AsyncStorage.clear();
      router.replace('/authentication/signin'); // Adjust the route as needed
      Alert.alert('Logged out', 'You have been logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = await AsyncStorage.getItem('user_id');
              if (userId) {
                await ownerAPI.deleteUser(userId);
                await AsyncStorage.clear();
                router.replace('/auth/login'); // Adjust the route as needed
                Alert.alert('Account Deleted', 'Your account has been deleted successfully');
              }
            } catch (error) {
              console.error('Account deletion failed:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  if (!isVerified) {
    return <VerificationScreen />;
  }

  if (loading && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00a651" />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar and edit/save buttons */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0] || user?.username?.[0] || 'A'}
            </Text>
          </View>
          {editing ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notification banner */}
        {isVerified && (
          <View style={styles.notificationBanner}>
            <Text style={styles.notificationText}>Your account has been verified</Text>
          </View>
        )}

        {/* Form fields */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={styles.input}
            value={user?.username || ''}
            editable={false}
          />

          <Text style={styles.label}>First Name</Text>
          <TextInput 
            style={styles.input}
            value={formData?.firstName || ''}
            onChangeText={(text) => handleInputChange('firstName', text)}
            editable={editing}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput 
            style={styles.input}
            value={formData?.lastName || ''}
            onChangeText={(text) => handleInputChange('lastName', text)}
            editable={editing}
          />

          <Text style={styles.label}>Date of birth</Text>
          <TextInput 
            style={styles.input}
            value={formData?.date_of_birth || ''}
            onChangeText={(text) => handleInputChange('date_of_birth', text)}
            editable={editing}
          />

          <Text style={styles.label}>NRC number</Text>
          <TextInput 
            style={styles.input}
            value={formData?.nrc_number || ''}
            onChangeText={(text) => handleInputChange('nrc_number', text)}
            editable={editing}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput 
            style={styles.input}
            value={formData?.phoneNumber || ''}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            editable={editing}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input}
            value={formData?.email || ''}
            onChangeText={(text) => handleInputChange('email', text)}
            editable={editing}
          />

          {/* Address Section */}
          <Text style={styles.sectionHeader}>Address Information</Text>
          <TextInput 
            style={styles.input}
            value={formData?.address_line_1 || ''}
            onChangeText={(text) => handleInputChange('address_line_1', text)}
            editable={editing}
            placeholder="Address Line 1"
          />

          <TextInput 
            style={styles.input}
            value={formData?.address_line_2 || ''}
            onChangeText={(text) => handleInputChange('address_line_2', text)}
            editable={editing}
            placeholder="Address Line 2"
          />

          <TextInput 
            style={styles.input}
            value={formData?.city || ''}
            onChangeText={(text) => handleInputChange('city', text)}
            editable={editing}
            placeholder="City"
          />

          <TextInput 
            style={styles.input}
            value={formData?.town || ''}
            onChangeText={(text) => handleInputChange('town', text)}
            editable={editing}
            placeholder="Town"
          />

          <TextInput 
            style={styles.input}
            value={formData?.province || ''}
            onChangeText={(text) => handleInputChange('province', text)}
            editable={editing}
            placeholder="Province"
          />

          <TextInput 
            style={styles.input}
            value={formData?.postal_code || ''}
            onChangeText={(text) => handleInputChange('postal_code', text)}
            editable={editing}
            placeholder="Postal Code"
            keyboardType="numeric"
          />

          {/* Documents Section */}
          <Text style={styles.sectionHeader}>Identity Documents</Text>
          <DocumentUploader 
            title="NRC Front" 
            documentUrl={formData?.nrc_front} 
            onUpload={(uri: string) => handleDocumentUpload('nrc_front', uri)} 
          />

          <DocumentUploader 
            title="NRC Back" 
            documentUrl={formData?.nrc_back} 
            onUpload={(uri: string) => handleDocumentUpload('nrc_back', uri)} 
          />

          <DocumentUploader 
            title="Passport Photo" 
            documentUrl={formData?.passport_photo} 
            onUpload={(uri: string) => handleDocumentUpload('passport_photo', uri)}
            isImage={true}
          />

          <DocumentUploader 
            title="Driver's License Front" 
            documentUrl={formData?.drivers_license_front} 
            onUpload={(uri: string) => handleDocumentUpload('drivers_license_front', uri)} 
          />

          <DocumentUploader 
            title="Driver's License Back" 
            documentUrl={formData?.drivers_license_back} 
            onUpload={(uri: string) => handleDocumentUpload('drivers_license_back', uri)} 
          />

          <DocumentUploader
            title="Bank Statement" 
            documentUrl={formData?.bank_statement} 
            onUpload={(uri: string) => handleDocumentUpload('bank_statement', uri)} 
          />

          <DocumentUploader 
            title="Utility Bill" 
            documentUrl={formData?.utility_bill} 
            onUpload={(uri: string) => handleDocumentUpload('utility_bill', uri)} 
          />

          <DocumentUploader 
            title="Selfie" 
            documentUrl={formData?.selfie} 
            onUpload={(uri: string) => handleDocumentUpload('selfie', uri)}
            isImage={true}
          />

          {/* Delete account and Logout buttons */}
          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteAccount}>
            <Feather name="trash-2" size={20} color="#666" />
            <Text style={styles.actionButtonText}>Delete account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#666" />
            <Text style={styles.actionButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (keep your existing styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00a651',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    right: 20,
    top: 15,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#00a651',
    fontWeight: 'bold',
  },
  saveButton: {
    position: 'absolute',
    right: 20,
    top: 15,
    backgroundColor: '#00a651',
    padding: 8,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  notificationBanner: {
    backgroundColor: '#e6ffe6',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationText: {
    color: '#00a651',
    fontSize: 14,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra space for bottom nav
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginVertical: 4,
  },
  confirmationContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  confirmationText: {
    color: '#666',
    marginLeft: 26,
  },
  noDataText: {
    color: '#666',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  documentContainer: {
    marginBottom: 15,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  documentUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  documentUploadText: {
    color: '#666',
  },
  documentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#00a651',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#e6ffe6',
  },
  documentPreviewText: {
    color: '#00a651',
  },
});

export default ProfileScreen;