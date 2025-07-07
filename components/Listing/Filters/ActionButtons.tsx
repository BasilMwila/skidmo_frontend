import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface ActionButtonsProps {
  onSave: () => void
  onPublish: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onPublish }) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.publishButton} onPress={onPublish}>
        <Text style={styles.publishButtonText}>Publish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4CAF50",
  },
  publishButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#4CAF50",
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
})

export default ActionButtons

