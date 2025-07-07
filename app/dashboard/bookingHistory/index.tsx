import { StyleSheet, View } from 'react-native'
import React from 'react'
import BookongHistory from '@/components/Profile/BookingHistory'

export default function BookingsHistory() {
  return (
    <View style={styles.container}>
        <BookongHistory/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

