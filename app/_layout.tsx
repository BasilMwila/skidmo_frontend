"use client"

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import "./global.css"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import "react-native-reanimated"
import { useColorScheme } from "@/hooks/useColorScheme"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AuthProvider } from "@/context/AuthContext"
import SkidmoSplashScreen from "./SplashScreen"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const [showCustomSplash, setShowCustomSplash] = useState(true)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  // Handle custom splash screen completion
  const handleSplashComplete = () => {
    setShowCustomSplash(false)
  }

  if (!loaded) {
    return null
  }

  // Show custom splash screen first
  if (showCustomSplash) {
    return <SkidmoSplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <AuthProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="chat" options={{ headerShown: false }} />
              <Stack.Screen name="conversation/index" options={{ headerShown: false }} />
              <Stack.Screen name="conversation/newchat/index" options={{ headerShown: false }} />
              <Stack.Screen name="MapListingScreen" options={{ headerShown: false }} />
              <Stack.Screen name="ExploreScreen" options={{ headerShown: false }} />
              <Stack.Screen name="NotificationsScreen" options={{ headerShown: false }} />
              <Stack.Screen name="PropertyDetailsScreen" options={{ headerShown: false }} />
              <Stack.Screen name="SearchScreen" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
