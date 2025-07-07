import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker'

interface PassportCardProps {
  onUploadComplete: (photo: string) => void
}

const PassportCard = ({ onUploadComplete }: PassportCardProps) => {
  const [photo, setPhoto] = useState<string | null>(null)
  const [permissionsRequested, setPermissionsRequested] = useState(false)

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      if (!permissionsRequested) {
        // Request camera permissions
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
        const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        
        if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
          Alert.alert(
            "Permissions Required",
            "Please grant camera and photo library permissions to upload your passport photo.",
            [{ text: "OK" }]
          )
        }
        
        setPermissionsRequested(true)
      }
    })()
  }, [permissionsRequested])

  const takePhoto = async () => {
    try {
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri
        setPhoto(photoUri)
        onUploadComplete(photoUri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.")
      console.error("Error taking photo:", error)
    }
  }

  const pickImage = async () => {
    try {
      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri
        setPhoto(photoUri)
        onUploadComplete(photoUri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.")
      console.error("Error selecting image:", error)
    }
  }

  const showImageOptions = () => {
    Alert.alert(
      "Upload Passport Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(),
        },
        {
          text: "Choose from Library",
          onPress: () => pickImage(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Passport Photo</Text>
      <Text style={styles.subtitle}>We need a photo of your passport information page</Text>
      
      <View style={styles.photoContainer}>
        <Text style={styles.photoLabel}>Passport Information Page</Text>
        {photo ? (
          <View style={styles.photoPreview}>
            <Image 
              source={{ uri: photo }} 
              style={styles.previewImage} 
              resizeMode="cover"
            />
            <View style={styles.uploadedOverlay}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
              <Text style={styles.photoUploaded}>Uploaded</Text>
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={showImageOptions}
              >
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={showImageOptions}
          >
            <Ionicons name="camera" size={24} color="gray" />
            <Text style={styles.uploadText}>Take Photo</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for good photos:</Text>
        <Text style={styles.tipItem}>• Capture the entire information page</Text>
        <Text style={styles.tipItem}>• Make sure all text and your photo are clearly visible</Text>
        <Text style={styles.tipItem}>• Avoid glare or shadows</Text>
        <Text style={styles.tipItem}>• Place passport on a dark background</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  uploadButton: {
    height: 160,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    marginTop: 8,
    color: "#666",
  },
  photoPreview: {
    height: 160,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  uploadedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  photoUploaded: {
    marginTop: 4,
    color: "green",
  },
  retakeButton: {
    marginTop: 8,
    padding: 4,
  },
  retakeText: {
    color: "#0066cc",
    fontSize: 12,
  },
  tipsContainer: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
})

export default PassportCard