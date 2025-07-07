import { StyleSheet, View } from 'react-native'
import React from 'react'
import BuyScreen from '@/components/Buy/BuyCard'

export default function PropertyOptionTwo() {
  return (
    <View style={styles.container}>
        <BuyScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

