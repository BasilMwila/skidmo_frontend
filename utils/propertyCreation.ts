// Enhanced property creation utility

import { propertiesAPI } from "../services/propertiesApi"
import { validatePropertyFiles } from "./fileValidation"

export const createPropertySafely = async (
  propertyType: "COMMERCIAL" | "APARTMENT" | "HOUSE" | "LODGE_HOTEL",
  formData: any,
  photos: string[] = [],
  video?: string,
  ownershipPhoto?: string,
  certificatePhoto?: string,
) => {
  try {
    console.log("Starting property creation process...")
    console.log("Property type:", propertyType)
    console.log("Form data:", formData)
    console.log("Files:", {
      photosCount: photos.length,
      hasVideo: !!video,
      hasOwnershipPhoto: !!ownershipPhoto,
      hasCertificatePhoto: !!certificatePhoto,
    })

    // Validate files first
    const fileValidation = validatePropertyFiles(photos, video, ownershipPhoto, certificatePhoto)
    if (!fileValidation.isValid) {
      throw new Error(`File validation failed: ${fileValidation.errors.join(", ")}`)
    }

    // Prepare data
    const preparedData = {
      ...formData,
      property_type: propertyType,
    }

    // Convert string numbers to actual numbers
    const numericFields = [
      "rental_price",
      "sale_price",
      "year_of_construction",
      "bedroom_count",
      "bathroom_count",
      "room_count",
      "star_rating",
    ]

    numericFields.forEach((field) => {
      if (preparedData[field] && typeof preparedData[field] === "string") {
        const num = Number.parseFloat(preparedData[field])
        if (!isNaN(num)) {
          preparedData[field] = num
        }
      }
    })

    // Ensure boolean fields are actual booleans
    const booleanFields = [
      "price_negotiable",
      "security",
      "pet_friendly",
      "allow_smoking",
      "allow_kids",
      "is_agent",
      "has_balcony",
      "has_patio",
      "has_pool",
      "is_boarding",
    ]

    booleanFields.forEach((field) => {
      if (preparedData[field] !== undefined) {
        preparedData[field] = Boolean(preparedData[field])
      }
    })

    console.log("Prepared data:", preparedData)

    // Call appropriate API method
    let result
    switch (propertyType) {
      case "COMMERCIAL":
        result = await propertiesAPI.commercial.create(preparedData, photos, video, ownershipPhoto, certificatePhoto)
        break
      case "APARTMENT":
        result = await propertiesAPI.apartment.create(preparedData, photos, video, ownershipPhoto, certificatePhoto)
        break
      case "HOUSE":
        result = await propertiesAPI.house.create(preparedData, photos, video, ownershipPhoto, certificatePhoto)
        break
      case "LODGE_HOTEL":
        result = await propertiesAPI.hotels.create(preparedData, photos, video, ownershipPhoto, certificatePhoto)
        break
      default:
        throw new Error("Invalid property type")
    }

    console.log("Property created successfully:", result)
    return result
  } catch (error) {
    console.error("Error creating property:", error)

    // Enhanced error handling
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as any).response?.data
    ) {
      const errorData = (error as any).response.data
      if (typeof errorData === "object") {
        const fieldErrors = Object.entries(errorData)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
          .join("\n")
        throw new Error(`Validation errors:\n${fieldErrors}`)
      }
    }

    throw error
  }
}

// Usage example
export const handlePropertySubmission = async (
  propertyType: "COMMERCIAL" | "APARTMENT" | "HOUSE" | "LODGE_HOTEL",
  formData: any,
  selectedPhotos: string[],
  selectedVideo?: string,
  ownershipDocument?: string,
  agentCertificate?: string,
) => {
  try {
    // Show loading state
    console.log("Creating property...")

    const result = await createPropertySafely(
      propertyType,
      formData,
      selectedPhotos,
      selectedVideo,
      ownershipDocument,
      agentCertificate,
    )

    // Show success message
    console.log("Property created successfully!")
    return result
  } catch (error) {
    // Show error message to user
    if (error instanceof Error) {
      console.error("Failed to create property:", error.message)
    } else {
      console.error("Failed to create property:", error)
    }
    throw error
  }
}
