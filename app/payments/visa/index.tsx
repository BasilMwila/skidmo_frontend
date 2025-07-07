import { StyleSheet, View } from 'react-native'
import React from 'react'
import VisaScreen from '@/components/Payments/VisPayment'

export default function PaymentOptionThree() {
  return (
    <View style={styles.container}>
        <VisaScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

