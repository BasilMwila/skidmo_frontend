import type React from "react"
import { View, TextInput, TouchableOpacity, StyleSheet, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import SectionHeader from "./UI/SectionHeader"

interface AdditionalSectionProps {
  additionalInfo: string
  onAdditionalInfoChange: (text: string) => void
  onPress?: () => void
}

const AdditionalSection: React.FC<AdditionalSectionProps> = ({ 
  additionalInfo, 
  onAdditionalInfoChange,
  onPress 
}) => {
  const handleContainerPress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleClearPress = () => {
    onAdditionalInfoChange("");
  };

  return (
    <View style={styles.section}>
      <SectionHeader title="Additional" />
      <View style={styles.pressableContainer}>
        {onPress ? (
          // When onPress is provided, make the whole area clickable
          <Pressable 
            onPress={handleContainerPress}
            style={({ pressed }) => [
              styles.inputContainer,
              pressed && styles.pressedState
            ]}
          >
            <TextInput
              style={styles.input}
              value={additionalInfo}
              placeholder="Info"
              multiline
              editable={false}
              pointerEvents="none"
            />
            {additionalInfo ? (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={16} color="#999" />
              </TouchableOpacity>
            ) : null}
          </Pressable>
        ) : (
          // When no onPress, use the original editable input
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={additionalInfo}
              onChangeText={onAdditionalInfoChange}
              placeholder="Info"
              multiline
            />
            {additionalInfo ? (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearPress}
              >
                <Ionicons name="close" size={16} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        )}
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
  pressableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  pressedState: {
    opacity: 0.7,
    backgroundColor: '#f5f5f5',
  },
})

export default AdditionalSection