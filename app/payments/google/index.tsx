import { StyleSheet, View } from 'react-native'
import React from 'react'
import MobileMoneyScreen from '@/components/Payments/MobileMoney'
import GoogleAppleScreen from '@/components/Payments/GoogleAppleScreen'

export default function PaymentOptionOne() {
  return (
    <View style={styles.container}>
        <GoogleAppleScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

