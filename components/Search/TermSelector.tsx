"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import DateSelector from "./DateSelector"

interface TermSelectorProps {
  selectedTerm: string
  setSelectedTerm: (term: string) => void
  checkInDate: Date | null
  setCheckInDate: (date: Date | null) => void
  checkOutDate: Date | null
  setCheckOutDate: (date: Date | null) => void
}

const TermSelector = ({ 
  selectedTerm, 
  setSelectedTerm,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate
}: TermSelectorProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.termButton, selectedTerm === "long-term" && styles.selectedLongButton]}
          onPress={() => setSelectedTerm("long-term")}
        >
          <Text style={styles.termText}>Long-term</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.termButton, selectedTerm === "short-term" && styles.selectedShortButton]}
          onPress={() => setSelectedTerm("short-term")}
        >
          <Text style={[styles.termText, selectedTerm === "short-term" && styles.selectedShortText]}>Short-term</Text>
        </TouchableOpacity>
      </View>

      {selectedTerm === "short-term" && (
        <View style={styles.dateContainer}>
          <DateSelector 
            label="Check in" 
            date={checkInDate || undefined}
            onDateChange={setCheckInDate}
          />
          <DateSelector 
            label="Check out" 
            date={checkOutDate || undefined}
            onDateChange={setCheckOutDate}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  termButton: {
    backgroundColor: "#e6f9ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  selectedLongButton: {
    backgroundColor: "#e6f9ee",
  },
  selectedShortButton: {
    backgroundColor: "#22c55e",
  },
  termText: {
    color: "#00a651",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedShortText: {
    color: "#ffffff",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
})

export default TermSelector