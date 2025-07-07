import { StyleSheet, View } from 'react-native'
import React from 'react'
import SellPropertyScreen from '@/components/Listing/ListProperty'

export default function PropertyListings() {
  return (
    <View style={styles.container}>
        <SellPropertyScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

