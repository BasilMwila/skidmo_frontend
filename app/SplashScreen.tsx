"use client"

import { useEffect, useRef } from "react"
import { Text, StyleSheet, Animated, Dimensions, StatusBar, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

interface SkidmoSplashScreenProps {
  onComplete: () => void
}

export default function SkidmoSplashScreen({ onComplete }: SkidmoSplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const logoFadeAnim = useRef(new Animated.Value(0)).current
  const textFadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Start the animation sequence
    const animationSequence = Animated.sequence([
      // Initial fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Logo appears first
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Small delay
      Animated.delay(200),
      // Text appears
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(1500),
      // Fade out everything
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ])

    animationSequence.start(() => {
      // Call onComplete when animation finishes
      onComplete()
    })

    // Auto-complete after 4 seconds as fallback
    const timeout = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => clearTimeout(timeout)
  }, [fadeAnim, scaleAnim, logoFadeAnim, textFadeAnim, onComplete])

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoFadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image source={require("../assets/images/logo/skidmo_logo.png")} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* Brand Name */}
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: textFadeAnim,
            },
          ]}
        >
          <Text style={styles.brandName}>SKIDMO</Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  brandContainer: {
    alignItems: "center",
  },
  brandName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a8917",
    letterSpacing: 2,
    textAlign: "center",
  },
})
