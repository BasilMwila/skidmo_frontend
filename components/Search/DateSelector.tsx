import { useState } from "react"
import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { DatePickerModal } from "react-native-paper-dates"

interface DateSelectorProps {
  label: string
  date?: Date
  onDateChange: (date: Date) => void
}

const DateSelector = ({ label, date, onDateChange }: DateSelectorProps) => {
  const [visible, setVisible] = useState(false)

  const onDismiss = () => {
    setVisible(false)
  }

  const onConfirm = ({ date }: { date: Date }) => {
    setVisible(false)
    onDateChange(date)
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.label}>
          {date ? date.toLocaleDateString() : label}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#777" />
      </TouchableOpacity>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={visible}
        onDismiss={onDismiss}
        date={date}
        onConfirm={onConfirm}
        label={label}
        saveLabel="Save"
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    width: "48%",
  },
  label: {
    color: "#777",
    fontSize: 16,
  },
})

export default DateSelector