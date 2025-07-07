import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import NRCCard from "./NrcVerification"
import PassportCard from "./PassportVerfication"
import DrivingLicenseCard from "./DriversVerification"
import SelfieCard from "./SelfieVerification"
import BankStatementCard from "./BankStatementVerification"

const { height } = Dimensions.get("window")

export type DocumentUploadSheetRef = {
  open: (documentType: string) => void
  close: () => void
}

interface DocumentUploadSheetProps {
  onUploadComplete: (documentType: string, photos: any) => void
}

const DocumentUploadSheet = forwardRef<DocumentUploadSheetRef, DocumentUploadSheetProps>(
  ({ onUploadComplete }, ref) => {
    const [documentType, setDocumentType] = useState<string>("")
    const [isVisible, setIsVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(height)).current

    useImperativeHandle(ref, () => ({
      open: (type: string) => {
        setDocumentType(type)
        setIsVisible(true)
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start()
      },
      close: () => {
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsVisible(false)
        })
      },
    }))

    const handleClose = () => {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false)
      })
    }

    const handleNRCUpload = (photos: { front: string | null; back: string | null }) => {
      onUploadComplete("NRC", photos)
      handleClose()
    }

    const handlePassportUpload = (photo: string) => {
      onUploadComplete("Passport", { photo })
      handleClose()
    }

    const handleDrivingLicenseUpload = (photos: { front: string | null; back: string | null }) => {
      onUploadComplete("Driving licence", photos)
      handleClose()
    }

    const handleSelfieUpload = (photo: string) => {
      onUploadComplete("Selfie", { photo })
      handleClose()
    }

    const handleBankStatementUpload = (photo: string) => {
      onUploadComplete("Bank statement", { photo })
      handleClose()
    }

    if (!isVisible) return null

    return (
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Upload Document</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {documentType === "NRC" && <NRCCard onUploadComplete={handleNRCUpload} />}
            {documentType === "Passport" && <PassportCard onUploadComplete={handlePassportUpload} />}
            {documentType === "Driving licence" && (
              <DrivingLicenseCard onUploadComplete={handleDrivingLicenseUpload} />
            )}
            {documentType === "Selfie" && (
              <SelfieCard onUploadComplete={handleSelfieUpload} />
            )}
            {documentType === "Bank statement" && (
              <BankStatementCard onUploadComplete={handleBankStatementUpload} />
            )}
          </View>
        </Animated.View>
      </View>
    )
  }
)

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    maxHeight: height * 0.7,
  },
})

export default DocumentUploadSheet