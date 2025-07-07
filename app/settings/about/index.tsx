import { StyleSheet, View } from 'react-native'
import React from 'react'
import AboutApp from '@/components/Profile/About/AbouUs'

export default function Wishlist() {
  return (
    <View style={styles.container}>
        <AboutApp/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

