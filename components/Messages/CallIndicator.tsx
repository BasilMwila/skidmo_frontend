import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CallIndicatorProps {
  type: 'incoming' | 'outgoing';
  time: string;
}

const CallIndicator: React.FC<CallIndicatorProps> = ({ type, time }) => {
  return (
    <View style={[
      styles.container, 
      type === 'incoming' ? styles.incomingContainer : styles.outgoingContainer
    ]}>
      <View style={styles.callContent}>
        <Ionicons 
          name={type === 'incoming' ? 'call' : 'call-outline'} 
          size={18} 
          color={type === 'incoming' ? '#4CAF50' : '#000'} 
        />
        <Text style={styles.callText}>
          {type === 'incoming' ? 'Incoming call' : 'Outgoing call'}
        </Text>
      </View>
      <Text style={styles.timeText}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 18,
    justifyContent: 'space-between',
  },
  incomingContainer: {
    backgroundColor: '#e6f7eb',
    alignSelf: 'flex-end',
  },
  outgoingContainer: {
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
  },
  callContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
});

export default CallIndicator;
