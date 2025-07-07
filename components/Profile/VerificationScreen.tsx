"use client"

import { useRef, useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import DocumentUploadSheet, { type DocumentUploadSheetRef } from "./Verification/DocumentUploadSheet"
import { useNavigation } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ownerAPI } from "@/services/userApi" // Adjust the import path as needed
// import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface UserData {
  id?: number
  username: string
  email: string
  phone_number?: string
  first_name?: string
  last_name?: string
  date_of_birth?: string
  nrc_number?: string
  province?: string
  town?: string
  city?: string
  postal_code?: string
  address_line_1?: string
  address_line_2?: string
}

const VerificationScreen = () => {
  const router = useRouter()
  const documentSheetRef = useRef<DocumentUploadSheetRef>(null)
  const navigation = useNavigation()
  const [submitting, setSubmitting] = useState(false)

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nrcNumber: "",
    phoneNumber: "",
    email: "",
    province: "",
    town: "",
    city: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
  })

  const [identityDocument, setIdentityDocument] = useState("NRC")
  const [proofOfAddress, setProofOfAddress] = useState("Bank statement")
  const [documentPhotos, setDocumentPhotos] = useState<any>(null)
  const [addressPhotos, setAddressPhotos] = useState<any>(null)
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null)
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    navigation.setOptions({ title: "Verification" }) // Set custom title
  }, [navigation])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id")
        if (!storedUserId) {
          throw new Error("User ID not found")
        }

        const userData = await ownerAPI.getUserInfo(storedUserId)
        setUser(userData)
        setFormData({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          dateOfBirth: userData.date_of_birth || "",
          nrcNumber: userData.nrc_number || "",
          phoneNumber: userData.phone_number || "",
          email: userData.email || "",
          province: userData.province || "",
          town: userData.town || "",
          city: userData.city || "",
          postalCode: userData.postal_code || "",
          addressLine1: userData.address_line_1 || "",
          addressLine2: userData.address_line_2 || "",
        })

        // Set initial date for DatePicker
        if (userData.date_of_birth) {
          setDateOfBirth(new Date(userData.date_of_birth))
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        Alert.alert("Error", "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const validateDateFormat = (dateString: string): boolean => {
    // Check if the date matches YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateString)) return false

    // Check if the date is valid
    const date = new Date(dateString)
    const timestamp = date.getTime()
    if (isNaN(timestamp)) return false

    // Check if the date components match the input
    const parts = dateString.split("-")
    const year = Number.parseInt(parts[0], 10)
    const month = Number.parseInt(parts[1], 10) - 1 // JS months are 0-indexed
    const day = Number.parseInt(parts[2], 10)

    const reconstructedDate = new Date(year, month, day)
    return (
      reconstructedDate.getFullYear() === year &&
      reconstructedDate.getMonth() === month &&
      reconstructedDate.getDate() === day
    )
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Validate date format
      if (formData.dateOfBirth && !validateDateFormat(formData.dateOfBirth)) {
        Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format")
        return
      }
  
      // Check if all required documents are uploaded
      if (!documentPhotos || !addressPhotos || !selfiePhoto) {
        Alert.alert("Error", "Please upload all required documents")
        return
      }
  
      // Format the date_of_birth field to YYYY-MM-DD
      const formattedDateOfBirth = formData.dateOfBirth || undefined
  
      const updatedUserData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formattedDateOfBirth,
        nrc_number: formData.nrcNumber,
        phone_number: formData.phoneNumber,
        email: formData.email,
        province: formData.province,
        town: formData.town,
        city: formData.city,
        postal_code: formData.postalCode,
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2,
        status_verification: "pending" // Add this line to set the status
      }
  
      console.log("Submitting user data:", updatedUserData)
  
      const storedUserId = await AsyncStorage.getItem("user_id")
      if (!storedUserId) {
        throw new Error("User ID not found")
      }
  
      // First update the user info
      const response = await ownerAPI.updateUserInfo(updatedUserData, storedUserId)
      console.log("User data updated successfully:", response)
  
      // Then handle document uploads if needed
      // (Add your document upload logic here if you need to send the photos to the server)
  
      Alert.alert("Success", "Verification submitted successfully", [
        { 
          text: "OK", 
          onPress: () => router.back() // Navigate back to profile screen
        }
      ])
      
    } catch (error) {
      console.error("Error updating user data:", error)
      Alert.alert("Error", "Failed to submit verification")
    }
    finally {
      setSubmitting(false)
    }
  }

  const handleDocumentSelect = (type: string) => {
    setIdentityDocument(type)
    // Open the bottom sheet for document upload
    documentSheetRef.current?.open(type)
  }

  const handleDocumentUploadComplete = (type: string, photos: any) => {
    if (type === "NRC" || type === "Passport" || type === "Driving licence") {
      setDocumentPhotos(photos)
    } else if (type === "Bank statement" || type === "Utility bill") {
      setAddressPhotos(photos)
    } else if (type === "Selfie") {
      setSelfiePhoto(photos.photo)
    }
  }

  const handleAddressPhotoUpload = () => {
    // Open the document sheet with the selected proof of address type
    documentSheetRef.current?.open(proofOfAddress)
  }

  const handleSelfieUpload = () => {
    documentSheetRef.current?.open("Selfie")
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal information</Text> */}
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={formData.dateOfBirth}
            onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
            // keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="NRC Number"
            value={formData.nrcNumber}
            onChangeText={(text) => setFormData({ ...formData, nrcNumber: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Province"
            value={formData.province}
            onChangeText={(text) => setFormData({ ...formData, province: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Town"
            value={formData.town}
            onChangeText={(text) => setFormData({ ...formData, town: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={formData.postalCode}
            onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
          />

          <Text style={styles.addressNote}>Should be the same as the one on your proof of address</Text>
        </View>

        <Text style={styles.sectionTitle}>Identity verification</Text>

        <View style={styles.formSection}>
          <Text style={styles.subsectionTitle}>Identity document</Text>

          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.radioOption} onPress={() => handleDocumentSelect("NRC")}>
              <View style={styles.radioButton}>
                {identityDocument === "NRC" && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioLabel}>NRC</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioOption} onPress={() => handleDocumentSelect("Passport")}>
              <View style={styles.radioButton}>
                {identityDocument === "Passport" && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioLabel}>Passport</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioOption} onPress={() => handleDocumentSelect("Driving licence")}>
              <View style={styles.radioButton}>
                {identityDocument === "Driving licence" && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioLabel}>Driving licence</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.uploadButton, documentPhotos ? styles.uploadButtonComplete : null]}
            onPress={() => documentSheetRef.current?.open(identityDocument)}
          >
            {documentPhotos ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="green" />
                <Text style={styles.uploadButtonTextComplete}>Photos added</Text>
              </>
            ) : (
              <>
                <Ionicons name="add" size={20} color="black" />
                <Text style={styles.uploadButtonText}>Add photos</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.subsectionTitle}>Proof of address</Text>

          <View style={styles.radioGroup}>
            <TouchableOpacity style={styles.radioOption} onPress={() => setProofOfAddress("Bank statement")}>
              <View style={styles.radioButton}>
                {proofOfAddress === "Bank statement" && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioLabel}>Bank statement</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioOption} onPress={() => setProofOfAddress("Utility bill")}>
              <View style={styles.radioButton}>
                {proofOfAddress === "Utility bill" && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioLabel}>Utility bill</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.uploadButton, addressPhotos ? styles.uploadButtonComplete : null]}
            onPress={handleAddressPhotoUpload}
          >
            {addressPhotos ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="green" />
                <Text style={styles.uploadButtonTextComplete}>Photos added</Text>
              </>
            ) : (
              <>
                <Ionicons name="add" size={20} color="black" />
                <Text style={styles.uploadButtonText}>Add photos</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.subsectionTitle}>Selfie verification</Text>
          <Text style={styles.selfieNote}>Take a selfie with your identity document</Text>

          <TouchableOpacity
            style={[styles.uploadButton, selfiePhoto ? styles.uploadButtonComplete : null]}
            onPress={handleSelfieUpload}
          >
            {selfiePhoto ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="green" />
                <Text style={styles.uploadButtonTextComplete}>Photo added</Text>
              </>
            ) : (
              <>
                <Ionicons name="add" size={20} color="black" />
                <Text style={styles.uploadButtonText}>Add photos</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit for verification</Text>
          )}
        </TouchableOpacity>
        {/* Add some bottom padding for scrolling */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Consolidated Document Upload Bottom Sheet */}
      <DocumentUploadSheet ref={documentSheetRef} onUploadComplete={handleDocumentUploadComplete} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  addressNote: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 12,
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  radioLabel: {
    fontSize: 16,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 24,
  },
  uploadButtonComplete: {
    backgroundColor: "#f0f9f0",
    borderColor: "#c8e6c9",
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  uploadButtonTextComplete: {
    marginLeft: 8,
    fontSize: 16,
    color: "green",
  },
  selfieNote: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "green",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginBottom: 12,
  },
})

export default VerificationScreen