import { StyleSheet, View } from 'react-native'
import React from 'react'
import ConversationCard from '@/components/Messages/CoversationCard'

export default function NewConversation() {
  return (
    <View style={styles.container}>
        <ConversationCard/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

