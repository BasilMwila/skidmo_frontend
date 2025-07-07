import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

interface DocumentUploaderProps {
  title: string;
  documentUrl?: string;
  onUpload: (url: string) => void;
  isImage?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  title,
  documentUrl,
  onUpload,
  isImage = false,
}) => {
  const handlePress = async () => {
    if (documentUrl) {
      // If document exists, show preview or options
      Alert.alert(
        title,
        'What would you like to do?',
        [
          {
            text: 'View Document',
            onPress: () => console.log('Preview would open here'), // Replace with your preview logic
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
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <TouchableOpacity style={styles.uploadButton} onPress={handlePress}>
        {documentUrl ? (
          <View style={styles.previewContainer}>
            <Image 
              source={{ uri: documentUrl }} 
              style={styles.previewImage} 
              resizeMode="contain"
            />
            <View style={styles.overlay}>
              <MaterialIcons name="visibility" size={24} color="white" />
              <Text style={styles.overlayText}>View/Replace</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadContent}>
            <MaterialIcons 
              name={isImage ? 'add-a-photo' : 'cloud-upload'} 
              size={24} 
              color="#555" 
            />
            <Text style={styles.uploadText}>
              {isImage ? 'Upload Image' : 'Upload Document'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginLeft: 10,
    color: '#555',
  },
  previewContainer: {
    position: 'relative',
    height: 150,
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  overlayText: {
    color: 'white',
    marginTop: 5,
    fontWeight: '500',
  },
});

export default DocumentUploader;