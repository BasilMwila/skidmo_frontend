import { StyleSheet, View } from 'react-native'
import React from 'react'
import GetHelpScreen from '@/components/Profile/Help/Help'

export default function GetHelp() {
  return (
    <View style={styles.container}>
        <GetHelpScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

