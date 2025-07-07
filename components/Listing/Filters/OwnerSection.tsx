"use client"

import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import type React from "react"
import { useEffect, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface OwnerSectionProps {
  onAddOwnership: (photo: string) => void
  onAddCertificate: (photo: string) => void
  isAgent: boolean
  onToggleAgent: (isAgent: boolean) => void
  ownershipPhoto: string
  certificatePhoto: string
}

const OwnerSection: React.FC<OwnerSectionProps> = ({
  onAddOwnership,
  onAddCertificate,
  isAgent,
  onToggleAgent,
  ownershipPhoto,
  certificatePhoto,
}) => {
  const [permissionsRequested, setPermissionsRequested] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!permissionsRequested) {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
        const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
          Alert.alert(
            "Permissions Required",
            "Please grant camera and photo library permissions to upload documents.",
            [{ text: "OK" }],
          )
        }

        setPermissionsRequested(true)
      }
    })()
  }, [permissionsRequested])

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload documents.")
      return false
    }
    return true
  }

  const handleAddOwnership = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    Alert.alert("Add Ownership Proof", "Choose how you want to add proof of ownership", [
      { text: "Camera", onPress: () => takeOwnershipPhoto() },
      { text: "Gallery", onPress: () => pickOwnershipPhoto() },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleAddCertificate = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) return

    Alert.alert("Add Agent Certificate", "Choose how you want to add agent certificate", [
      { text: "Camera", onPress: () => takeCertificatePhoto() },
      { text: "Gallery", onPress: () => pickCertificatePhoto() },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const takeOwnershipPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onAddOwnership(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo")
    }
  }

  const pickOwnershipPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onAddOwnership(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick photo")
    }
  }

  const takeCertificatePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onAddCertificate(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo")
    }
  }

  const pickCertificatePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        onAddCertificate(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick photo")
    }
  }

  return (
    <View style={styles.container}>
      {/* Owner/Agent Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !isAgent && styles.selectedToggle]}
          onPress={() => onToggleAgent(false)}
        >
          <View style={[styles.toggleIndicator, !isAgent && styles.selectedIndicator]} />
          <Text style={[styles.toggleText, !isAgent && styles.selectedToggleText]}>Owner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, isAgent && styles.selectedToggle]}
          onPress={() => onToggleAgent(true)}
        >
          <View style={[styles.toggleIndicator, isAgent && styles.selectedIndicator]} />
          <Text style={[styles.toggleText, isAgent && styles.selectedToggleText]}>Agent</Text>
        </TouchableOpacity>
      </View>

      {/* Ownership Proof */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleAddOwnership}>
        <Ionicons name="document" size={20} color="#666" />
        <Text style={styles.uploadButtonText}>
          {ownershipPhoto ? "Ownership proof added" : "Add proof of ownership"}
        </Text>
        {ownershipPhoto && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
      </TouchableOpacity>

      {/* Agent Certificate (only show if agent is selected) */}
      {isAgent && (
        <>
          <Text style={styles.agentText}>Agent ID</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleAddCertificate}>
            <Ionicons name="document" size={20} color="#666" />
            <Text style={styles.uploadButtonText}>
              {certificatePhoto ? "Certificate added" : "Add photo of agent certificate"}
            </Text>
            {certificatePhoto && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  selectedToggle: {
    // Add any selected styling if needed
  },
  toggleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  selectedIndicator: {
    backgroundColor: "#4CAF50",
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  selectedToggleText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 16,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  agentText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
    color: "#000",
  },
})

export default OwnerSection
