import { StyleSheet, View } from 'react-native'
import React from 'react'
import ShortTermRentalScreen from '@/components/Listing/ListingShortTerm'

export default function ShorTermListings() {
  return (
    <View style={styles.container}>
        <ShortTermRentalScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

