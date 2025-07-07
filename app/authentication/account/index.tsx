import { StyleSheet, View } from 'react-native'
import React from 'react'
import AccountScreen from '@/components/Profile/ProfileScreen'

export default function Account() {
  return (
    <View style={styles.container}>
        <AccountScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})
