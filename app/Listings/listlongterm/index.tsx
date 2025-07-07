import { StyleSheet, View } from 'react-native'
import React from 'react'
import PropertyFormScreen from '@/components/Listing/ListingLongTerm'

export default function LongTermListings() {
  return (
    <View style={styles.container}>
        <PropertyFormScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

