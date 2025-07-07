// ReceivedMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReceivedMessageProps {
  message: string;
  time: string;
}

const ReceivedMessage: React.FC<ReceivedMessageProps> = ({ message, time }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  bubble: {
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});

export default ReceivedMessage;