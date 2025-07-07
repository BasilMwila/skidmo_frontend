import { StyleSheet, View } from 'react-native'
import React from 'react'
import SearchComponent from '@/components/Search/SearchComponent'

export default function OriginalFilter() {
  return (
    <View style={styles.container}>
        <SearchComponent/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

