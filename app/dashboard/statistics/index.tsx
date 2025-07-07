import { StyleSheet, View } from 'react-native'
import React from 'react'
import StatisticsScreen from '@/components/Profile/StatisticsScreen'

export default function MyStatistics() {
  return (
    <View style={styles.container}>
        <StatisticsScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

