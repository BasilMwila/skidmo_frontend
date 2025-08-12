import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname, RelativePathString } from 'expo-router';
import { AntDesign, Feather, EvilIcons } from '@expo/vector-icons';

const APP_GREEN = '#00a651';

interface Tab {
  name: string;
  href: RelativePathString;
  icon: (color: string) => React.ReactElement;
}

const BottomNavigation = () => {
  const router = useRouter();
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

  const handleTabPress = (tab: Tab) => {
    router.push(tab.href);
  };

  return (
    <View style={[
      styles.tabBar,
      { backgroundColor: '#fff' } // Always white background
    ]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || 
          (tab.href === '/messages' && pathname.startsWith('/conversation')) ||
          (tab.href === '/messages' && pathname.startsWith('/chat'));
        return (
          <TouchableOpacity 
            key={tab.name} 
            style={[
              styles.tabItem,
              isActive && styles.activeTabItem
            ]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            {tab.icon(isActive ? APP_GREEN : "#666")}
            <Text style={[
              styles.tabLabel,
              isActive && { color: APP_GREEN, fontWeight: 'bold' }
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: 'rgba(0, 166, 81, 0.1)', // Light green background for active state
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
});

export default BottomNavigation;