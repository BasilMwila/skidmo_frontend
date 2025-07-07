import { StyleSheet, View } from 'react-native'
import React from 'react'
import SignUpScreen from '@/components/Profile/RegisterScreen'
import { Text } from 'react-native-paper'

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
        <Text>Cooming Soon!</Text>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})
