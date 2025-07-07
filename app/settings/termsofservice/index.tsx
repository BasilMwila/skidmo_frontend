import { StyleSheet, View } from 'react-native'
import React from 'react'
import TermsOfService from '@/components/Profile/Terms/TermsOfService'

export default function TermsOfServices() {
  return (
    <View style={styles.container}>
        <TermsOfService/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

