import { StyleSheet, View } from 'react-native'
import React from 'react'
import WishlistNotification from '@/components/Wishlist/WishListNotification'

export default function Whishlist() {
  return (
    <View style={styles.container}>
        <WishlistNotification/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
      },
})