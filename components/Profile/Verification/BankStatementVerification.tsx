import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker'

interface BankStatementCardProps {
  onUploadComplete: (photo: string) => void
}

const BankStatementCard = ({ onUploadComplete }: BankStatementCardProps) => {
  const [photo, setPhoto] = useState<string | null>(null)
  const [permissionsRequested, setPermissionsRequested] = useState(false)

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      if (!permissionsRequested) {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
        const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        
        if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
          Alert.alert(
            "Permissions Required",
            "Please grant camera and photo library permissions to upload your bank statement.",
            [{ text: "OK" }]
          )
        }
        
        setPermissionsRequested(true)
      }
    })()
  }, [permissionsRequested])

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,  // Disable cropping
        // Remove the aspect property to get the full image
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,  // Disable cropping
        // Remove the aspect property to get the full image
        quality: 0.8,
      });

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
      "Upload Bank Statement",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Library",
          onPress: pickImage,
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
      <Text style={styles.title}>Upload Bank Statement</Text>
      <Text style={styles.subtitle}>Please upload a clear photo of your bank statement or utility bill</Text>
      
      <View style={styles.photoSection}>
        {photo ? (
          <View style={styles.photoPreview}>
            <Image 
              source={{ uri: photo }} 
              style={styles.previewImage} 
              resizeMode="contain"
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
            <Ionicons name="document" size={24} color="gray" />
            <Text style={styles.uploadText}>Upload Document</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Requirements:</Text>
        <Text style={styles.tipItem}>• Must show your name and address</Text>
        <Text style={styles.tipItem}>• Should be less than 3 months old</Text>
        <Text style={styles.tipItem}>• All text must be clearly visible</Text>
        <Text style={styles.tipItem}>• Avoid glare or shadows</Text>
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
  photoSection: {
    marginBottom: 20,
  },
  uploadButton: {
    height: 150,
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
    height: 150,
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

export default BankStatementCard