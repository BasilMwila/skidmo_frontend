import MessagesNotification from '@/components/Messages/MessageNotification'
import { StyleSheet, View } from 'react-native'
import React from 'react'

export default function Messages() {
  return (
    <View style={styles.container}>
        <MessagesNotification/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#fff",
      },
})

