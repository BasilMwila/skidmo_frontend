"use client"

import type React from "react"
import { View, Text, Switch, StyleSheet } from "react-native"

interface OnlineKeySectionProps {
  onlineKey: boolean
  onOnlineKeyChange: (value: boolean) => void
}

const OnlineKeySection: React.FC<OnlineKeySectionProps> = ({ onlineKey, onOnlineKeyChange }) => {
  return (
    <View style={styles.section}>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Online Tour</Text>
        <Switch
          value={onlineKey}
          onValueChange={onOnlineKeyChange}
          trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
          thumbColor="#ffffff"
        />
      </View>
      <Text style={styles.helperText}>The guest can access the property via code</Text>
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
})

export default OnlineKeySection

