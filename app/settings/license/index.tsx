import { StyleSheet, View } from 'react-native'
import React from 'react'
import OpenSourceLicenses from '@/components/Profile/License/LicenseOne'

export default function OpenSourceLicense() {
  return (
    <View style={styles.container}>
        <OpenSourceLicenses/>
    </View>
  )
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
      },
})

