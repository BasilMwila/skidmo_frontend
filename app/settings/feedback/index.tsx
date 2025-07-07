import { StyleSheet, View } from 'react-native'
import React from 'react'
import FeedbackForm from '@/components/Profile/License/Feedback'

export default function FeedbackForms() {
  return (
    <View style={styles.container}>
        <FeedbackForm/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

