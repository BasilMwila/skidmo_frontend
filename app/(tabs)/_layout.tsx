import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { AntDesign, Feather, EvilIcons } from '@expo/vector-icons';

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ErrorBoundary } from "react-error-boundary"

function Fallback({ error }: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "red" }}>Render Error:</Text>
      <Text>{error.message}</Text>
    </View>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wishlists"
          options={{
            title: "Wishlists",
            tabBarIcon: ({ color }) => <AntDesign name="hearto" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => <Feather name="message-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <EvilIcons name="user" size={24} color={color} />,
          }}
        />
      </Tabs>
    </ErrorBoundary>
  )
}