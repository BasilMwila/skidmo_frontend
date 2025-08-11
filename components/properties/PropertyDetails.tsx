"use client"
import { messagingAPI } from "@/services/messaging"
import { propertiesAPI } from "@/services/propertiesApi"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
// @ts-ignore: wishlistAPI may not be exported in all setups
import { wishlistAPI } from "@/services/wishlistAPI"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")

const ApartmentDetailScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const propertyId = params.id ? Number(params.id) : null

  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showMoreDescription, setShowMoreDescription] = useState(false)

  useEffect(() => {
    if (propertyId) {
      loadProperty()
      checkLoginStatus()
      checkWishlistStatus()
    }
  }, [propertyId])

  const checkLoginStatus = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id")
      setIsLoggedIn(!!userId)
    } catch (error) {
      console.error("Error checking login status:", error)
    }
  }

 const loadProperty = async () => {
  try {
    setLoading(true);
    if (propertyId) {
      const propertyData = await propertiesAPI.getProperty(propertyId);
      console.log('Fetched property data:', JSON.stringify(propertyData, null, 2)); // 🔥 LOG
      setProperty(propertyData);
    }
  } catch (error) {
    console.error("Error loading property:", error);
    Alert.alert("Error", "Failed to load property details");
    router.back();
  } finally {
    setLoading(false);
  }
};
  const checkWishlistStatus = async () => {
    try {
      if (propertyId && isLoggedIn) {
        const wishlistItems = await wishlistAPI.getWishlist()
        const isInWishlist = wishlistItems.some((item: any) => item.property?.id === propertyId)
        setIsWishlisted(isInWishlist)
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const toggleWishlist = async () => {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "Please log in to add items to your wishlist")
      return
    }

    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(propertyId!)
        setIsWishlisted(false)
        Alert.alert("Removed", "Property removed from wishlist")
      } else {
        await wishlistAPI.addToWishlist(propertyId!)
        setIsWishlisted(true)
        Alert.alert("Added", "Property added to wishlist")
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      Alert.alert("Error", "Failed to update wishlist")
    }
  }

  const shareProperty = async () => {
  try {
    if (!property) return;

    const purpose = (property.purpose || '').trim().toUpperCase();

    // Get correct price
    const price = purpose === 'RENT'
      ? property.rental_price
      : purpose === 'SALE'
        ? property.sale_price
        : property.price;

    const numericPrice = parseFloat(price || '0');
    const formattedPrice = `K${isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2)}`;

    // Determine unit
    let priceUnit = '';
    if (purpose === 'RENT') {
      const term = (property.term_category || '').trim().toUpperCase();
      if (term.includes('SHORT') || term.includes('DAY')) {
        priceUnit = ' per day';
      } else {
        priceUnit = ' per month'; // Safe default
      }
    }

    await Share.share({
      message: `Check out this ${property.property_type.toLowerCase()}: ${property.title}
Price: ${formattedPrice}${priceUnit}
Location: ${property.address}
${purpose === 'RENT' ? 'Available for rent' : 'For sale'}`,
      title: property.title,
    });
  } catch (error) {
    console.error('Error sharing property:', error);
  }
};


  const handleBooking = () => {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "Please log in to book this property")
      return
    }
    // @ts-ignore: Path may not be in router types
    router.push({
      pathname: "/reserve",
      params: {
        propertyId: propertyId?.toString(),
        propertyType: "apartment",
      },
    })
  }


  //Message handling
  const handleMessagePress = async (property: Property) => {
    // Check for owner_id from multiple sources
    const ownerId = property.owner_id || property.lister?.id?.toString()

    if (!ownerId) {
      Alert.alert("Error", "Owner information not available")
      return
    }

    try {
      // Get current user ID (ensure it's a number)
      const currentUserId = Number(await AsyncStorage.getItem("user_id"))
      const ownerIdNumber = Number(ownerId)

      if (!currentUserId || !ownerIdNumber) {
        Alert.alert("Error", "User information not available")
        return
      }

      console.log("Starting conversation between:", currentUserId, ownerIdNumber)

      // Create or get thread
      const thread = await messagingAPI.createOrGetThread(currentUserId, ownerIdNumber)

      // Prepare property details to pass to chat
      const propertyDetails = {
        id: property.id.toString(),
        title: property.title,
        price:
          property.rental_price != null
            ? `K${property.rental_price}`
            : property.price != null
              ? `K${property.price.toFixed(2)}`
              : "Price on request",
        address: property.address,
        number_of_rooms: property.bedroom_count || 0,
        number_of_bathrooms: property.bathroom_count || 0,
        image: property.photos && property.photos.length > 0 ? property.photos[0].image : null,
      }

      // Navigate to chat screen with property details
      router.push({
        pathname: "/chat",
        params: {
          threadId: thread.id.toString(),
          userId: ownerIdNumber.toString(),
          propertyId: property.id.toString(),
          userName: property.lister?.name || "Property Owner",
          propertyDetails: JSON.stringify(propertyDetails),
        },
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      Alert.alert("Error", "Failed to start conversation. Please try again.")
    }
  }
  // Helper to get image URLs from property.photos
  const getImageUrls = () => {
    if (property?.photos && Array.isArray(property.photos) && property.photos.length > 0) {
      return property.photos.map((photo: any) => photo.image)
    }
    return []
  }

  // Helper to get price
  const getDisplayPrice = () => {
    if (!property) return 0
    return property.rental_price ?? property.sale_price ?? property.price ?? 0
  }

  const getPriceInfo = () => {
  if (!property) return { price: 0, unit: '' };

  const purpose = property.purpose?.trim().toUpperCase();
  const term = (property.term_category || '').trim().toUpperCase();

  const price = property.rental_price ?? property.sale_price ?? property.price ?? 0;
  const formattedPrice = `K${parseFloat(price).toFixed(0)}`; // No decimals

  let unit = '';
  if (purpose === 'RENT') {
    unit = term === 'SHORT' ? '/day' : '/month';
  }

  return { price: formattedPrice, unit };
};

  const renderImageCarousel = () => {
    const images = getImageUrls()
    if (!images || images.length === 0) {
      return (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={64} color="#ccc" />
          <Text style={styles.imagePlaceholderText}>No images available</Text>
        </View>
      )
    }

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width)
            setCurrentImageIndex(index)
          }}
        >
          {images.map((image: string, index: number) => (
            <Image key={index} source={{ uri: image }} style={styles.propertyImage} />
          ))}
        </ScrollView>

        {/* Navigation arrows */}
        <TouchableOpacity style={styles.leftArrow}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightArrow}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Image counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1}/{images.length}
          </Text>
        </View>

        {/* Top right buttons */}
        <View style={styles.topRightButtons}>
          <TouchableOpacity style={styles.topButton} onPress={toggleWishlist}>
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={24}
              color={isWishlisted ? "#ff4444" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton} onPress={shareProperty}>
            <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const mockReviews = [
    {
      id: 1,
      name: "Annabel",
      rating: 5,
      timeAgo: "1 week ago",
      comment: "I thoroughly enjoyed my stay, I felt at home and the pictures don't do it justice",
      avatar: "A",
    },
    {
      id: 2,
      name: "Kangwa",
      rating: 5,
      timeAgo: "2 week ago",
      comment: "I thoroughly enjoyed my stay, I felt at home and the pictures don't do it justice",
      avatar: "D",
    },
  ]

  const mockAmenities = [
    { icon: "eye-outline", text: "Garden view" },
    { icon: "business-outline", text: "Balcony" },
    { icon: "home-outline", text: "Patio" },
    { icon: "water-outline", text: "Private pool" },
    { icon: "leaf-outline", text: "Private garden" },
    { icon: "ban-outline", text: "No smoking" },
    { icon: "ban-outline", text: "No pets" },
  ]

  const mockDetailedAmenities = [
    {
      category: "Bathroom",
      items: "Bath, hair dryer, shampoo, conditioner, shower gel, outdoor shower, hot water",
    },
    {
      category: "Bedroom and laundry",
      items: "Washing machine, free dryer, essentials, hangers, bed linens, extra pillows and blankets",
    },
    {
      category: "Other amenities",
      items: "Beach essentials, self check-in, parking space",
    },
  ]

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading property details...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
          <Text style={styles.errorText}>Property not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}

        <View style={styles.contentContainer}>
          {/* Online Tour Button */}
          <TouchableOpacity style={styles.onlineTourButton}>
            <Ionicons name="videocam-outline" size={16} color="#666" />
            <Text style={styles.onlineTourText}>Online tour</Text>
          </TouchableOpacity>

          {/* Property Title and Price */}
         {/* Property Title and Price */}
      <View style={styles.headerSection}>
        <View style={styles.priceAndUnitContainer}>
          <Text style={styles.propertyPrice}>{getPriceInfo().price}</Text>
          {getPriceInfo().unit ? (
            <Text style={styles.priceUnit}>{getPriceInfo().unit}</Text>
          ) : null}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>4.84 (19)</Text>
        </View>
      </View>

          {/* Property Details */}
          <Text style={styles.propertyDetails}>
            {property.bedroom_count} bedroom{property.bedroom_count !== 1 ? 's' : ''}, {property.room_count || property.bedroom_count} room{property.room_count !== 1 ? 's' : ''}
          </Text>


         <Text style={styles.locationText}>{property.address}</Text>

          {/* Map Section */}
          <View style={styles.mapContainer}>
            <Image source={{ uri: "/placeholder.svg?height=200&width=350" }} style={styles.mapImage} />
          </View>

          {/* Property Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property</Text>
            <View style={styles.amenitiesGrid}>
              {mockAmenities.map((amenity, index) => (
                <View key={index} style={styles.amenityRow}>
                  <Ionicons name={amenity.icon as any} size={20} color="#333" />
                  <Text style={styles.amenityText}>{amenity.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* About This Space */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this space</Text>
            <Text style={styles.descriptionText}>
              {property.description || 'No description provided.'}
            </Text>
            <TouchableOpacity onPress={() => setShowMoreDescription(!showMoreDescription)}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
          </View>

          {/* Detailed Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            {mockDetailedAmenities.map((category, index) => (
              <View key={index} style={styles.amenityCategoryContainer}>
                <View style={styles.amenityCategoryHeader}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#333" />
                  <Text style={styles.amenityCategoryTitle}>{category.category}</Text>
                </View>
                <Text style={styles.amenityCategoryItems}>{category.items}</Text>
              </View>
            ))}

            <View style={styles.amenityCategoryContainer}>
              <View style={styles.amenityCategoryHeader}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#333" />
                <Text style={styles.amenityCategoryTitle}>Security</Text>
              </View>
              <Text style={styles.amenityCategoryItems}>Yes</Text>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews our guest</Text>
            <View style={styles.reviewsContainer}>
              {mockReviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerAvatarText}>{review.avatar}</Text>
                    </View>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons key={i} name="star" size={12} color={i < review.rating ? "#FFD700" : "#E0E0E0"} />
                        ))}
                        <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.showAllReviewsButton}>
              <Text style={styles.showAllReviewsText}>Show all reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Listed By Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed by</Text>
            <View style={styles.agentContainer}>
              <View style={styles.agentAvatar}>
                <Text style={styles.agentAvatarText}>L</Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={styles.agentRole}>Agent</Text>
                <Text style={styles.agentId}>Agent ID</Text>
                <Text style={styles.agentName}>Marta</Text>
              </View>
            </View>
          </View>

          {/* Published Date */}
          <Text style={styles.publishedDate}>Published on: 09.01.2025</Text>

          {/* Bottom spacing for floating buttons */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity style={styles.reserveButton} onPress={handleBooking}>
          <Text style={styles.buttonText}>Reserve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton} onPress={() => handleMessagePress(property)}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#666" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#666" />
          <Text style={styles.navText}>Wishlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
          <Text style={[styles.navText, { color: "#4CAF50" }]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // ... (all styles from your provided code)
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  propertyImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: width,
    height: 300,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: "#999",
  },
  leftArrow: {
    position: "absolute",
    left: 16,
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  rightArrow: {
    position: "absolute",
    right: 16,
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageCounter: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  topRightButtons: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120, // Extra space for floating buttons
  },
  onlineTourButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    marginBottom: 16,
  },
  onlineTourText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 4,
  },
  propertyDetails: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  mapContainer: {
    marginBottom: 24,
  },
  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  amenitiesGrid: {
    gap: 12,
  },
  amenityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  amenityText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 8,
  },
  showMoreText: {
    fontSize: 16,
    color: "#333",
    textDecorationLine: "underline",
  },
  amenityCategoryContainer: {
    marginBottom: 16,
  },
  amenityCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityCategoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  amenityCategoryItems: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginLeft: 28,
  },
  reviewsContainer: {
    gap: 16,
    marginBottom: 16,
  },
  reviewItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  reviewerAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewTime: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  showAllReviewsButton: {
    backgroundColor: "#E8F5E8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  showAllReviewsText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  agentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  agentAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  agentInfo: {
    flex: 1,
  },
  agentRole: {
    fontSize: 14,
    color: "#666",
  },
  agentId: {
    fontSize: 12,
    color: "#999",
  },
  agentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  publishedDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  bottomSpacing: {
    height: 80,
  },
  floatingButtons: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  reserveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
})

export default ApartmentDetailScreen