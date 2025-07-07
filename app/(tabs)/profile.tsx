import { StyleSheet, View } from 'react-native'
import React from 'react'
import ProfileScreen from '@/components/Profile/AccountScreen'

export default function Profile() {
  return (
    <View style={styles.container}>
        <ProfileScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})