"use client"

import { propertiesAPI } from "@/services/propertiesApi"
import { wishlistService } from "@/services/wishlistAPI"
import { API_CONFIG } from "@/config/apiConfig"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState, useRef } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Video } from "expo-av"

const { width } = Dimensions.get("window")

// Helper function to get full image URL
const getFullImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath // Already a full URL
  }
  // Get the base server URL (without API path)
  const baseServerUrl = API_CONFIG.BASE_URL.replace('/api/test/v1/', '/')
  // Remove leading slash from imagePath if present, then add it back properly
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${baseServerUrl.replace(/\/$/, '')}${cleanPath}`
}

interface PropertyDetails {
  id: string
  title: string
  price: string
  address: string
  description: string
  bedroom_count?: number
  bathroom_count?: number
  number_of_rooms?: number
  number_of_bathrooms?: number
  photos?: string[]
  videos?: string[]
  amenities?: Array<{ name: string }>
  nearby_infrastructure?: Array<{ name: string }>
  owner_phone_number?: string
  contact?: string
  rating?: number
  year_of_construction?: number
  security?: boolean
  pet_friendly?: boolean
  allow_smoking?: boolean
  allow_kids?: boolean
  property_type?: string
  sale_price?: string
  rental_price?: string
  purpose?: string
  term_category?: string
  lister?: any
  created_at?: string
  has_balcony?: boolean
  has_pool?: boolean
  has_patio?: boolean
  garden?: string
  wifi?: boolean
  parking?: boolean
  furnished?: string
}

export default function PropertyDetailsScreen() {
  const { id, type } = useLocalSearchParams()
  const router = useRouter()
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [showMoreDescription, setShowMoreDescription] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const autoSlideInterval = useRef<NodeJS.Timeout | null>(null)

  const propertyId = Array.isArray(id) ? id[0] : id
  const propertyType = Array.isArray(type) ? type[0] : type

  // Add debugging
  useEffect(() => {
    console.log("PropertyDetailsScreen mounted with ID:", propertyId, "Type:", propertyType)
    console.log("Full params:", { id, type })
  }, [])

  useEffect(() => {
    if (propertyId) {
      console.log("Starting to fetch property details for ID:", propertyId)
      fetchPropertyDetails()
      checkWishlistStatus()
    } else {
      console.log("No property ID provided")
      setError("No property ID provided")
      setLoading(false)
    }
  }, [propertyId])

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true)
      console.log("Calling propertiesAPI.getPropertyDetails with ID:", propertyId, "and Type:", propertyType)

      // Pass the property type to the API if available
      const response = await propertiesAPI.getPropertyDetails(propertyId, propertyType)
      console.log("Received property response:", response)
      
      // Extract the actual data from the response
      const data = response.data || response
      console.log("Extracted property data:", data)

      // Transform the data to match our interface
      const transformedProperty: PropertyDetails = {
        id: data.id?.toString() || propertyId,
        title: data.title || "Property",
        price: data.sale_price || data.rental_price || data.price || "Price not available",
        address: data.address || "Address not available",
        description: data.description || "No description available",
        bedroom_count: data.bedroom_count || data.number_of_rooms,
        bathroom_count: data.bathroom_count || data.number_of_bathrooms,
        number_of_rooms: data.number_of_rooms || data.bedroom_count,
        number_of_bathrooms: data.number_of_bathrooms || data.bathroom_count,
        photos: data.photos?.map((photo: any) => getFullImageUrl(photo.image || photo)) || [],
        videos: data.videos?.map((video: any) => getFullImageUrl(video.video || video)) || [],
        amenities: data.amenities || [],
        nearby_infrastructure: data.nearby_infrastructure || [],
        owner_phone_number: data.owner_phone_number || data.contact,
        contact: data.contact || data.owner_phone_number,
        rating: data.rating || data.star_rating || 0,
        year_of_construction: data.year_of_construction,
        security: data.security,
        pet_friendly: data.pet_friendly,
        allow_smoking: data.allow_smoking,
        allow_kids: data.allow_kids,
        property_type: data.property_type,
        sale_price: data.sale_price,
        rental_price: data.rental_price,
        purpose: data.purpose,
        term_category: data.term_category,
        lister: data.lister,
        created_at: data.created_at,
        has_balcony: data.has_balcony,
        has_pool: data.has_pool,
        has_patio: data.has_patio,
        garden: data.garden,
        wifi: data.wifi || data.has_wifi,
        parking: data.parking || data.has_parking,
        furnished: data.furnished,
      }

      console.log("Transformed property:", transformedProperty)
      setProperty(transformedProperty)
    } catch (err) {
      console.error("Error fetching property details:", err)
      setError(`Failed to load property details: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async () => {
    try {
      const wishlistItems = await wishlistService.getWishlist()
      const isInList = wishlistItems.some(
        (item: any) => item.property?.id?.toString() === propertyId || item.id?.toString() === propertyId,
      )
      setIsInWishlist(isInList)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const handleToggleWishlist = async () => {
    if (wishlistLoading) return

    setWishlistLoading(true)
    try {
      await wishlistService.toggleWishlistItem(propertyId, "sale")
      setIsInWishlist(!isInWishlist)
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      Alert.alert("Error", "Failed to update wishlist")
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleCall = () => {
    const phoneNumber = property?.owner_phone_number || property?.contact
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`)
    } else {
      Alert.alert("Error", "Contact number not available")
    }
  }

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsContainer}>
        {Array(Math.floor(count))
          .fill(0)
          .map((_, index) => (
            <FontAwesome key={index} name="star" size={14} color="#FFD700" />
          ))}
        {count % 1 >= 0.5 && <FontAwesome name="star-half-full" size={14} color="#FFD700" />}
      </View>
    )
  }

  // Add debugging info to the loading screen
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00a651" />
          <Text style={styles.loadingText}>Loading property details...</Text>
          <Text style={styles.debugText}>Property ID: {propertyId}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Property not found"}</Text>
          <Text style={styles.debugText}>Property ID: {propertyId}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPropertyDetails}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Property Details</Text>
        <TouchableOpacity style={styles.wishlistButton} onPress={handleToggleWishlist} disabled={wishlistLoading}>
          {wishlistLoading ? (
            <ActivityIndicator size="small" color="#00a651" />
          ) : (
            <Ionicons
              name={isInWishlist ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist ? "red" : "black"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {property.photos && property.photos.length > 0 ? (
            <>
              <Image source={{ uri: property.photos[currentImageIndex] }} style={styles.propertyImage} />
              {property.photos.length > 1 && (
                <View style={styles.imageIndicators}>
                  {property.photos.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.indicator, currentImageIndex === index && styles.activeIndicator]}
                      onPress={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Image source={require("@/assets/appartments/1.jpg")} style={styles.propertyImage} />
          )}
        </View>

        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <View style={styles.priceSection}>
            <Text style={styles.priceText}>
              K{typeof property.price === "string" ? property.price.replace("K", "") : String(property.price || "0")}
            </Text>
            {property.rating && property.rating > 0 && (
              <View style={styles.ratingContainer}>
                {renderStars(property.rating)}
                <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.titleText}>{String(property.title || "")}</Text>
          <Text style={styles.addressText}>{String(property.address || "")}</Text>

          {/* Property Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              {(property.bedroom_count || property.number_of_rooms) && (
                <View style={styles.detailItem}>
                  <Ionicons name="bed-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {String(property.bedroom_count || property.number_of_rooms || 0)} Bedroom
                    {(property.bedroom_count || property.number_of_rooms || 0) > 1 ? "s" : ""}
                  </Text>
                </View>
              )}
              {(property.bathroom_count || property.number_of_bathrooms) && (
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {String(property.bathroom_count || property.number_of_bathrooms || 0)} Bathroom
                    {(property.bathroom_count || property.number_of_bathrooms || 0) > 1 ? "s" : ""}
                  </Text>
                </View>
              )}
              {property.year_of_construction && (
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>Built {String(property.year_of_construction)}</Text>
                </View>
              )}
              {property.property_type && (
                <View style={styles.detailItem}>
                  <Ionicons name="home-outline" size={20} color="#666" />
                  <Text style={styles.detailText}>{String(property.property_type || "")}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{String(property.description || "")}</Text>
          </View>

          {/* Features */}
          {(property.security || property.pet_friendly || property.allow_smoking || property.allow_kids) && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {property.security && (
                  <View style={styles.featureItem}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#00a651" />
                    <Text style={styles.featureText}>Security</Text>
                  </View>
                )}
                {property.pet_friendly && (
                  <View style={styles.featureItem}>
                    <Ionicons name="paw-outline" size={20} color="#00a651" />
                    <Text style={styles.featureText}>Pet Friendly</Text>
                  </View>
                )}
                {property.allow_smoking && (
                  <View style={styles.featureItem}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#00a651" />
                    <Text style={styles.featureText}>Smoking Allowed</Text>
                  </View>
                )}
                {property.allow_kids && (
                  <View style={styles.featureItem}>
                    <Ionicons name="people-outline" size={20} color="#00a651" />
                    <Text style={styles.featureText}>Kid Friendly</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#00a651" />
                    <Text style={styles.amenityText}>{amenity.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Nearby Infrastructure */}
          {property.nearby_infrastructure && property.nearby_infrastructure.length > 0 && (
            <View style={styles.infrastructureSection}>
              <Text style={styles.sectionTitle}>Nearby</Text>
              <View style={styles.infrastructureGrid}>
                {property.nearby_infrastructure.map((infrastructure, index) => (
                  <View key={index} style={styles.infrastructureItem}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.infrastructureText}>{infrastructure.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton} onPress={() => router.back()}>
          <Ionicons name="chatbubble" size={20} color="white" />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  wishlistButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  propertyImage: {
    width: width,
    height: 250,
    backgroundColor: "#f0f0f0",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "white",
  },
  propertyInfo: {
    padding: 16,
    paddingBottom: 120, // Extra space for floating buttons
  },
  mediaItem: {
    width: width,
    height: 300,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineTourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 16,
  },
  onlineTourText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceAndUnitContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  priceUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  propertyDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  amenitiesGrid: {
    gap: 12,
  },
  amenityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  showMoreText: {
    fontSize: 16,
    color: '#333',
    textDecorationLine: 'underline',
  },
  agentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  agentInfo: {
    flex: 1,
  },
  agentRole: {
    fontSize: 14,
    color: '#666',
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  agentContact: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  publishedDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  leftArrow: {
    position: 'absolute',
    left: 16,
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  topRightButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  reserveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  priceSection: {
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  debugText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00a651",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
})
