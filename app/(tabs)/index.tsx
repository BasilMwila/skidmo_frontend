// 


"use client"

import { ActionButtons } from "@/components/Home/ActionButton"
import { MapFloatingButton } from "@/components/ui/MapFloatingButton"
import { PropertyCardScreen } from "@/components/Home/PropertyCard"
import { SearchBar } from "@/components/Home/SearchBar"
import { propertiesAPI } from "@/services/propertiesApi"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import BottomNavigation from "@/components/BottomNavigation"

interface Property {
  id: number | string
  image: { uri: string }
  price: number | string
  rental_price?: number | string
  sale_price?: number | string
  star_rating?: number
  bedrooms: number
  bathrooms: number
  address: string
  property_type: "COMMERCIAL" | "LODGE_HOTEL" | "APARTMENT" | "HOUSE" | "BOARDING"
  purpose: "RENT" | "BUY" | "RENT_BUY"
  title: string
  is_short_term?: boolean
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
]

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
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

        const allProperties = [
          ...commercialData,
          ...apartmentData,
          ...houseData,
          ...hotelData
        ]
        const transformedProperties = allProperties.map((property: any, index: number) => {
          const isShortTerm = property.term_category === "SHORT" || property.property_type === "LODGE_HOTEL"

          // Use the correct price field based on property purpose
          let displayPrice = 0
          if (property.purpose === "RENT") {
            displayPrice = property.rental_price || 0
          } else if (property.purpose === "BUY") {
            displayPrice = property.sale_price || 0
          } else if (property.purpose === "RENT_BUY") {
            // For RENT_BUY, prioritize rental_price for display
            displayPrice = property.rental_price || property.sale_price || 0
          }

          return {
            id: property.id,
            image: {
              uri: property.photos?.[0]?.image 
                ? `http://192.168.0.184:8000${property.photos[0].image}`
                : PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
            },
            price: displayPrice,
            rental_price: property.rental_price,
            sale_price: property.sale_price,
            star_rating: property.star_rating || 0,
            bedrooms: property.bedroom_count || property.number_of_bedrooms || 0,
            bathrooms: property.bathroom_count || property.number_of_bathrooms || 0,
            address: property.address || "Location not specified",
            property_type: property.property_type,
            purpose: property.purpose,
            title: property.title || `Property ${index + 1}`,
            is_short_term: isShortTerm,
          }
        })

        setProperties(transformedProperties)
      } catch (err) {
        console.error("Failed to fetch properties:", err)
        setError("Failed to load properties. Please try again later.")
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const formatPrice = (item: Property) => {
    if (item.purpose === "RENT_BUY") {
      const rentPrice = item.rental_price || 0
      const buyPrice = item.sale_price || 0
      return `K${rentPrice}/month | K${buyPrice}`
    } else if (item.purpose === "RENT") {
      const price = item.rental_price || item.price || 0
      return item.is_short_term ? `${price}/night` : `${price}/month`
    } else if (item.purpose === "BUY") {
      const price = item.sale_price || item.price || 0
      return `${price}`
    }
    return `${item.price || 0}`
  }

  const handlePropertyPress = async (item: Property) => {
    try {
      console.log(`Navigating to property details for ID: ${item.id} (Type: ${item.property_type})`)
      const propertyId = typeof item.id === "string" ? Number.parseInt(item.id, 10) : item.id

      if (isNaN(propertyId)) {
        throw new Error(`Invalid property ID: ${item.id}`)
      }

      // Use generic property page with type parameter for reliable routing
      const typeParam = item.property_type ? `?type=${item.property_type.toLowerCase()}` : ''
      router.push(`/properties/${propertyId}${typeParam}`)
      
      // Alternative: Navigate based on property type with correct paths
      // Commenting out the type-specific routing since the generic page should handle all types
      // switch (item.property_type) {
      //   case "COMMERCIAL":
      //     router.push(`/properties/commercial/${propertyId}`)
      //     break
      //   case "APARTMENT":
      //     router.push(`/properties/appartment/${propertyId}`)
      //     break
      //   case "HOUSE":
      //   case "BOARDING":
      //     router.push(`/properties/house/${propertyId}`)
      //     break
      //   case "LODGE_HOTEL":
      //     router.push(`/properties/hotel/${propertyId}`)
      //     break
      //   default:
      //     console.warn(`Unknown property type: ${item.property_type}`)
      //     router.push(`/properties/house/${propertyId}`) // Fallback to house
      // }
    } catch (error) {
      console.error("Navigation error:", error)
      // Show an alert or toast to the user
      alert("Unable to view property details. Please try again.")
    }
  }

  const renderItem = ({ item, index }: { item: Property; index: number }) => (
    <TouchableOpacity onPress={() => handlePropertyPress(item)}>
      <PropertyCardScreen
        image={item.image?.uri || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}
        price={formatPrice(item)}
        star_rating={item.star_rating ?? 0}
        property_type={item.property_type}
        rooms={item.bedrooms}
        area={item.bathrooms}
        location={item.address}
        reviews={5}
        showRating={true}
      />
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        {/* Header with Search and Notification */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <SearchBar />
          </View>
        
        </View>

        <ScrollView style={styles.scrollContent}>
          <ActionButtons />

          <View style={styles.listingsContainer}>
            <Text style={styles.listingsTitle}>Recent listings</Text>
            {properties.length > 0 ? (
              <FlatList
                data={properties}
                renderItem={renderItem}
                keyExtractor={(item, index) => `property-${item.id}-${index}`}
                numColumns={2}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noPropertiesText}>No properties available</Text>
            )}
          </View>
        </ScrollView>

        {/* Map Floating Button */}
        <MapFloatingButton />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flex: 1,
    marginRight: 8,
  },
  scrollContent: {
    flex: 1,
  },
  listingsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  listingsTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "600",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noPropertiesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
})
