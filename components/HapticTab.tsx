import * as Haptics from "expo-haptics"
import { Platform, Pressable } from "react-native"
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs"

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      onPress={(event) => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        props.onPress?.(event)
      }}
    />
  )
}

