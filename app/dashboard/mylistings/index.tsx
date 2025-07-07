import { StyleSheet, View } from 'react-native'
import React from 'react'
import CreateListing from '@/components/Profile/MyListings/CreateListing'

export default function MyCreateListings() {
  return (
    <View style={styles.container}>
        <CreateListing/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

