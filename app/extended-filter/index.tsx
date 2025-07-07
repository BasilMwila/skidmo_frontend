import { StyleSheet, View } from 'react-native'
import React from 'react'
import FilterScreen from '@/components/Explore/Filters'

export default function ExtendedFilters() {
  return (
    <View style={styles.container}>
        <FilterScreen/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

