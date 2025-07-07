import { StyleSheet, View } from 'react-native'
import React from 'react'
import PaymentMethodsScreen from '@/components/Payments/AddPayment'

export default function PaymentOptions() {
  return (
    <View style={styles.container}>
        <PaymentMethodsScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

