import { StyleSheet, View } from 'react-native'
import React from 'react'
import SignUpScreen from '@/components/Profile/RegisterScreen'
import EditProfileScreen from '@/components/Profile/UserAccountScreen'

export default function Register() {
  return (
    <View style={styles.container}>
        <EditProfileScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})
