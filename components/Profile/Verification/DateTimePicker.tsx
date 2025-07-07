import React, { useState } from "react";
import { View, Button, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface CustomDatePickerProps {
    value: Date;
    onChange: (selectedDate: Date) => void;
    mode?: "date" | "time" | "datetime";
    display?: "default" | "spinner" | "clock" | "calendar";
    buttonComponent?: React.ReactNode; // Allow a custom button
  }
  
  const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    mode = "date",
    display = "default",
    buttonComponent,
  }) => {
    const [show, setShow] = useState(false);
  
    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      setShow(false);
      if (selectedDate) {
        onChange(selectedDate);
      }
    };
  
    return (
      <View>
        {buttonComponent ? (
          React.cloneElement(buttonComponent as React.ReactElement, {
            onPress: () => setShow(true),
          })
        ) : (
          <Button title="Select Date" onPress={() => setShow(true)} />
        )}
        {show && (
          <DateTimePicker
            value={value}
            mode={mode}
            display={display}
            onChange={handleDateChange}
          />
        )}
      </View>
    );
  };

export default CustomDatePicker;