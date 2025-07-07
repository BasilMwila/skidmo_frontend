import { StyleSheet, View } from 'react-native'
import React from 'react'
import TermsAndConditions from '@/components/Profile/Terms/TermsAndConditions'

export default function TermsAndCondtion() {
  return (
    <View style={styles.container}>
        <TermsAndConditions/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

