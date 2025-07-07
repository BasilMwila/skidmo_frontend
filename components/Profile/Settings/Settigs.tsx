"use client"

import type React from "react"
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native"
import { useNavigation, useRouter, Link } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useEffect } from "react"

interface SettingItemProps {
  title: string
  headerText?: string
  rightText?: string
  href: string
}

const SettingItem = ({ title, rightText, headerText, href }: SettingItemProps) => {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.settingItem, pressed && styles.pressed]}>
      <Text style={styles.settingHeader}>{headerText}</Text>
      <Text style={styles.settingText}>{title}</Text>
        
      </Pressable>
    </Link>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  )
}

export default function SettingsScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({ 
      headerShown: false 
    })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <Section title="">
          <SettingItem 
            headerText="Data"
            title="Clear the cache" 
            rightText="20 KB" 
            href="/settings/clear-cache" 
          />
          <SettingItem 
            title="Clear history search" 
            href="/settings/clear-history" 
          />
        </Section>

        <Section title="">
          <SettingItem 
            headerText="Legal"
            title="Terms of service" 
            href="/settings/terms" 
          />
          <SettingItem 
            title="Open source licences" 
            href="/settings/license" 
          />
        </Section>

        <Section title="">
          <SettingItem 
            headerText="Additional"
            title="About app" 
            href="/settings/about" 
          />
          <SettingItem 
            title="Give us feedback" 
            href="/settings/feedback" 
          />
        </Section>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#888" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#888" />
          <Text style={styles.navText}>Explore</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#888" />
          <Text style={styles.navText}>Wishlists</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#888" />
          <Text style={styles.navText}>Messages</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#000" />
          <Text style={[styles.navText, styles.activeNavText]}>Account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // Space for bottom nav
  },
  section: {
    marginBottom: 24,
  },
  settingHeader: {
    fontSize: 20,
    fontWeight: "400",
    color: "#888",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 12,
  },
  sectionContent: {
    backgroundColor: "#fff",
   
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingText: {
    color: "#000000",
    fontWeight: "500",
    paddingHorizontal: 8,
  },
  rightText: {
    fontSize: 14,
    color: "#888",
  },
  pressed: {
    backgroundColor: "#f9f9f9",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  navText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  activeNavText: {
    color: "#000",
    fontWeight: "500",
  },
})