import { StyleSheet, View } from 'react-native'
import React from 'react'
import RentListingScreen from '@/components/Rent/RentCard'

export default function PropertyOptionOne() {
  return (
    <View style={styles.container}>
        <RentListingScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

