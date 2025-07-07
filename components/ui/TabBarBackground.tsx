import { BlurView } from "expo-blur"
import { Platform, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function TabBarBackground() {
  const { bottom } = useSafeAreaInsets()

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={25}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 49 + bottom,
        }}
      />
    )
  }

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 49 + bottom,
        backgroundColor: "#fff",
        borderTopWidth: 0.5,
        borderTopColor: "#e5e5e5",
      }}
    />
  )
}

