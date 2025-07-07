"use client"

import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import type React from "react"
import { useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface PhotosVideoSectionProps {
  onAddPhotos: (photos: string[]) => void
  onAddVideo: (video: string) => void
  photos: string[]
  video: string
}

const PhotosVideoSection: React.FC<PhotosVideoSectionProps> = ({ onAddPhotos, onAddVideo, photos, video }) => {
  const [isLoading, setIsLoading] = useState(false)

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload photos.")
      return false
    }
    return true
  }

  const handleAddPhoto = async () => {
    if (photos.length >= 50) {
      Alert.alert("Limit reached", "You can upload up to 50 photos.")
      return
    }

    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    Alert.alert("Select Photo", "Choose how you want to add a photo", [
      { text: "Camera", onPress: () => takePhoto() },
      { text: "Gallery", onPress: () => pickPhoto() },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const takePhoto = async () => {
    try {
      setIsLoading(true)
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const newPhotos = [...photos, result.assets[0].uri]
        onAddPhotos(newPhotos)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo")
    } finally {
      setIsLoading(false)
    }
  }

  const pickPhoto = async () => {
    try {
      setIsLoading(true)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      })

      if (!result.canceled && result.assets) {
        const newPhotoUris = result.assets.map((asset) => asset.uri)
        const updatedPhotos = [...photos, ...newPhotoUris].slice(0, 50)
        onAddPhotos(updatedPhotos)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick photo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = async () => {
    if (video) {
      Alert.alert("Video exists", "You can only upload one video. Remove the current video first.")
      return
    }

    Alert.alert("Select Video", "Choose how you want to add a video", [
      { text: "Camera", onPress: () => recordVideo() },
      { text: "Gallery", onPress: () => pickVideo() },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const recordVideo = async () => {
    try {
      setIsLoading(true)
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
        videoMaxDuration: 300, // 5 minutes
      })

      if (!result.canceled && result.assets[0]) {
        onAddVideo(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to record video")
    } finally {
      setIsLoading(false)
    }
  }

  const pickVideo = async () => {
    try {
      setIsLoading(true)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      })

      if (!result.canceled && result.assets[0]) {
        onAddVideo(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video")
    } finally {
      setIsLoading(false)
    }
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index)
    onAddPhotos(updatedPhotos)
  }

  const removeVideo = () => {
    onAddVideo("")
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Photos/Video</Text>

      {/* Photo Upload */}
      <TouchableOpacity
        style={[styles.uploadButton, isLoading && styles.disabledButton]}
        onPress={handleAddPhoto}
        disabled={isLoading}
      >
        <Ionicons name="camera" size={20} color="#666" />
        <Text style={styles.uploadButtonText}>{isLoading ? "Adding..." : `Add photos (${photos.length}/50)`}</Text>
      </TouchableOpacity>

      {/* Photo Preview */}
      {photos.length > 0 && (
        <ScrollView horizontal style={styles.photoPreview} showsHorizontalScrollIndicator={false}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photoThumbnail} />
              <TouchableOpacity style={styles.removeButton} onPress={() => removePhoto(index)}>
                <Ionicons name="close-circle" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Video Upload */}
      <TouchableOpacity
        style={[styles.uploadButton, isLoading && styles.disabledButton]}
        onPress={handleAddVideo}
        disabled={isLoading || !!video}
      >
        <Ionicons name="videocam" size={20} color="#666" />
        <Text style={styles.uploadButtonText}>{video ? "Video added" : isLoading ? "Adding..." : "Add video"}</Text>
      </TouchableOpacity>

      {/* Video Preview */}
      {video && (
        <View style={styles.videoContainer}>
          <View style={styles.videoPreview}>
            <Ionicons name="play-circle" size={40} color="#4CAF50" />
            <Text style={styles.videoText}>Video ready</Text>
          </View>
          <TouchableOpacity style={styles.removeVideoButton} onPress={removeVideo}>
            <Ionicons name="trash" size={16} color="#ff4444" />
            <Text style={styles.removeVideoText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.uploadHint}>Tell us more about the property and the infrastructure nearby</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 12,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#666",
  },
  photoPreview: {
    marginBottom: 12,
  },
  photoContainer: {
    position: "relative",
    marginRight: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 10,
  },
  videoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  videoPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  videoText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  removeVideoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeVideoText: {
    fontSize: 14,
    color: "#ff4444",
  },
  uploadHint: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
})

export default PhotosVideoSection
