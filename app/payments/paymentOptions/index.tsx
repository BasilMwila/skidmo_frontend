import { StyleSheet, View } from 'react-native'
import React from 'react'
import PaymentOptions from '@/components/Payments/PaymentOptions'

export default function PaymentOptionsComponent() {
  return (
    <View style={styles.container}>
        <PaymentOptions/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

