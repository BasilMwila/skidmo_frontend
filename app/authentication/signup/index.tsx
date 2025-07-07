import { StyleSheet, View } from 'react-native'
import React from 'react'
import SignUpScreen from '@/components/Profile/RegisterScreen'

export default function Register() {
  return (
    <View style={styles.container}>
        <SignUpScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})
