import { StyleSheet, View } from 'react-native'
import React from 'react'
import NewListingScreen from '@/components/Listing/NewListings'

export default function NewListings() {
  return (
    <View style={styles.container}>
        <NewListingScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

