"use client"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { WebView } from 'react-native-webview'
import { SafeAreaView } from "react-native-safe-area-context"
import { Dimensions, StyleSheet, Text, TouchableOpacity, Alert, View } from "react-native"
import * as Location from "expo-location"
import { propertiesAPI } from "@/services/propertiesApi"
import BottomNavigation from "@/components/BottomNavigation"
import { ListingsFloatingButton } from "@/components/ui/ListingsFloatingButton"
import { FilterFloatingButton } from "@/components/ui/FilterFloatingButton"

const { width, height } = Dimensions.get("window")
const YANDEX_API_KEY = '0c66a079-5ace-445a-abe5-cefa336104e3'

export default function ExploreScreen() {
  const router = useRouter()
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [visibleProperties, setVisibleProperties] = useState<any[]>([])
  const [center, setCenter] = useState({
    lat: -15.4167,
    lon: 28.2833,
  })
  const [zoom, setZoom] = useState(10)
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])

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
        // Extract data arrays from API responses
        const commercialData = Array.isArray(commercial?.data) ? commercial.data : [];
        const apartmentData = Array.isArray(apartments?.data) ? apartments.data : [];
        const houseData = Array.isArray(houses?.data) ? houses.data : [];
        const hotelData = Array.isArray(hotels?.data) ? hotels.data : [];

        const all = [...commercialData, ...apartmentData, ...houseData, ...hotelData]
        setAllProperties(all)
      } catch (err) {
        setAllProperties([])
      }
    }
    fetchProperties()
  }, [])

  // Filter properties within the current map region
  useEffect(() => {
    // Use filtered properties if available, otherwise use all properties
    const propertiesSource = filteredProperties.length > 0 ? filteredProperties : allProperties
    
    const inRegion = propertiesSource.filter((property) => {
      if (!property.latitude || !property.longitude) return false
      // Simple distance-based filtering for Yandex Maps
      const latDiff = Math.abs(property.latitude - center.lat)
      const lonDiff = Math.abs(property.longitude - center.lon)
      const threshold = zoom > 12 ? 0.01 : zoom > 8 ? 0.05 : 0.1
      return latDiff <= threshold && lonDiff <= threshold
    })
    setVisibleProperties(inRegion)
  }, [center, allProperties, zoom, filteredProperties])

  // Handle filters applied from FilterFloatingButton
  const handleFiltersApplied = (properties: any[]) => {
    setFilteredProperties(properties)
    console.log(`Applied filters: ${properties.length} properties found`)
  }

  // Generate Yandex Maps HTML
  const generateYandexMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yandex Map</title>
          <script src="https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=en_US" type="text/javascript"></script>
          <style>
            html, body, #map { 
              width: 100%; 
              height: 100%; 
              margin: 0; 
              padding: 0; 
              font-family: Arial, sans-serif;
            }
            .loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div id="loading" class="loading">Loading map...</div>
          <div id="map" style="display: none;"></div>
          <script>
            try {
              ymaps.ready(function() {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('map').style.display = 'block';
                
                var map = new ymaps.Map('map', {
                  center: [${center.lat}, ${center.lon}],
                  zoom: ${zoom},
                  controls: ['zoomControl', 'fullscreenControl']
                });

                // Add a sample marker at center
                var placemark = new ymaps.Placemark([${center.lat}, ${center.lon}], {
                  balloonContent: 'Map Center',
                  hintContent: 'Map Center'
                }, {
                  preset: 'islands#greenDotIcon'
                });
                map.geoObjects.add(placemark);

                // Listen for map center changes
                map.events.add('boundschange', function(e) {
                  try {
                    var center = map.getCenter();
                    var zoom = map.getZoom();
                    if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'centerChange',
                        center: center,
                        zoom: zoom
                      }));
                    }
                  } catch (err) {
                    console.error('Error sending message:', err);
                  }
                });
              });
            } catch (error) {
              document.getElementById('loading').innerHTML = 'Error loading map: ' + error.message;
            }
          </script>
        </body>
      </html>
    `;
  }

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

  // Simplified helper functions
  const extractAreaName = (locationInfo: any): string => {
    return locationInfo.city || locationInfo.district || locationInfo.region || "Unknown Area"
  }

  // Check if a string is a Google Plus Code
  const isPlusCode = (term: string): boolean => {
    if (!term || typeof term !== 'string') return false
    // Plus codes typically contain '+' and are alphanumeric
    // Format: 8 characters + 2-4 characters (e.g., "6FH7+XX" or "6FH7+XXXX")
    const plusCodeRegex = /^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,4}$/i
    return plusCodeRegex.test(term) || term.includes('+')
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

          if (primaryResults && primaryResults.data?.properties && primaryResults.data.properties.length > 0) {
            console.log(`Found ${primaryResults.data.properties.length} properties in primary area: ${primaryArea}`)
            allFilteredProperties = [...primaryResults.data.properties]
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

            if (results && results.data?.properties && results.data.properties.length > 0) {
              allFilteredProperties = [...allFilteredProperties, ...results.data.properties]
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

          if (primaryResults && primaryResults.data?.properties && primaryResults.data.properties.length > 0) {
            fallbackProperties = [...primaryResults.data.properties]
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

            if (results && results.data?.properties && results.data.properties.length > 0) {
              fallbackProperties = [...fallbackProperties, ...results.data.properties]
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


  // Handle messages from WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'centerChange') {
        setCenter({ lat: data.center[0], lon: data.center[1] });
        setZoom(data.zoom);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <WebView
          style={styles.map}
          source={{ html: generateYandexMapHTML() }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="compatibility"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error:', nativeEvent);
          }}
          onLoadEnd={() => {
            console.log('WebView loaded successfully');
          }}
        />
        <ListingsFloatingButton onPress={handleListingsPress} />
        <FilterFloatingButton onFiltersApplied={handleFiltersApplied} />
      </SafeAreaView>
      <View style={styles.bottomNavContainer}>
        <BottomNavigation />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  map: {
    width: "100%",
    height: "100%",
  },
})
