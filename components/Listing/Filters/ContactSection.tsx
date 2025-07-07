import type React from "react"
import { View, TextInput, StyleSheet } from "react-native"
import SectionHeader from "./UI/SectionHeader"

interface ContactSectionProps {
  name: string
  onNameChange: (text: string) => void
  phone: string
  onPhoneChange: (text: string) => void
}

const ContactSection: React.FC<ContactSectionProps> = ({ name, onNameChange, phone, onPhoneChange }) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="Contact" />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={name} onChangeText={onNameChange} placeholder="Name" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={onPhoneChange}
          placeholder="Your contact phone"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
})

export default ContactSection

