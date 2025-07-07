import { StyleSheet, View } from 'react-native'
import React from 'react'
import MobileMoneyScreen from '@/components/Payments/MobileMoney'

export default function PaymentOptionTwo() {
  return (
    <View style={styles.container}>
        <MobileMoneyScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

