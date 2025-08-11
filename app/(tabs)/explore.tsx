"use client"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import MapView, { Marker, type Region } from "react-native-maps"
import { SafeAreaView } from "react-native-safe-area-context"
import { Dimensions, StyleSheet, Text, TouchableOpacity, Alert } from "react-native"
import * as Location from "expo-location"
import { propertiesAPI } from "@/services/propertiesApi"

const { width, height } = Dimensions.get("window")

export default function ExploreScreen() {
  const router = useRouter()
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [visibleProperties, setVisibleProperties] = useState<any[]>([])
  const [region, setRegion] = useState<Region>({
    latitude: -15.4167,
    longitude: 28.2833,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useEffect(() => {
    // Fetch all property types
    const fetchProperties = async () => {
      try {
        const [commercial, apartments, houses, hotels] = await Promise.all([
          propertiesAPI.commercial.list(),
          propertiesAPI.apartment.list(),
          propertiesAPI.house.list(),
          propertiesAPI.hotels.list(),
        ])
        const all = [...commercial, ...apartments, ...houses, ...hotels]
        setAllProperties(all)
      } catch (err) {
        setAllProperties([])
      }
    }
    fetchProperties()
  }, [])

  // Filter properties within the current map region
  useEffect(() => {
    const inRegion = allProperties.filter((property) => {
      if (!property.latitude || !property.longitude) return false
      return (
        property.latitude > region.latitude - region.latitudeDelta / 2 &&
        property.latitude < region.latitude + region.latitudeDelta / 2 &&
        property.longitude > region.longitude - region.longitudeDelta / 2 &&
        property.longitude < region.longitude + region.longitudeDelta / 2
      )
    })
    setVisibleProperties(inRegion)
  }, [region, allProperties])

  const getUserLocationAndFilterProperties = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to find properties in your area.")
        return
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      const { latitude, longitude } = location.coords

      // Reverse geocode to get location name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      if (reverseGeocode.length > 0) {
        const locationInfo = reverseGeocode[0]
        const locationName = locationInfo.city || locationInfo.district || locationInfo.subregion || locationInfo.region

        if (locationName) {
          // Filter properties by location name using your CombinedPropertyFilterView
          const locationFilteredProperties = await filterPropertiesByLocation(locationName, latitude, longitude)

          // Navigate to listings with filtered properties
          router.push({
            pathname: "/MapListingScreen",
            params: {
              properties: JSON.stringify(locationFilteredProperties),
              locationName: locationName,
              userLatitude: latitude.toString(),
              userLongitude: longitude.toString(),
            },
          })
        } else {
          Alert.alert("Location Error", "Could not determine your location name.")
        }
      } else {
        Alert.alert("Location Error", "Could not reverse geocode your location.")
      }
    } catch (error) {
      console.error("Location error:", error)
      Alert.alert("Location Error", "Failed to get your location. Please try again.")
    }
  }

  // Helper function to detect if a string is a Plus Code
  const isPlusCode = (str: string): boolean => {
    // Plus codes typically have format like "J935+V42" or "8FRJ+23 City"
    const plusCodePattern = /^[23456789CFGHJMPQRVWX]{4}\+[23456789CFGHJMPQRVWX]{2,3}$/
    return plusCodePattern.test(str) || str.includes("+")
  }

  // Helper function to extract meaningful area name
  const extractAreaName = (locationInfo: any): string => {
    // Priority order for area detection, filtering out Plus Codes
    const candidates = [
      locationInfo.name,
      locationInfo.district,
      locationInfo.subregion,
      locationInfo.street,
      locationInfo.city,
    ].filter(Boolean)

    // Find the first candidate that's not a Plus Code
    for (const candidate of candidates) {
      if (!isPlusCode(candidate)) {
        return candidate
      }
    }

    // If all candidates are Plus Codes or empty, fall back to city/region
    return locationInfo.city || locationInfo.region || locationInfo.district || "Unknown Area"
  }

  const filterPropertiesByLocation = async (locationName: string, latitude: number, longitude: number) => {
    try {
      // Get more detailed location information for broader search
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      let searchTerms: string[] = [locationName]
      let primaryArea = locationName // The main area/neighborhood

      if (reverseGeocode.length > 0) {
        const locationInfo = reverseGeocode[0]

        // Extract meaningful area name (not Plus Code)
        primaryArea = extractAreaName(locationInfo)

        // Collect all location terms, filtering out Plus Codes
        const locationTerms = [
          locationInfo.name,
          locationInfo.district,
          locationInfo.subregion,
          locationInfo.city,
          locationInfo.region,
          locationInfo.street,
          locationInfo.postalCode,
        ]
          .filter(Boolean)
          .filter((term) => !isPlusCode(term)) // Filter out Plus Codes

        // Add all unique terms to search, with primary area first
        searchTerms = [...new Set([primaryArea, ...locationTerms])]
      }

      console.log("Searching with terms (area priority):", searchTerms)
      console.log("Primary area:", primaryArea)

      // Use your CombinedPropertyFilterView for comprehensive filtering
      try {
        let allFilteredProperties: any[] = []

        // First, try to get properties specifically from the primary area/neighborhood
        try {
          const primaryResults = await propertiesAPI.filterPropertiesCombined({
            area: primaryArea,
            location: primaryArea,
            address: primaryArea,
          })

          if (primaryResults && primaryResults.properties && primaryResults.properties.length > 0) {
            console.log(`Found ${primaryResults.properties.length} properties in primary area: ${primaryArea}`)
            allFilteredProperties = [...primaryResults.properties]
          }
        } catch (primaryError) {
          console.log(`Primary area search failed for "${primaryArea}":`, primaryError)
        }

        // Then, search with all other terms to get additional properties
        for (const term of searchTerms) {
          if (term === primaryArea) continue // Skip primary area as we already searched it

          try {
            const results = await propertiesAPI.filterPropertiesCombined({
              address: term,
              city: term,
              area: term,
              district: term,
              location: term,
            })

            if (results && results.properties && results.properties.length > 0) {
              allFilteredProperties = [...allFilteredProperties, ...results.properties]
            }
          } catch (termError) {
            console.log(`Combined filter failed for term "${term}":`, termError)
          }
        }

        // Remove duplicates based on property ID and type
        const uniqueProperties = allFilteredProperties.filter(
          (property, index, self) =>
            index === self.findIndex((p) => p.id === property.id && p.property_type === property.property_type),
        )

        if (uniqueProperties.length > 0) {
          // Sort properties by area relevance
          const sortedProperties = sortPropertiesByAreaRelevance(uniqueProperties, primaryArea, searchTerms)
          console.log(`Found ${sortedProperties.length} properties via combined API, sorted by area relevance`)
          console.log(
            "Top 3 properties after sorting:",
            sortedProperties.slice(0, 3).map((p) => ({
              id: p.id,
              title: p.title,
              area: p.area,
              address: p.address,
              score: calculateAreaRelevanceScore(p, primaryArea, searchTerms),
            })),
          )
          return sortedProperties
        }
      } catch (apiError) {
        console.log("Combined API filter failed, trying individual APIs:", apiError)
      }

      // Fallback to individual API calls if combined filter fails
      try {
        let fallbackProperties: any[] = []

        // Prioritize primary area search first
        try {
          const primaryResults = await propertiesAPI.filterProperties({
            area: primaryArea,
            location: primaryArea,
            address: primaryArea,
          })

          if (primaryResults && primaryResults.length > 0) {
            fallbackProperties = [...primaryResults]
          }
        } catch (primaryError) {
          console.log(`Primary area fallback search failed for "${primaryArea}":`, primaryError)
        }

        // Then search other terms
        for (const term of searchTerms) {
          if (term === primaryArea) continue

          try {
            const results = await propertiesAPI.filterProperties({
              address: term,
              city: term,
              area: term,
              district: term,
            })

            if (results && results.length > 0) {
              fallbackProperties = [...fallbackProperties, ...results]
            }
          } catch (termError) {
            console.log(`Individual filter failed for term "${term}":`, termError)
          }
        }

        const uniqueFallbackProperties = fallbackProperties.filter(
          (property, index, self) => index === self.findIndex((p) => p.id === property.id),
        )

        if (uniqueFallbackProperties.length > 0) {
          const sortedFallback = sortPropertiesByAreaRelevance(uniqueFallbackProperties, primaryArea, searchTerms)
          console.log(`Found ${sortedFallback.length} properties via individual APIs, sorted by area relevance`)
          return sortedFallback
        }
      } catch (fallbackError) {
        console.log("Individual API filters failed, using local filtering:", fallbackError)
      }

      // Final fallback to local filtering with area priority
      const localFilteredProperties = allProperties.filter((property) => {
        const searchFields = [
          property.area,
          property.location,
          property.address,
          property.neighborhood,
          property.suburb,
          property.zone,
          property.city,
          property.district,
          property.region,
          property.title,
          property.description,
        ].filter(Boolean)

        return searchTerms.some((searchTerm) =>
          searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      })

      const sortedLocal = sortPropertiesByAreaRelevance(localFilteredProperties, primaryArea, searchTerms)
      console.log(`Found ${sortedLocal.length} properties via local filtering, sorted by area relevance`)
      return sortedLocal
    } catch (error) {
      console.error("Error filtering properties by location:", error)
      return visibleProperties
    }
  }

  // Sort properties by area relevance
  const sortPropertiesByAreaRelevance = (properties: any[], primaryArea: string, searchTerms: string[]) => {
    return properties.sort((a, b) => {
      // Calculate relevance score for each property
      const scoreA = calculateAreaRelevanceScore(a, primaryArea, searchTerms)
      const scoreB = calculateAreaRelevanceScore(b, primaryArea, searchTerms)

      // Sort by highest relevance score first
      return scoreB - scoreA
    })
  }

  // Calculate area relevance score
  const calculateAreaRelevanceScore = (property: any, primaryArea: string, searchTerms: string[]): number => {
    let score = 0
    const primaryAreaLower = primaryArea.toLowerCase()

    // Check property fields in order of importance
    const fields = [
      { field: property.area, weight: 15 }, // Increased weight for area field
      { field: property.location, weight: 12 },
      { field: property.neighborhood, weight: 10 },
      { field: property.suburb, weight: 8 },
      { field: property.address, weight: 6 },
      { field: property.zone, weight: 5 },
      { field: property.district, weight: 4 },
      { field: property.city, weight: 3 },
      { field: property.region, weight: 2 },
      { field: property.title, weight: 1 },
    ]

    fields.forEach(({ field, weight }) => {
      if (field && typeof field === "string") {
        const fieldLower = field.toLowerCase()

        // Exact match with primary area gets highest score
        if (fieldLower === primaryAreaLower) {
          score += weight * 20 // Increased multiplier for exact matches
        }
        // Field starts with primary area gets very high score
        else if (fieldLower.startsWith(primaryAreaLower)) {
          score += weight * 15
        }
        // Contains primary area gets high score
        else if (fieldLower.includes(primaryAreaLower)) {
          score += weight * 10
        }
        // Contains any search term gets lower score
        else if (searchTerms.some((term) => fieldLower.includes(term.toLowerCase()))) {
          score += weight * 3
        }
      }
    })

    return score
  }

  const handleListingsPress = async () => {
    await getUserLocationAndFilterProperties()
  }

  const renderListingsButton = () => (
    <TouchableOpacity style={styles.listingsButton} onPress={handleListingsPress}>
      <Feather name="list" size={18} color="black" />
      <Text style={styles.listingsButtonText}>Listings</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <MapView style={styles.map} initialRegion={region} onRegionChangeComplete={setRegion}>
        {allProperties.map((property, idx) =>
          property.latitude && property.longitude ? (
            <Marker
              key={property.id}
              coordinate={{ latitude: property.latitude, longitude: property.longitude }}
              pinColor="#1a8917"
            />
          ) : null,
        )}
      </MapView>
      {renderListingsButton()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  listingsButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  listingsButtonText: {
    marginLeft: 8,
    fontWeight: "500",
  },
})
