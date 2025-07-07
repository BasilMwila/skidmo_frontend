import { StyleSheet, View } from 'react-native'
import React from 'react'
import MyBookingsScreen from '@/components/Profile/MyBookingScreen'

export default function MyBookings() {
  return (
    <View style={styles.container}>
        <MyBookingsScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

