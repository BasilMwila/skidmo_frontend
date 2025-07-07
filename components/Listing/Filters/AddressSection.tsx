import type React from "react"
import { View, TextInput, StyleSheet } from "react-native"
import SectionHeader from "./UI/SectionHeader"

interface AddressSectionProps {
  address: string
  onAddressChange: (text: string) => void
}

const AddressSection: React.FC<AddressSectionProps> = ({ address, onAddressChange }) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="Address" />
      <TextInput 
        style={styles.input} 
        value={address} 
        onChangeText={onAddressChange} 
        placeholder="Enter address" 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
})

export default AddressSection