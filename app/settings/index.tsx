import { StyleSheet, View } from 'react-native'
import React from 'react'
import SettingsScreen from '@/components/Profile/Settings/Settigs'

export default function Settings() {
  return (
    <View style={styles.container}>
        <SettingsScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

