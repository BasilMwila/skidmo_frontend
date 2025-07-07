import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { AntDesign, Feather, EvilIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const BottomNavigation = () => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;

  const tabs: { name: string; href: "/" | "/explore" | "/wishlists" | "/messages" | "/profile"; icon: (color: string) => JSX.Element }[] = [
    {
      name: "Home",
      href: "/",
      icon: (color: string) => <AntDesign name="home" size={24} color={color} />,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: (color: string) => <AntDesign name="search1" size={24} color={color} />,
    },
    {
      name: "Wishlists",
      href: "/wishlists",
      icon: (color: string) => <AntDesign name="hearto" size={24} color={color} />,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: (color: string) => <Feather name="message-circle" size={24} color={color} />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: (color: string) => <EvilIcons name="user" size={24} color={color} />,
    },
  ];

  return (
    <View style={[
      styles.tabBar,
      { backgroundColor: Colors[colorScheme ?? "light"].background }
    ]}>
      {tabs.map((tab) => (
        <Link href={tab.href} asChild key={tab.name}>
          <TouchableOpacity style={styles.tabItem}>
            {tab.icon(tab.name === "Profile" ? tintColor : "#000")}
            <Text style={[
              styles.tabLabel,
              tab.name === "Profile" && { color: tintColor }
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10, // Add extra padding for iOS home indicator
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigation;