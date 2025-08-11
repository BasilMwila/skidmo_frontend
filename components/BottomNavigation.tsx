import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link, usePathname, RelativePathString } from 'expo-router';
import { AntDesign, Feather, EvilIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface Tab {
  name: string;
  href: RelativePathString;
  icon: (color: string) => React.ReactElement;
}

const BottomNavigation = () => {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? "light"].tint;
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      name: "Home",
      href: "/" as RelativePathString,
      icon: (color: string) => <AntDesign name="home" size={24} color={color} />,
    },
    {
      name: "Explore",
      href: "/explore" as RelativePathString,
      icon: (color: string) => <AntDesign name="search1" size={24} color={color} />,
    },
    {
      name: "Wishlists",
      href: "/wishlists" as RelativePathString,
      icon: (color: string) => <AntDesign name="hearto" size={24} color={color} />,
    },
    {
      name: "Messages",
      href: "/messages" as RelativePathString,
      icon: (color: string) => <Feather name="message-circle" size={24} color={color} />,
    },
    {
      name: "Profile",
      href: "/profile" as RelativePathString,
      icon: (color: string) => <EvilIcons name="user" size={24} color={color} />,
    },
  ];

  return (
    <View style={[
      styles.tabBar,
      { backgroundColor: '#fff' } // Always white background
    ]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
        <Link href={tab.href} asChild key={tab.name}>
          <TouchableOpacity style={styles.tabItem}>
              {tab.icon(isActive ? tintColor : "#000")}
            <Text style={[
              styles.tabLabel,
                isActive && { color: tintColor, fontWeight: 'bold' }
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        </Link>
        );
      })}
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
    color: '#000',
  },
});

export default BottomNavigation;