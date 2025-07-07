import { StyleSheet, View } from 'react-native'
import React from 'react'
import WishlistScreen from '@/components/Wishlist/WishListCard'

export default function Wishlist() {
  return (
    <View style={styles.container}>
        <WishlistScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

