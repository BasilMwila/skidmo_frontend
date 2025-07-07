// SentMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SentMessageProps {
  message: string;
  time: string;
}

const SentMessage: React.FC<SentMessageProps> = ({ message, time }) => {
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
    alignSelf: 'flex-end',
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  bubble: {
    backgroundColor: '#DCF8C6',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopRightRadius: 0,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default SentMessage;

