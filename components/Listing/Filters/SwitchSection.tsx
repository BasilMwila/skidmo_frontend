"use client"

import type React from "react"
import { View, Text, Switch, StyleSheet } from "react-native"

interface SwitchSectionProps {
  title: string
  value: boolean
  onChange: (value: boolean) => void
  children?: React.ReactNode
}

const SwitchSection: React.FC<SwitchSectionProps> = ({ title, value, onChange, children }) => {
  return (
    <View style={styles.section}>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{title}</Text>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
          thumbColor="#ffffff"
        />
      </View>
      {value && children}
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
})

export default SwitchSection

