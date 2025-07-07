import type React from "react"
import { View, Text, StyleSheet } from "react-native"

const TermsSection: React.FC = () => {
  return (
    <View style={styles.termsSection}>
      <Text style={styles.termsText}>
        By proceeding to publish your listing on our platform, you agree that the information you have listed and
        provided are correct and that you have read and agree to the Terms and Conditions.
      </Text>
      <Text style={styles.termsText}>I have read and agree to the Terms and Conditions</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  termsSection: {
    padding: 16,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
})

export default TermsSection

