"use client"

import { SafeAreaView, StyleSheet, View } from "react-native"
import { useEffect, useState } from "react"
import Header from "./Header"
import TermSelector from "./TermSelector"
import GuestCounter from "./GuestCounter"
import SearchButton from "./SearchButton"
import ClearButton from "./ClearButton"
import { useNavigation } from 'expo-router'
import { useRouter } from 'expo-router'

const SearchComponent = () => {
  const [selectedTerm, setSelectedTerm] = useState("short-term")
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  
  const navigation = useNavigation()
  const router = useRouter()
  
  useEffect(() => {
    navigation.setOptions({ 
      headerShown: false
    })
  }, [])

  const handleSearch = () => {
    // Prepare search parameters
    const searchParams = {
      term: selectedTerm,
      ...(selectedTerm === "short-term" && {
        checkIn: checkInDate?.toISOString(),
        checkOut: checkOutDate?.toISOString()
      }),
      // Add other search parameters here
    }
    
    // Navigate to search results or perform search
    console.log("Search parameters:", searchParams)
    // router.push({ pathname: "/search-results", params: searchParams })
  }

  const handleClear = () => {
    setSelectedTerm("short-term")
    setCheckInDate(null)
    setCheckOutDate(null)
    // Reset other filters if needed
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header />
        <TermSelector 
          selectedTerm={selectedTerm} 
          setSelectedTerm={setSelectedTerm}
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
        />
        <GuestCounter />
        <View style={styles.bottomActions}>
          <ClearButton onPress={handleClear} />
          <SearchButton onPress={handleSearch} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: 20,
  },
})

export default SearchComponent