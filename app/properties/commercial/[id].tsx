"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
} from "react-native"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons"
import { propertiesAPI } from "@/services/propertiesApi"

const PropertyDetails = () => {
  const { id } = useLocalSearchParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const navigation = useNavigation()
  const router = useRouter()

  useEffect(() => {
    navigation.setOptions({ title: "Property Details" })
  }, [navigation])

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = Array.isArray(id) ? id[0] : id

        // Convert to number and validate
        const numericId = Number.parseInt(propertyId, 10)
        if (isNaN(numericId)) {
          throw new Error("Invalid property ID")
        }

        // Determine which API endpoint to use based on property type
        // First get the property to determine its type
        const propertyResponse = await propertiesAPI.commercial
          .get(numericId)
          .catch(() => propertiesAPI.apartment.get(numericId))
          .catch(() => propertiesAPI.house.get(numericId))
          .catch(() => propertiesAPI.hotels.get(numericId))

        if (!propertyResponse) {
          throw new Error("Property not found")
        }

        setProperty(propertyResponse)
      } catch (err) {
        console.error("Failed to fetch property:", err)
        setError("Failed to load property details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleContact = () => {
    if (property?.lister?.phone_number) {
      Linking.openURL(`tel:${property.lister.phone_number}`)
    }
  }

  const renderAmenitySection = (title: string, items: any[]) => {
    if (!items || items.length === 0) return null

    return (
      <View style={styles.amenitySection}>
        <View style={styles.amenityHeader}>
          <Text style={styles.amenityTitle}>{title}</Text>
        </View>
        <View style={styles.amenityItems}>
          {items.map((item, index) => (
            <View key={index} style={styles.amenityItem}>
              <MaterialIcons name="check-circle" size={16} color="#00a651" />
              <Text style={styles.amenityText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  const renderBooleanFeature = (value: boolean) => {
    return value ? <Text style={styles.featureAvailable}>Yes</Text> : <Text style={styles.featureUnavailable}>No</Text>
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00a651" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Utility function to format price
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null) return "N/A"

    const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price
    if (isNaN(numericPrice)) return "N/A"

    return `K${numericPrice.toFixed(2)}`
  }

  // Price display logic
  const getDisplayPrice = (property: any): { price: string; unit: string } => {
    // Handle RENT_BUY purpose
    if (property.purpose === "RENT_BUY") {
      const rentPrice = formatPrice(property.rental_price)
      const buyPrice = formatPrice(property.sale_price)
      return {
        price: `${rentPrice} | ${buyPrice}`,
        unit: property.term_category === "SHORT" ? "/night | total" : "/month | total",
      }
    }

    // Handle RENT or BUY purposes
    const priceValue = property.purpose === "RENT" ? property.rental_price : property.sale_price

    return {
      price: formatPrice(priceValue),
      unit: property.purpose === "RENT" ? (property.term_category === "SHORT" ? "/night" : "/month") : "",
    }
  }

  // In your component's JSX, replace the price display with:
  const { price, unit } = getDisplayPrice(property)

  const priceUnit = property.term_category === "SHORT" ? "/night" : "/month"
  const propertyType = property.property_type.toLowerCase().replace("_", " ")
  const purchaseType = property.purpose.toLowerCase()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          <Image
            source={
              property.photos?.[0]?.image ? { uri: property.photos[0].image } : require("@/assets/appartments/1.jpg")
            }
            style={styles.headerImage}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.termBadge}>
            <Text style={styles.termBadgeText}>{property.term_category === "SHORT" ? "Short Term" : "Long Term"}</Text>
          </View>
        </View>

        {/* Basic Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.priceRatingRow}>
            <Text style={styles.priceText}>
              {price} <Text style={styles.priceUnit}>{unit}</Text>
            </Text>
            {property.rating && (
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyType}>
            {propertyType} for {purchaseType}
          </Text>
          <Text style={styles.locationText}>{property.address}</Text>

          {/* Contact Button */}
          {property.lister?.phone_number && (
            <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
              <Ionicons name="call" size={18} color="white" />
              <Text style={styles.contactButtonText}> {property.lister.phone_number}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Property Details Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Property Details</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="bed" size={20} color="#00a651" />
              <Text style={styles.detailText}>{property.bedroom_count || "N/A"} Bedrooms</Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="shower" size={20} color="#00a651" />
              <Text style={styles.detailText}>{property.bathroom_count || "N/A"} Bathrooms</Text>
            </View>

            {property.year_of_construction && (
              <View style={styles.detailItem}>
                <MaterialIcons name="foundation" size={20} color="#00a651" />
                <Text style={styles.detailText}>Built in {property.year_of_construction}</Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <MaterialIcons name="security" size={20} color="#00a651" />
              <Text style={styles.detailText}>Security: {renderBooleanFeature(property.security)}</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {showFullDescription ? property.description : `${property.description.substring(0, 150)}...`}
          </Text>
          {property.description.length > 150 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text style={styles.showMoreText}>{showFullDescription ? "Show less" : "Show more"}</Text>
              <Ionicons name={showFullDescription ? "chevron-up" : "chevron-down"} size={16} color="#00a651" />
            </TouchableOpacity>
          )}
        </View>

        {/* Features Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <MaterialIcons name="balcony" size={24} color="#00a651" />
              <Text style={styles.featureLabel}>Balcony</Text>
              {renderBooleanFeature(property.has_balcony)}
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="deck" size={24} color="#00a651" />
              <Text style={styles.featureLabel}>Patio</Text>
              {renderBooleanFeature(property.has_patio)}
            </View>

            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="pool" size={24} color="#00a651" />
              <Text style={styles.featureLabel}>Pool</Text>
              {renderBooleanFeature(property.has_pool)}
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="grass" size={24} color="#00a651" />
              <Text style={styles.featureLabel}>Garden</Text>
              <Text style={styles.featureValue}>{property.garden || "None"}</Text>
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="pets" size={24} color="#00a651" />
              <Text style={styles.featureLabel}>Pet Friendly</Text>
              {renderBooleanFeature(property.pet_friendly)}
            </View>

            <View style={styles.featureItem}>
              <MaterialIcons name="smoking-rooms" size={24} color="#00a651" />
              <Text style={styles.featureLabel}>Smoking Allowed</Text>
              {renderBooleanFeature(property.allow_smoking)}
            </View>
          </View>
        </View>

        {/* Amenities Sections */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Amenities</Text>

          {/* Check if any amenities exist */}
          {property.amenities?.length > 0 ||
          property.bathroom_and_laundry?.length > 0 ||
          property.kitchen_and_dining?.length > 0 ||
          property.entertainment?.length > 0 ||
          property.heating_and_cooling?.length > 0 ||
          property.home_and_safety?.length > 0 ||
          property.accessibility?.length > 0 ? (
            <>
              {renderAmenitySection("General Amenities", property.amenities)}
              {renderAmenitySection("Bathroom & Laundry", property.bathroom_and_laundry)}
              {renderAmenitySection("Kitchen & Dining", property.kitchen_and_dining)}
              {renderAmenitySection("Entertainment", property.entertainment)}
              {renderAmenitySection("Heating & Cooling", property.heating_and_cooling)}
              {renderAmenitySection("Home Safety", property.home_and_safety)}
              {renderAmenitySection("Accessibility", property.accessibility)}
            </>
          ) : (
            <Text style={styles.noAmenitiesText}>No amenities listed for this property</Text>
          )}
        </View>

        {/* Nearby Infrastructure */}
        {property.nearby_infrastructure?.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Nearby Infrastructure</Text>
            <View style={styles.amenityItems}>
              {property.nearby_infrastructure.map((item: string, index: number) => (
                <View key={index} style={styles.amenityItem}>
                  <MaterialIcons name="check-circle" size={16} color="#00a651" />
                  <Text style={styles.amenityText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Lister Information */}
        {property.lister && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Listed By</Text>
            <View style={styles.listerInfo}>
              <MaterialIcons name={property.lister.is_agent ? "business" : "person"} size={24} color="#00a651" />
              <View>
                <Text style={styles.listerText}>{property.lister.name}</Text>
                <Text style={styles.listerType}>
                  {property.lister.is_agent ? "Real Estate Agent" : "Property Owner"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Status and ID */}
        <View style={styles.footerContainer}>
          <Text style={styles.statusText}>Status: {property.status || "Available"}</Text>
          <Text style={styles.idText}>Property ID: {property.id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#00a651",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  headerImageContainer: {
    position: "relative",
    height: 250,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  termBadge: {
    position: "absolute",
    top: 40,
    right: 16,
    backgroundColor: "rgba(0, 166, 81, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  termBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00a651",
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  propertyType: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    textTransform: "capitalize",
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 12,
  },
  contactButton: {
    backgroundColor: "#00a651",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  contactButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  sectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  showMoreText: {
    color: "#00a651",
    fontWeight: "600",
    fontSize: 15,
    marginRight: 4,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    color: "#333",
    textAlign: "center",
  },
  featureValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    color: "#00a651",
  },
  featureAvailable: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    color: "#00a651",
  },
  featureUnavailable: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    color: "#ff4444",
  },
  amenitySection: {
    marginBottom: 16,
  },
  amenityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  amenityItems: {
    marginLeft: 8,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  amenityText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
  noAmenitiesText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  listerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  listerText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
    fontWeight: "600",
  },
  listerType: {
    fontSize: 14,
    marginLeft: 10,
    color: "#666",
  },
  footerContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 14,
    color: "#666",
  },
  idText: {
    fontSize: 14,
    color: "#666",
  },
})

export default PropertyDetails
