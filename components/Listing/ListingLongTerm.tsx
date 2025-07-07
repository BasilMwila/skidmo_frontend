"use client"

import { propertiesAPI } from "@/services/propertiesApi"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
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


const RentLongTermScreen = () => {
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
  const [furnished, setFurnished] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation();

  
    React.useEffect(() => {
      navigation.setOptions({ title: 'Long-Term Listing' });
    }, [navigation]);

  // Media states
  const [photos, setPhotos] = useState<string[]>([])
  const [video, setVideo] = useState<string>("")

  // Owner/Agent states
  const [isAgent, setIsAgent] = useState(false)
  const [ownershipPhoto, setOwnershipPhoto] = useState<string>("")
  const [certificatePhoto, setCertificatePhoto] = useState<string>("")

  // Infrastructure selection
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<string[]>([])

  // Hotel/Lodge specific states
  const [roomType, setRoomType] = useState("")
  const [bedType, setBedType] = useState("")
  const [viewType, setViewType] = useState("")
  const [mealOptions, setMealOptions] = useState("")
  const [hotelAmenities, setHotelAmenities] = useState<string[]>([])

  // Commercial specific states
  const [commercialType, setCommercialType] = useState("")
  const [floorArea, setFloorArea] = useState("")
  const [parkingSpaces, setParkingSpaces] = useState("")
  const [officeFeatures, setOfficeFeatures] = useState<string[]>([])

  const [bedroomLaundry, setBedroomLaundry] = useState([])
  const [kitchenDining, setKitchenDining] = useState([])
  const [entertainment, setEntertainment] = useState([])
  const [heatingCooling, setHeatingCooling] = useState([])
  const [homeOffice, setHomeOffice] = useState([])
  const [otherAmenities, setOtherAmenities] = useState([])
  const [accessibility, setAccessibility] = useState([])
  const [security, setSecurity] = useState([])
  const [additionalInfo, setAdditionalInfo] = useState("1993")
  const [contactName, setContactName] = useState("Maria")
  const [contactPhone, setContactPhone] = useState("")
  const [onlineTour, setOnlineTour] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Add these state variables after the existing state declarations
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const propertyTypes = ["House", "Boarding house", "Hotel room", "Apartment/flat", "Lodge", "Commercial"]
  const numberOptions = ["Studio apartment", "1", "2", "3", "4", "5+"]
  const yesNoOptions = ["Yes", "No"]
  const poolOptions = ["Private", "Common", "No"]
  const gardenOptions = ["Private", "Common", "No"]
  const furnishedOptions = ["Not furnished", "Unfurnished", "Partly furnished", "Fully furnished"]
  const infrastructureOptions = ["School", "Park", "Hospital", "Clinic", "Shopping mall", "Gym", "Police station"]

  // Hotel/Lodge specific options
  const roomTypeOptions = ["Single", "Double", "Twin", "Suite", "Deluxe", "Presidential"]
  const bedTypeOptions = ["Single bed", "Double bed", "Queen bed", "King bed", "Bunk bed", "Sofa bed"]
  const viewTypeOptions = ["Sea view", "Mountain view", "City view", "Garden view", "Pool view", "No specific view"]
  const mealOptionsList = ["Breakfast included", "Half board", "Full board", "All inclusive", "No meals"]
  const hotelAmenitiesOptions = [
    "Spa",
    "Fitness center",
    "Business center",
    "Conference rooms",
    "Restaurant",
    "Bar",
    "Room service",
    "Concierge",
    "Valet parking",
    "Airport shuttle",
  ]

  // Commercial specific options
  const commercialTypeOptions = ["Office", "Retail", "Warehouse", "Restaurant", "Medical", "Industrial"]
  const officeFeatureOptions = [
    "Reception area",
    "Meeting rooms",
    "Kitchen/Break room",
    "Storage",
    "Server room",
    "Elevator access",
    "Loading dock",
    "Security system",
  ]

  const bedroomLaundryOptions = ["Hot water", "Dryer", "Washer", "Bed linen", "Extra pillows and blankets"]
  const kitchenDiningOptions = [
    "Dishwasher",
    "Coffee maker",
    "Cooking basics",
    "Dishes and silverware",
    "Freezer",
    "Stove",
    "Refrigerator",
  ]
  const entertainmentOptions = ["TV", "Game console", "Sound system", "Books and reading material"]
  const heatingCoolingOptions = ["Air conditioning", "Heating", "Ceiling fan", "Portable fans"]
  const homeOfficeOptions = ["Wifi", "Dedicated workspace", "Laptop-friendly workspace"]
  const otherAmenitiesOptions = [
    "Free parking on premises",
    "Paid parking on premises",
    "Paid parking off premises",
    "Street parking",
    "Gym",
    "Pool",
    "Hot tub",
    "Patio or balcony",
    "BBQ grill",
    "Fire pit",
    "Pool table",
    "Indoor fireplace",
    "Outdoor dining area",
    "Exercise equipment",
  ]
  const accessibilityOptions = [
    "Step-free guest entrance",
    "Guest entrance wider than 32 inches",
    "Accessible-height bed",
    "Accessible-height toilet",
    "Step-free bedroom access",
    "Step-free bathroom access",
    "Wide hallway clearance",
    "Wide doorway to guest bathroom",
    "Accessible parking spot",
    "Step-free path to guest entrance",
  ]
  const securityOptions = [
    "Smoke alarm",
    "Carbon monoxide alarm",
    "First aid kit",
    "Fire extinguisher",
    "Lock on bedroom door",
  ]

  const isHouseType = () => selectedType === "House" || selectedType === "Boarding house"
  const isApartmentType = () => selectedType === "Apartment/flat"
  const isHotelType = () => selectedType === "Lodge" || selectedType === "Hotel room"
  const isCommercialType = () => selectedType === "Commercial"

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
    console.log("Starting property publication process...")
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

    if (isHouseType() || isApartmentType()) {
      if (!rooms) {
        newErrors.rooms = "Number of rooms is required"
      }
    }

    if (isHotelType()) {
      if (!roomType) {
        newErrors.roomType = "Room type is required"
      }
      if (!bedType) {
        newErrors.bedType = "Bed type is required"
      }
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
        purpose: "RENT" as const,
        rental_price: Number.parseFloat(price),
        price_negotiable: false,
        title: `${selectedType} for rent in ${address}`,
        address: address,
        description: additionalInfo || `${selectedType} available for long-term rent`,
        security: security.length > 0,
        pet_friendly: pets === "Yes",
        allow_smoking: false,
        allow_kids: true,
        photos: preparePhotosForAPI(photos),
        videos: prepareVideosForAPI(video),
        owner_proof: ownershipPhoto || null,
        agent_certificate: certificatePhoto || null,
        is_agent: isAgent,
      }

      console.log("Base property data:", baseData)

      if (isHouseType()) {
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
          amenities: prepareAmenitiesForAPI([
            ...bedroomLaundry,
            ...kitchenDining,
            ...entertainment,
            ...heatingCooling,
            ...homeOffice,
            ...otherAmenities,
          ]),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        console.log("Publishing HOUSE/BOARDING property:")
        console.log("- Property type:", houseData.property_type)
        console.log("- Bedroom count:", houseData.bedroom_count, typeof houseData.bedroom_count)
        console.log("- Bathroom count:", houseData.bathroom_count, typeof houseData.bathroom_count)
        console.log("- Full data:", JSON.stringify(houseData, null, 2))
        response = await propertiesAPI.house.create(houseData)
      } else if (isApartmentType()) {
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
          amenities: prepareAmenitiesForAPI([
            ...bedroomLaundry,
            ...kitchenDining,
            ...entertainment,
            ...heatingCooling,
            ...homeOffice,
            ...otherAmenities,
          ]),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        console.log("Publishing APARTMENT property:", JSON.stringify(apartmentData, null, 2))
        response = await propertiesAPI.apartment.create(apartmentData)
      } else if (isHotelType()) {
        const hotelData = {
          ...baseData,
          property_type: "LODGE_HOTEL" as const,
          room_type: (roomType?.toUpperCase() || "SINGLE") as
            | "SINGLE"
            | "DOUBLE"
            | "TWIN"
            | "SUITE"
            | "FAMILY"
            | "VILLA"
            | "BUNGALOW",
          room_count: 1,
          bed_type: (bedType?.toUpperCase().replace(" ", "_") || "SINGLE") as
            | "SINGLE"
            | "DOUBLE"
            | "KING"
            | "SOFA"
            | "BUNK",
          view_type: (viewType?.toUpperCase().replace(" ", "_") || "CITY") as "SEA" | "GARDEN" | "CITY" | "MOUNTAIN",
          has_balcony: false,
          has_patio: false,
          has_pool: hotelAmenities.includes("Pool"),
          meal_option: (mealOptions?.toUpperCase().replace(" ", "_") || "BREAKFAST") as
            | "BREAKFAST"
            | "HALF_BOARD"
            | "FULL_BOARD"
            | "ALL_INCLUSIVE"
            | "SELF_CATERING",
          garden: "NO" as "PRIVATE" | "COMMON" | "NO",
          // Hotel amenities
          spa: hotelAmenities.includes("Spa"),
          parking: hotelAmenities.includes("Valet parking"),
          fitness_center: hotelAmenities.includes("Fitness center"),
          bar: hotelAmenities.includes("Bar"),
          restaurant: hotelAmenities.includes("Restaurant"),
          wifi: true,
          // Default values for required fields
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
          smoke_alarm: security.includes("Smoke alarm"),
          carbon_monoxide_alarm: security.includes("Carbon monoxide alarm"),
          first_aid_kit: security.includes("First aid kit"),
          luggage_dropoff: false,
          lockbox: false,
          beach_essentials: false,
          self_checkin: false,
          kids_play_area: false,
          wheelchair_access: accessibility.length > 0,
          meeting_rooms: hotelAmenities.includes("Conference rooms"),
          business_center: hotelAmenities.includes("Business center"),
          coworking_space: false,
          wheelchair: accessibility.length > 0,
          elevators: false,
        }
        console.log("Publishing LODGE_HOTEL property:", JSON.stringify(hotelData, null, 2))
        response = await propertiesAPI.hotels.create(hotelData)
      } else if (isCommercialType()) {
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
          amenities: prepareAmenitiesForAPI(officeFeatures),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        console.log("Publishing COMMERCIAL property:", JSON.stringify(commercialData, null, 2))
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

  // Update the handleUpdate function with similar logging
  const handleUpdate = async (propertyId: number) => {
    console.log("Starting property update process for ID:", propertyId)
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

    // Add other validations as needed

    // If there are validation errors, display them and stop
    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", newErrors)
      setErrors(newErrors)
      Alert.alert("Validation Error", "Please correct the highlighted fields")
      return
    }

    setIsLoading(true)

    try {
      // Rest of the update function with console.log statements similar to handlePublish
      // ...

      console.log("Updating property ID:", propertyId)

      let response
      const baseData = {
        term_category: "LONG",
        purpose: "RENT",
        rental_price: Number.parseFloat(price),
        price_negotiable: false,
        title: `${selectedType} for rent in ${address}`,
        address,
        description: additionalInfo || `${selectedType} available for long-term rent`,
        security: security.length > 0,
        pet_friendly: pets === "Yes",
        allow_smoking: false,
        allow_kids: true,
        photos: preparePhotosForAPI(photos),
        videos: prepareVideosForAPI(video),
        owner_proof: ownershipPhoto || null,
        agent_certificate: certificatePhoto || null,
        is_agent: isAgent,
      }

      console.log("Base update data:", baseData)

      // Rest of the function with appropriate console.log statements
      // ...

      if (isHouseType()) {
        const houseData = {
          ...baseData,
          property_type: selectedType === "Boarding house" ? "BOARDING" : "HOUSE",
          is_boarding: selectedType === "Boarding house",
          bedroom_count: Number.parseInt(rooms) || 1,
          bathroom_count: Number.parseInt(bathrooms) || 1,
          has_balcony: balcony === "Yes",
          has_patio: false,
          has_pool: pool === "Private" || pool === "Common",
          garden: garden === "Private" ? "PRIVATE" : garden === "Common" ? "COMMON" : "NO",
          amenities: prepareAmenitiesForAPI([
            ...bedroomLaundry,
            ...kitchenDining,
            ...entertainment,
            ...heatingCooling,
            ...homeOffice,
            ...otherAmenities,
          ]),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        response = await propertiesAPI.house.updateMyProperty(propertyId, houseData)
      } else if (isApartmentType()) {
        const apartmentData = {
          ...baseData,
          property_type: "APARTMENT",
          room_count: rooms === "Studio apartment" ? "STUDIO" : rooms,
          bedroom_count: Number.parseInt(rooms) || 1,
          bathroom_count: Number.parseInt(bathrooms) || 1,
          has_balcony: balcony === "Yes",
          has_patio: false,
          has_pool: pool === "Private" || pool === "Common",
          garden: garden === "Private" ? "PRIVATE" : garden === "Common" ? "COMMON" : "NO",
          amenities: prepareAmenitiesForAPI([
            ...bedroomLaundry,
            ...kitchenDining,
            ...entertainment,
            ...heatingCooling,
            ...homeOffice,
            ...otherAmenities,
          ]),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        response = await propertiesAPI.apartment.updateMyProperty(propertyId, apartmentData)
      } else if (isHotelType()) {
        const hotelData = {
          ...baseData,
          property_type: "LODGE_HOTEL",
          room_type: roomType?.toUpperCase() || "SINGLE",
          room_count: 1,
          bed_type: bedType?.toUpperCase().replace(" ", "_") || "SINGLE",
          view_type: viewType?.toUpperCase().replace(" ", "_") || "CITY",
          has_balcony: false,
          has_patio: false,
          has_pool: hotelAmenities.includes("Pool"),
          meal_option: mealOptions?.toUpperCase().replace(" ", "_") || "BREAKFAST",
          garden: "NO",
          spa: hotelAmenities.includes("Spa"),
          parking: hotelAmenities.includes("Valet parking"),
          fitness_center: hotelAmenities.includes("Fitness center"),
          bar: hotelAmenities.includes("Bar"),
          restaurant: hotelAmenities.includes("Restaurant"),
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
          smoke_alarm: security.includes("Smoke alarm"),
          carbon_monoxide_alarm: security.includes("Carbon monoxide alarm"),
          first_aid_kit: security.includes("First aid kit"),
          luggage_dropoff: false,
          lockbox: false,
          beach_essentials: false,
          self_checkin: false,
          kids_play_area: false,
          wheelchair_access: accessibility.length > 0,
          meeting_rooms: hotelAmenities.includes("Conference rooms"),
          business_center: hotelAmenities.includes("Business center"),
          coworking_space: false,
          wheelchair: accessibility.length > 0,
          elevators: false,
        }
        response = await propertiesAPI.hotels.update(propertyId, hotelData)
      } else if (isCommercialType()) {
        const commercialData = {
          ...baseData,
          property_type: "COMMERCIAL",
          bathroom_count: Number.parseInt(bathrooms) || 1,
          has_balcony: balcony === "Yes",
          has_patio: false,
          pool: pool === "Private" ? "PRIVATE" : pool === "Common" ? "COMMON" : "NO",
          garden: garden === "Private" ? "PRIVATE" : garden === "Common" ? "COMMON" : "NO",
          amenities: prepareAmenitiesForAPI(officeFeatures),
          nearby_infrastructure: prepareInfrastructureForAPI(selectedInfrastructure),
        }
        response = await propertiesAPI.commercial.updateMyProperty(propertyId, commercialData)
      }

      Alert.alert("Success", "Property updated successfully!")
    } catch (error) {
      console.error("Error updating property:", error)

      // Try to extract API error message if available
      const errorMessage = "Failed to update property listing. Please try again."
      if (error.response && error.response.data) {
        // Similar error handling as in handlePublish
        // ...
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
            onPress={() => setSelectedType(type)}
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

  const renderFurnishedSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Furnished</Text>
      <View style={styles.furnishedContainer}>
        {furnishedOptions.map((option) => (
          <TouchableOpacity key={option} style={styles.furnishedButton} onPress={() => setFurnished(option)}>
            <Ionicons
              name={furnished === option ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={furnished === option ? "#4CAF50" : "#ccc"}
            />
            <Text style={[styles.furnishedText, furnished === option && styles.selectedFurnishedText]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderMultiSelectSection = (
    title: string,
    options: string[],
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.multiSelectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.multiSelectButton, selectedValues.includes(option) && styles.selectedMultiSelectButton]}
            onPress={() => {
              if (selectedValues.includes(option)) {
                setSelectedValues(selectedValues.filter((item) => item !== option))
              } else {
                setSelectedValues([...selectedValues, option])
              }
            }}
          >
            <Text
              style={[
                styles.multiSelectButtonText,
                selectedValues.includes(option) && styles.selectedMultiSelectButtonText,
              ]}
            >
              {option}
            </Text>
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

  const renderHouseApartmentFilters = () => (
    <>
      {renderNumberSelector("Number of rooms", rooms, setRooms, numberOptions, "rooms")}
      {renderErrorMessage("rooms")}
      {renderNumberSelector("Bathroom", bathrooms, setBathrooms, numberOptions, "bathrooms")}
      {renderErrorMessage("bathrooms")}
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
      {renderFurnishedSelector()}

      <Text style={styles.amenitiesTitle}>Amenities</Text>
      {renderMultiSelectSection("Bedroom and laundry", bedroomLaundryOptions, bedroomLaundry, setBedroomLaundry)}
      {renderMultiSelectSection("Kitchen and dining", kitchenDiningOptions, kitchenDining, setKitchenDining)}
      {renderMultiSelectSection("Entertainment", entertainmentOptions, entertainment, setEntertainment)}
      {renderMultiSelectSection("Heating and cooling", heatingCoolingOptions, heatingCooling, setHeatingCooling)}
      {renderMultiSelectSection("Home office", homeOfficeOptions, homeOffice, setHomeOffice)}
      {renderMultiSelectSection("Other amenities", otherAmenitiesOptions, otherAmenities, setOtherAmenities)}
      {renderMultiSelectSection("Accessibility features", accessibilityOptions, accessibility, setAccessibility)}
      {renderMultiSelectSection("Security", securityOptions, security, setSecurity)}
    </>
  )

  const renderHotelFilters = () => (
    <>
      <Text style={styles.propertyTitle}>Hotel/Lodge Details</Text>
      {renderNumberSelector("Room Type", roomType, setRoomType, roomTypeOptions)}
      {renderNumberSelector("Bed Type", bedType, setBedType, bedTypeOptions)}
      {renderNumberSelector("View Type", viewType, setViewType, viewTypeOptions)}
      {renderNumberSelector("Meal Options", mealOptions, setMealOptions, mealOptionsList)}
      {renderYesNoSelector("Pets Allowed", pets, setPets)}
      {renderYesNoSelector("Parking", parking, setParking)}

      <Text style={styles.amenitiesTitle}>Hotel Amenities</Text>
      {renderMultiSelectSection("Hotel Features", hotelAmenitiesOptions, hotelAmenities, setHotelAmenities)}
      {renderMultiSelectSection("Accessibility features", accessibilityOptions, accessibility, setAccessibility)}
      {renderMultiSelectSection("Security", securityOptions, security, setSecurity)}
    </>
  )

  const renderCommercialFilters = () => (
    <>
      <Text style={styles.propertyTitle}>Commercial Property</Text>
      {renderNumberSelector("Commercial Type", commercialType, setCommercialType, commercialTypeOptions)}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Floor Area (sq ft)</Text>
        <TextInput
          style={styles.priceInput}
          value={floorArea}
          onChangeText={setFloorArea}
          placeholder="Floor area in square feet"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parking Spaces</Text>
        <TextInput
          style={styles.priceInput}
          value={parkingSpaces}
          onChangeText={setParkingSpaces}
          placeholder="Number of parking spaces"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.amenitiesTitle}>Commercial Features</Text>
      {renderMultiSelectSection("Office Features", officeFeatureOptions, officeFeatures, setOfficeFeatures)}
      {renderMultiSelectSection("Accessibility features", accessibilityOptions, accessibility, setAccessibility)}
      {renderMultiSelectSection("Security", securityOptions, security, setSecurity)}
    </>
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

        {/* Conditional rendering based on property type */}
        {(isHouseType() || isApartmentType()) && renderHouseApartmentFilters()}
        {isHotelType() && renderHotelFilters()}
        {isCommercialType() && renderCommercialFilters()}

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
            <TouchableOpacity style={styles.clearButton}>
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

// Add this to the styles object at the bottom of the file
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
  amenitiesTitle: {
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
  furnishedContainer: {
    gap: 8,
  },
  furnishedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  furnishedText: {
    fontSize: 16,
    color: "#666",
  },
  selectedFurnishedText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  multiSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  multiSelectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedMultiSelectButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  multiSelectButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedMultiSelectButtonText: {
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
  selectedInfrastructureButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  infrastructureButtonText: {
    fontSize: 14,
    color: "#666",
  },
  selectedInfrastructureButtonText: {
    color: "#fff",
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  errorInput: {
    borderColor: "red",
  },
})

export default RentLongTermScreen
