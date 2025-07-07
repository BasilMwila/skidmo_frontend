import { StyleSheet, View } from 'react-native'
import React from 'react'
import VerificationScreen from '@/components/Profile/VerificationScreen'

export default function Verification() {
  return (
    <View style={styles.container}>
        <VerificationScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})
