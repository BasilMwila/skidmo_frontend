"use client"

import { propertiesAPI } from "@/services/propertiesApi"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width } = Dimensions.get("window")

// Re-using the PropertyDetails interface for consistency
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
  amenities?: { name: string }[]
  nearby_infrastructure?: { name: string }[]
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
}

export default function EditListingScreen() {
  const { id, type } = useLocalSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const propertyIdParam = Array.isArray(id) ? id[0] : id
  const propertyType = Array.isArray(type) ? type[0] : type
  // Extract numeric ID from the formatted string (e.g., "APA123" -> 123)
  const numericPropertyId = Number.parseInt(propertyIdParam.replace(/^\D+/g, ""), 10)

  useEffect(() => {
    if (numericPropertyId && !isNaN(numericPropertyId) && propertyType) {
      fetchPropertyDetails()
    } else {
      setError("Missing or invalid property ID or type for editing.")
      setLoading(false)
    }
  }, [numericPropertyId, propertyType])

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true)
      // Pass the numeric ID to your API
      const data = await propertiesAPI.getPropertyDetails(numericPropertyId, propertyType)

      const transformedProperty: PropertyDetails = {
        id: data.id?.toString() || propertyIdParam, // Keep original formatted ID for display if needed, or use numeric
        title: data.title || "",
        price: data.sale_price || data.rental_price || data.price || "",
        address: data.address || "",
        description: data.description || "",
        bedroom_count: data.bedroom_count || data.number_of_rooms,
        bathroom_count: data.bathroom_count || data.number_of_bathrooms,
        number_of_rooms: data.number_of_rooms || data.bedroom_count,
        number_of_bathrooms: data.number_of_bathrooms || data.bathroom_count,
        photos: data.photos || [],
        amenities: data.amenities || [],
        nearby_infrastructure: data.nearby_infrastructure || [],
        owner_phone_number: data.owner_phone_number || data.contact,
        contact: data.contact || data.owner_phone_number,
        rating: data.rating || 0,
        year_of_construction: data.year_of_construction,
        security: data.security,
        pet_friendly: data.pet_friendly,
        allow_smoking: data.allow_smoking,
        allow_kids: data.allow_kids,
        property_type: data.property_type,
        sale_price: data.sale_price,
        rental_price: data.rental_price,
      }
      setFormData(transformedProperty)
    } catch (err: any) {
      console.error("Error fetching property details for edit:", err)
      setError(`Failed to load property details: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof PropertyDetails, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSubmit = async () => {
    if (!formData) return

    setSubmitting(true)
    try {
      // Determine which API method to call based on propertyType
      let updateFunction
      switch (propertyType?.toLowerCase()) {
        case "apartment":
          updateFunction = propertiesAPI.apartment.updateMyProperty
          break
        case "house":
          updateFunction = propertiesAPI.house.updateMyProperty
          break
        case "commercial":
          updateFunction = propertiesAPI.commercial.updateMyProperty
          break
        case "hotel":
          updateFunction = propertiesAPI.hotels.updateMyProperty
          break
        default:
          throw new Error("Invalid property type for update")
      }

      // Prepare data for API call (ensure numbers are numbers, etc.)
      const dataToUpdate = {
        ...formData,
        // Convert string inputs to numbers where necessary
        bedroom_count: formData.bedroom_count ? Number(formData.bedroom_count) : undefined,
        bathroom_count: formData.bathroom_count ? Number(formData.bathroom_count) : undefined,
        number_of_rooms: formData.number_of_rooms ? Number(formData.number_of_rooms) : undefined,
        number_of_bathrooms: formData.number_of_bathrooms ? Number(formData.number_of_bathrooms) : undefined,
        year_of_construction: formData.year_of_construction ? Number(formData.year_of_construction) : undefined,
        sale_price: formData.sale_price ? Number.parseFloat(formData.sale_price.replace("K", "")) : undefined,
        rental_price: formData.rental_price ? Number.parseFloat(formData.rental_price.replace("K", "")) : undefined,
        // Ensure amenities and infrastructure are in the correct format for your API
        amenities: formData.amenities?.map((a) => ({ name: a.name })),
        nearby_infrastructure: formData.nearby_infrastructure?.map((i) => ({ name: i.name })),
      }

      // Pass the numeric ID to the update function
      await updateFunction(numericPropertyId, dataToUpdate)
      Alert.alert("Success", "Listing updated successfully!")
      router.back() // Go back after successful update
    } catch (err: any) {
      console.error("Error updating listing:", err)
      Alert.alert("Error", `Failed to update listing: ${err.message || "Unknown error"}`)
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Listing</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00a651" />
          <Text style={styles.loadingText}>Loading listing for edit...</Text>
          <Text style={styles.debugText}>Property ID (Param): {propertyIdParam}</Text>
          <Text style={styles.debugText}>Property ID (Numeric): {numericPropertyId}</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !formData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Listing</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Property not found for editing"}</Text>
          <Text style={styles.debugText}>Property ID (Param): {propertyIdParam}</Text>
          <Text style={styles.debugText}>Property ID (Numeric): {numericPropertyId}</Text>
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
        <Text style={styles.headerTitle}>Edit Listing</Text>
        {/* Save button can be here or at the bottom */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color="#00a651" />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={24} color="#00a651" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery (simplified for edit) */}
        <View style={styles.imageContainer}>
          {formData.photos && formData.photos.length > 0 ? (
            <>
              <Image source={{ uri: formData.photos[currentImageIndex] }} style={styles.propertyImage} />
              {formData.photos.length > 1 && (
                <View style={styles.imageIndicators}>
                  {formData.photos.map((_, index) => (
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
          {/* Add button for image upload/selection here */}
          <TouchableOpacity style={styles.addImageButton}>
            <Ionicons name="camera-outline" size={24} color="white" />
            <Text style={styles.addImageButtonText}>Add/Change Image</Text>
          </TouchableOpacity>
        </View>

        {/* Property Info - Editable */}
        <View style={styles.propertyInfo}>
          <View style={styles.priceSection}>
            <Text style={styles.sectionTitle}>Price</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => handleChange("price", text)}
              keyboardType="numeric"
              placeholder="e.g., 150000"
            />
            {formData.rating !== undefined && (
              <View style={styles.ratingContainer}>
                {renderStars(formData.rating)}
                <Text style={styles.ratingText}>{formData.rating.toFixed(1)}</Text>
                {/* Rating input could be a slider or number input */}
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => handleChange("title", text)}
            placeholder="Property Title"
          />

          <Text style={styles.sectionTitle}>Address</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
            placeholder="Property Address"
          />

          {/* Property Details - Editable */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="bed-outline" size={20} color="#666" />
                <TextInput
                  style={styles.detailInput}
                  value={String(formData.bedroom_count || formData.number_of_rooms || "")}
                  onChangeText={(text) => handleChange("bedroom_count", text)}
                  keyboardType="numeric"
                  placeholder="Bedrooms"
                />
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="water-outline" size={20} color="#666" />
                <TextInput
                  style={styles.detailInput}
                  value={String(formData.bathroom_count || formData.number_of_bathrooms || "")}
                  onChangeText={(text) => handleChange("bathroom_count", text)}
                  keyboardType="numeric"
                  placeholder="Bathrooms"
                />
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <TextInput
                  style={styles.detailInput}
                  value={String(formData.year_of_construction || "")}
                  onChangeText={(text) => handleChange("year_of_construction", text)}
                  keyboardType="numeric"
                  placeholder="Year Built"
                />
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="home-outline" size={20} color="#666" />
                <TextInput
                  style={styles.detailInput}
                  value={formData.property_type || ""}
                  onChangeText={(text) => handleChange("property_type", text)}
                  placeholder="Property Type"
                />
              </View>
            </View>
          </View>

          {/* Description - Editable */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={formData.description}
              onChangeText={(text) => handleChange("description", text)}
              multiline
              numberOfLines={4}
              placeholder="Detailed description of the property..."
            />
          </View>

          {/* Features - Editable with Switches */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#00a651" />
                <Text style={styles.featureText}>Security</Text>
                <Switch
                  value={formData.security}
                  onValueChange={(value) => handleChange("security", value)}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.security ? "#00a651" : "#f4f3f4"}
                />
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="paw-outline" size={20} color="#00a651" />
                <Text style={styles.featureText}>Pet Friendly</Text>
                <Switch
                  value={formData.pet_friendly}
                  onValueChange={(value) => handleChange("pet_friendly", value)}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.pet_friendly ? "#00a651" : "#f4f3f4"}
                />
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#00a651" />
                <Text style={styles.featureText}>Smoking Allowed</Text>
                <Switch
                  value={formData.allow_smoking}
                  onValueChange={(value) => handleChange("allow_smoking", value)}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.allow_smoking ? "#00a651" : "#f4f3f4"}
                />
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="people-outline" size={20} color="#00a651" />
                <Text style={styles.featureText}>Kid Friendly</Text>
                <Switch
                  value={formData.allow_kids}
                  onValueChange={(value) => handleChange("allow_kids", value)}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={formData.allow_kids ? "#00a651" : "#f4f3f4"}
                />
              </View>
            </View>
          </View>

          {/* Amenities - Editable (simplified to single text input for now) */}
          {/* For a real app, this would be a more complex component to add/remove amenities */}
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Amenities (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={formData.amenities?.map((a) => a.name).join(", ") || ""}
              onChangeText={(text) =>
                handleChange(
                  "amenities",
                  text.split(",").map((name) => ({ name: name.trim() })),
                )
              }
              placeholder="e.g., Pool, Gym, Parking"
            />
          </View>

          {/* Nearby Infrastructure - Editable (simplified to single text input for now) */}
          {/* For a real app, this would be a more complex component to add/remove infrastructure */}
          <View style={styles.infrastructureSection}>
            <Text style={styles.sectionTitle}>Nearby Infrastructure (comma-separated)</Text>
            <TextInput
              style={styles.input}
              value={formData.nearby_infrastructure?.map((i) => i.name).join(", ") || ""}
              onChangeText={(text) =>
                handleChange(
                  "nearby_infrastructure",
                  text.split(",").map((name) => ({ name: name.trim() })),
                )
              }
              placeholder="e.g., School, Hospital, Mall"
            />
          </View>

          {/* Contact Info - Editable */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TextInput
              style={styles.input}
              value={formData.owner_phone_number || formData.contact || ""}
              onChangeText={(text) => handleChange("owner_phone_number", text)}
              keyboardType="phone-pad"
              placeholder="Owner Phone Number"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.updateButton} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.updateButtonText}>Update Listing</Text>
          )}
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
  saveButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
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
  addImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 166, 81, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addImageButtonText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  propertyInfo: {
    padding: 16,
  },
  priceSection: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%", // Adjust width for two columns
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  detailInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "column", // Stack features vertically for better switch alignment
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between text and switch
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    flex: 1, // Allow text to take available space
  },
  amenitiesSection: {
    marginBottom: 20,
  },
  infrastructureSection: {
    marginBottom: 20,
  },
  contactSection: {
    marginBottom: 20,
  },
  bottomActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00a651",
    paddingVertical: 14,
    borderRadius: 8,
  },
  updateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
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
