import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker'

interface NRCCardProps {
  onUploadComplete: (photos: { front: string | null; back: string | null }) => void
}

const NRCCard = ({ onUploadComplete }: NRCCardProps) => {
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null)
  const [backPhoto, setBackPhoto] = useState<string | null>(null)
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
            "Please grant camera and photo library permissions to upload your NRC photos.",
            [{ text: "OK" }]
          )
        }
        
        setPermissionsRequested(true)
      }
    })()
  }, [permissionsRequested])

  const takePhoto = async (isFront: boolean) => {
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
        
        if (isFront) {
          setFrontPhoto(photoUri)
          if (backPhoto) {
            onUploadComplete({ front: photoUri, back: backPhoto })
          }
        } else {
          setBackPhoto(photoUri)
          if (frontPhoto) {
            onUploadComplete({ front: frontPhoto, back: photoUri })
          }
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.")
      console.error("Error taking photo:", error)
    }
  }

  const pickImage = async (isFront: boolean) => {
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
        
        if (isFront) {
          setFrontPhoto(photoUri)
          if (backPhoto) {
            onUploadComplete({ front: photoUri, back: backPhoto })
          }
        } else {
          setBackPhoto(photoUri)
          if (frontPhoto) {
            onUploadComplete({ front: frontPhoto, back: photoUri })
          }
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.")
      console.error("Error selecting image:", error)
    }
  }

  const showImageOptions = (isFront: boolean) => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(isFront),
        },
        {
          text: "Choose from Library",
          onPress: () => pickImage(isFront),
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
      <Text style={styles.title}>Upload NRC Photos</Text>
      <Text style={styles.subtitle}>We need photos of both sides of your NRC</Text>
      
      <View style={styles.photosContainer}>
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Front Side</Text>
          {frontPhoto ? (
            <View style={styles.photoPreview}>
              <Image 
                source={{ uri: frontPhoto }} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
              <View style={styles.uploadedOverlay}>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                <Text style={styles.photoUploaded}>Uploaded</Text>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => showImageOptions(true)}
                >
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => showImageOptions(true)}
            >
              <Ionicons name="camera" size={24} color="gray" />
              <Text style={styles.uploadText}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.photoSection}>
          <Text style={styles.photoLabel}>Back Side</Text>
          {backPhoto ? (
            <View style={styles.photoPreview}>
              <Image 
                source={{ uri: backPhoto }} 
                style={styles.previewImage} 
                resizeMode="cover"
              />
              <View style={styles.uploadedOverlay}>
                <Ionicons name="checkmark-circle" size={24} color="green" />
                <Text style={styles.photoUploaded}>Uploaded</Text>
                <TouchableOpacity 
                  style={styles.retakeButton}
                  onPress={() => showImageOptions(false)}
                >
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => showImageOptions(false)}
            >
              <Ionicons name="camera" size={24} color="gray" />
              <Text style={styles.uploadText}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for good photos:</Text>
        <Text style={styles.tipItem}>• Make sure all text is clearly visible</Text>
        <Text style={styles.tipItem}>• Avoid glare or shadows</Text>
        <Text style={styles.tipItem}>• Place document on a dark background</Text>
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
  photosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  photoSection: {
    width: "48%",
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  uploadButton: {
    height: 120,
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
    height: 120,
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

export default NRCCard