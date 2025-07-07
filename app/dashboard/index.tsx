import { StyleSheet, View } from 'react-native'
import React from 'react'
import Dashboard from '@/components/Profile/DashboardScreen'

export default function DashboardOverview() {
  return (
    <View style={styles.container}>
        <Dashboard/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

