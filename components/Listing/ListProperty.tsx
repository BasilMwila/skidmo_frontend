"use client"

import { propertiesAPI } from "@/services/propertiesApi"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import React, { useState } from "react"
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import OwnerSection from "./Filters/OwnerSection"
import PhotosVideoSection from "./Filters/PhotosVideoSection"


const SellListingScreen = () => {
  // Add these state variables at the top of the component
  const [photos, setPhotos] = useState<string[]>([])
  const [video, setVideo] = useState<string>("")
  const [isAgent, setIsAgent] = useState(false)
  const [ownershipPhoto, setOwnershipPhoto] = useState<string>("")
  const [certificatePhoto, setCertificatePhoto] = useState<string>("")
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<string[]>([])

  const [selectedType, setSelectedType] = useState("House")
  const [address, setAddress] = useState("Lusaka, Libala South, 1st, 4")
  const [price, setPrice] = useState("")
  const [rooms, setRooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [balcony, setBalcony] = useState("")
  const [pets, setPets] = useState("")
  const [pool, setPool] = useState("")
  const [garden, setGarden] = useState("")
  const [parking, setParking] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("1993")
  const [contactName, setContactName] = useState("Maria")
  const [contactPhone, setContactPhone] = useState("")
  const [onlineTour, setOnlineTour] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Add these state variables after the existing state declarations
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const router = useRouter()

  const propertyTypes = ["House", "Boarding house", "Hotel room", "Apartment/flat", "Lodge", "Commercial"]
  const numberOptions = ["Studio apartment", "1", "2", "3", "4", "5+"]
  const yesNoOptions = ["Yes", "No"]
  const poolOptions = ["Private", "Common", "No"]
  const gardenOptions = ["Private", "Common", "No"]
  const infrastructureOptions = ["School", "Park", "Hospital", "Clinic", "Shopping mall", "Gym", "Police station"]

  const navigation = useNavigation();
  
    
      React.useEffect(() => {
        navigation.setOptions({ title: 'List Property' });
      }, [navigation]);
  

  // Helper function to prepare nested objects for API
  const preparePhotosForAPI = (photoUrls: string[]) => {
    return photoUrls.map((uri, index) => ({
      image: uri,
      caption: `Photo ${index + 1}`,
      is_primary: index === 0,
    }))
  }

  const prepareVideosForAPI = (videoUrl: string) => {
    return videoUrl
      ? [
          {
            video: videoUrl,
            caption: "Property walkthrough",
          },
        ]
      : []
  }

  const prepareAmenitiesForAPI = (amenityNames: string[]) => {
    return amenityNames.map((name) => ({ name }))
  }

  const prepareInfrastructureForAPI = (infrastructureNames: string[]) => {
    return infrastructureNames.map((name) => ({ name }))
  }

  // Replace the handlePublish function with this enhanced version
  const handlePublish = async () => {
    console.log("Starting property sale publication process...")
    setFormSubmitted(true)

    // Reset previous errors
    setErrors({})

    // Validate required fields
    const newErrors: Record<string, string> = {}

    if (!address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!price.trim()) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required"
    }

    if (!rooms) {
      newErrors.rooms = "Number of rooms is required"
    }

    if (photos.length === 0) {
      newErrors.photos = "At least one photo is required"
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }

    // If there are validation errors, display them and stop
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors)
      setErrors(newErrors)
      Alert.alert("Validation Error", "Please correct the highlighted fields")
      return
    }

    setIsLoading(true)

    try {
      let response
      const baseData = {
        term_category: "LONG" as const,
        purpose: "BUY" as const,
        sale_price: Number.parseFloat(price),
        price_negotiable: false,
        title: `${selectedType} for sale in ${address}`,
        address: address,
        description: additionalInfo || `${selectedType} available for purchase`,
        security: true,
        pet_friendly: pets === "Yes",
        allow_smoking: false,
        allow_kids: true,
        photos: preparePhotosForAPI(photos),
        videos: prepareVideosForAPI(video),
        owner_proof: ownershipPhoto || null,
        agent_certificate: certificatePhoto || null,
        is_agent: isAgent,
      }

      console.log("Base property data for sale:", baseData)

      if (selectedType === "House" || selectedType === "Boarding house") {
        const houseData = {
          ...baseData,
          property_type: (selectedType === "Boarding house" ? "BOARDING" : "HOUSE") as const,
          is_boarding: selectedType === "Boarding house",
          bedroom_count: Math.min(5, Math.max(1, Number.parseInt(rooms) || 1)) as 1 | 2 | 3 | 4 | 5,
          bathroom_count: Math.min(5, Math.max(1, Number.parseInt(bathrooms) || 1)) as 1 | 2 | 3 | 4 | 5,
          has_balcony: balcony === "Yes",
          has_patio: false,
          has_pool: pool === "Private" || pool === "Common",
          garden: (garden === "Private" ? "PRIVATE" : garden === "Common" ? "COMMON" : "NO") as
            | "PRIVATE"
            | "COMMON"
            | "NO",
          amenities: prepareAmenitiesForAPI(selectedInfrastructure),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        console.log("Publishing HOUSE/BOARDING property for sale:", JSON.stringify(houseData, null, 2))
        response = await propertiesAPI.house.create(houseData)
      } else if (selectedType === "Apartment/flat") {
        const apartmentData = {
          ...baseData,
          property_type: "APARTMENT" as const,
          room_count: (rooms === "Studio apartment" ? "STUDIO" : rooms || "1") as
            | "STUDIO"
            | "1"
            | "2"
            | "3"
            | "4"
            | "5+",
          bedroom_count: Math.min(5, Math.max(1, Number.parseInt(rooms) || 1)) as 1 | 2 | 3 | 4 | 5,
          bathroom_count: Math.min(5, Math.max(1, Number.parseInt(bathrooms) || 1)) as 1 | 2 | 3 | 4 | 5,
          has_balcony: balcony === "Yes",
          has_patio: false,
          has_pool: pool === "Private" || pool === "Common",
          garden: (garden === "Private" ? "PRIVATE" : garden === "Common" ? "COMMON" : "NO") as
            | "PRIVATE"
            | "COMMON"
            | "NO",
          amenities: prepareAmenitiesForAPI(selectedInfrastructure),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        console.log("Publishing APARTMENT property for sale:", JSON.stringify(apartmentData, null, 2))
        response = await propertiesAPI.apartment.create(apartmentData)
      } else if (selectedType === "Lodge" || selectedType === "Hotel room") {
        const hotelData = {
          ...baseData,
          property_type: "LODGE_HOTEL" as const,
          room_type: "SINGLE" as const,
          room_count: 1,
          bed_type: "SINGLE" as const,
          view_type: "CITY" as const,
          has_balcony: balcony === "Yes",
          has_patio: false,
          has_pool: pool === "Private" || pool === "Common",
          meal_option: "BREAKFAST" as const,
          garden: "NO" as "PRIVATE" | "COMMON" | "NO",
          // Required fields with defaults
          spa: false,
          parking: parking === "Yes",
          fitness_center: false,
          bar: false,
          restaurant: false,
          wifi: true,
          bidet: false,
          bath: false,
          outdoor_shower: false,
          hot_water: true,
          hair_dryer: false,
          shower_gel: false,
          shampoo: false,
          conditioner: false,
          essentials: true,
          washing_machine: false,
          drying_rack: false,
          clothes_storage: true,
          free_dryer: false,
          iron: false,
          hangers: true,
          bed_linen: true,
          cot: false,
          room_darkening_blinds: false,
          travel_cot: false,
          extra_pillows: true,
          mosquito_net: false,
          microwave: false,
          fridge: true,
          cooking_basics: false,
          dishes: false,
          dishwasher: false,
          oven: false,
          kettle: false,
          coffee_maker: false,
          toaster: false,
          blender: false,
          dining_table: false,
          electric_cooker: false,
          tv: true,
          air_conditioner: true,
          ceiling_fan: false,
          heating: false,
          portable_fans: false,
          smoke_alarm: true,
          carbon_monoxide_alarm: false,
          first_aid_kit: false,
          luggage_dropoff: false,
          lockbox: false,
          beach_essentials: false,
          self_checkin: false,
          kids_play_area: false,
          wheelchair_access: false,
          meeting_rooms: false,
          business_center: false,
          coworking_space: false,
          wheelchair: false,
          elevators: false,
        }
        console.log("Publishing LODGE_HOTEL property for sale:", JSON.stringify(hotelData, null, 2))
        response = await propertiesAPI.hotels.create(hotelData)
      } else if (selectedType === "Commercial") {
        const commercialData = {
          ...baseData,
          property_type: "COMMERCIAL" as const,
          bathroom_count: Math.min(5, Math.max(1, Number.parseInt(bathrooms) || 1)) as 1 | 2 | 3 | 4 | 5,
          has_balcony: balcony === "Yes",
          has_patio: false,
          pool: (pool === "Private" ? "PRIVATE" : pool === "Common" ? "COMMON" : "NO") as "PRIVATE" | "COMMON" | "NO",
          garden: (garden === "Private" ? "PRIVATE" : garden === "Common" ? "COMMON" : "NO") as
            | "PRIVATE"
            | "COMMON"
            | "NO",
          amenities: prepareAmenitiesForAPI(selectedInfrastructure),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        console.log("Publishing COMMERCIAL property for sale:", JSON.stringify(commercialData, null, 2))
        response = await propertiesAPI.commercial.create(commercialData)
      }

      console.log("API response:", response)
      Alert.alert("Success", "Property listed successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form or navigate back
            setSelectedType("House")
            setAddress("")
            setPrice("")
            setPhotos([])
            setVideo("")
            setOwnershipPhoto("")
            setCertificatePhoto("")
            setSelectedInfrastructure([])
            setFormSubmitted(false)
            // Reset other fields as needed
          },
        },
      ])
    } catch (error) {
      console.error("Error creating property:", error)

      // Try to extract API error message if available
      let errorMessage = "Failed to create property listing. Please try again."
      if (error.response && error.response.data) {
        console.log("API Error Response:", error.response.data)

        if (typeof error.response.data === "string") {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        }

        // Check for field-specific errors
        if (error.response.data.errors || typeof error.response.data === "object") {
          const apiErrors = {}
          const errorData = error.response.data.errors || error.response.data

          Object.entries(errorData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              apiErrors[key] = value[0]
            } else if (typeof value === "string") {
              apiErrors[key] = value
            }
          })

          if (Object.keys(apiErrors).length > 0) {
            setErrors(apiErrors)
            console.log("Field errors:", apiErrors)
          }
        }
      }

      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Add this helper function to render error messages
  const renderErrorMessage = (fieldName: string) => {
    if (formSubmitted && errors[fieldName]) {
      return <Text style={styles.errorText}>{errors[fieldName]}</Text>
    }
    return null
  }

  const renderTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Type</Text>
      <View style={styles.typeContainer}>
        {propertyTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, selectedType === type && styles.selectedTypeButton]}
            onPress={() => {
              setSelectedType(type)
              // Navigate based on property type
              if (type === "House" || type === "Boarding house") {
                router.push("/Listings/edit/house/create")
              } else if (type === "Apartment/flat") {
                router.push("/Listings/edit/apartment/create")
              } else if (type === "Lodge" || type === "Hotel room") {
                router.push("/Listings/edit/hotel/create")
              } else if (type === "Commercial") {
                router.push("/Listings/edit/commercial/create")
              }
            }}
          >
            <Text style={[styles.typeButtonText, selectedType === type && styles.selectedTypeButtonText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderNumberSelector = (
    title: string,
    value: string,
    setValue: (value: string) => void,
    options: string[] = numberOptions,
    fieldName?: string,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.numberContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.numberButton,
              value === option && styles.selectedNumberButton,
              formSubmitted && fieldName && errors[fieldName] && styles.errorInput,
            ]}
            onPress={() => setValue(option)}
          >
            <Text style={[styles.numberButtonText, value === option && styles.selectedNumberButtonText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {fieldName && renderErrorMessage(fieldName)}
    </View>
  )

  const renderYesNoSelector = (title: string, value: string, setValue: (value: string) => void) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.yesNoContainer}>
        {yesNoOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.yesNoButton, value === option && styles.selectedYesNoButton]}
            onPress={() => setValue(option)}
          >
            <Text style={[styles.yesNoButtonText, value === option && styles.selectedYesNoButtonText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderInfrastructureSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Near-by Infrastructure</Text>
      <View style={styles.infrastructureContainer}>
        {infrastructureOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.infrastructureButton,
              selectedInfrastructure.includes(option) && styles.selectedInfrastructureButton,
            ]}
            onPress={() => {
              if (selectedInfrastructure.includes(option)) {
                setSelectedInfrastructure(selectedInfrastructure.filter((item) => item !== option))
              } else {
                setSelectedInfrastructure([...selectedInfrastructure, option])
              }
            }}
          >
            <Text
              style={[
                styles.infrastructureButtonText,
                selectedInfrastructure.includes(option) && styles.selectedInfrastructureButtonText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderTypeSelector()}

        {/* Update the address input section to show errors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={[styles.addressContainer, formSubmitted && errors.address && styles.errorInput]}>
            <TextInput
              style={styles.addressInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
            />
            <TouchableOpacity style={styles.clearButton} onPress={() => setAddress("")}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          {renderErrorMessage("address")}
        </View>

        {/* Update the price input section to show errors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <TextInput
            style={[styles.priceInput, formSubmitted && errors.price && styles.errorInput]}
            value={price}
            onChangeText={setPrice}
            placeholder="Price, ZMW"
            keyboardType="numeric"
          />
          {renderErrorMessage("price")}
        </View>

        <Text style={styles.propertyTitle}>Property</Text>

        {renderNumberSelector("Number of rooms", rooms, setRooms, numberOptions, "rooms")}

        {renderNumberSelector("Bathroom", bathrooms, setBathrooms, numberOptions, "bathrooms")}
        {renderYesNoSelector("Balcony", balcony, setBalcony)}
        {renderYesNoSelector("Pets", pets, setPets)}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pool</Text>
          <View style={styles.poolContainer}>
            {poolOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.poolButton, pool === option && styles.selectedPoolButton]}
                onPress={() => setPool(option)}
              >
                <Text style={[styles.poolButtonText, pool === option && styles.selectedPoolButtonText]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garden</Text>
          <View style={styles.gardenContainer}>
            {gardenOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.gardenButton, garden === option && styles.selectedGardenButton]}
                onPress={() => setGarden(option)}
              >
                <Text style={[styles.gardenButtonText, garden === option && styles.selectedGardenButtonText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {renderYesNoSelector("Parking", parking, setParking)}

        {renderInfrastructureSelector()}

        <PhotosVideoSection onAddPhotos={setPhotos} onAddVideo={setVideo} photos={photos} video={video} />

        {/* Update the photos section to show errors */}
        {renderErrorMessage("photos")}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional</Text>
          <View style={styles.additionalContainer}>
            <TextInput
              style={styles.additionalInput}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder="Additional information"
            />
            <TouchableOpacity style={styles.clearButton} onPress={() => setAdditionalInfo("")}>
              <Ionicons name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TextInput style={styles.contactInput} value={contactName} onChangeText={setContactName} placeholder="Name" />
          <TextInput
            style={styles.contactInput}
            value={contactPhone}
            onChangeText={setContactPhone}
            placeholder="Your number phone"
            keyboardType="phone-pad"
          />

          <OwnerSection
            onAddOwnership={setOwnershipPhoto}
            onAddCertificate={setCertificatePhoto}
            isAgent={isAgent}
            onToggleAgent={setIsAgent}
            ownershipPhoto={ownershipPhoto}
            certificatePhoto={certificatePhoto}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.onlineTourContainer}>
            <Text style={styles.onlineTourText}>Online tour</Text>
            <Switch
              value={onlineTour}
              onValueChange={setOnlineTour}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
              thumbColor={onlineTour ? "#fff" : "#f4f3f4"}
            />
          </View>
          <Text style={styles.onlineTourHint}>If you are ready to show the property via video call/virtual tour</Text>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By proceeding to publish your listing on our platform, you agree to pay the service fee and acknowledge that
            you have read and accepted the terms and conditions.
          </Text>
          <TouchableOpacity>
            <Text style={styles.readTermsText}>Read the terms and conditions</Text>
          </TouchableOpacity>

          {/* Update the terms agreement section to show errors */}
          <View style={styles.agreeContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeTerms(!agreeTerms)}>
              {agreeTerms && <Ionicons name="checkmark" size={16} color="#4CAF50" />}
            </TouchableOpacity>
            <Text style={styles.agreeText}>I have read and agree to the terms and conditions</Text>
          </View>
          {renderErrorMessage("terms")}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.publishButton, isLoading && styles.disabledButton]}
            onPress={handlePublish}
            disabled={isLoading}
          >
            <Text style={styles.publishButtonText}>{isLoading ? "Publishing..." : "Publish"}</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 16,
    color: "#000",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedTypeButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedTypeButtonText: {
    color: "#fff",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  addressInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  numberContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  numberButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    minWidth: 50,
    alignItems: "center",
  },
  selectedNumberButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  numberButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedNumberButtonText: {
    color: "#fff",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  yesNoContainer: {
    flexDirection: "row",
    gap: 8,
  },
  yesNoButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedYesNoButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  yesNoButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedYesNoButtonText: {
    color: "#fff",
  },
  poolContainer: {
    flexDirection: "row",
    gap: 8,
  },
  poolButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedPoolButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  poolButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedPoolButtonText: {
    color: "#fff",
  },
  gardenContainer: {
    flexDirection: "row",
    gap: 8,
  },
  gardenButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedGardenButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  gardenButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedGardenButtonText: {
    color: "#fff",
  },
  infrastructureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infrastructureButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  infrastructureButtonText: {
    fontSize: 14,
    color: "#666",
  },
  contactInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  additionalContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  additionalInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  onlineTourContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  onlineTourText: {
    fontSize: 16,
    fontWeight: "500",
  },
  onlineTourHint: {
    fontSize: 14,
    color: "#999",
  },
  termsContainer: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  readTermsText: {
    fontSize: 14,
    color: "#4CAF50",
    textDecorationLine: "underline",
    marginBottom: 16,
  },
  agreeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  agreeText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 24,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  publishButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    alignItems: "center",
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.6,
  },
  selectedInfrastructureButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  selectedInfrastructureButtonText: {
    color: "#fff",
  },
  // Add this to the styles object at the bottom of the file
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  errorInput: {
    borderColor: "red",
  },
})

export default SellListingScreen
