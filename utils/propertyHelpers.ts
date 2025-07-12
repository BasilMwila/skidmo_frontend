// Helper functions for property creation

export const validatePropertyData = (data: any, propertyType: string) => {
  const errors: string[] = []

  // Basic validation
  if (!data.title?.trim()) errors.push("Title is required")
  if (!data.address?.trim()) errors.push("Address is required")
  if (!data.description?.trim()) errors.push("Description is required")
  if (!data.term_category) errors.push("Term category is required")
  if (!data.purpose) errors.push("Purpose is required")

  // Price validation
  if (data.purpose === "RENT" || data.purpose === "RENT_BUY") {
    if (!data.rental_price || data.rental_price <= 0) {
      errors.push("Rental price is required and must be greater than 0")
    }
  }
  if (data.purpose === "BUY" || data.purpose === "RENT_BUY") {
    if (!data.sale_price || data.sale_price <= 0) {
      errors.push("Sale price is required and must be greater than 0")
    }
  }

  // Property type specific validation
  switch (propertyType) {
    case "APARTMENT":
    case "HOUSE":
    case "BOARDING":
      if (!data.bedroom_count) errors.push("Bedroom count is required")
      if (!data.bathroom_count) errors.push("Bathroom count is required")
      break
    case "COMMERCIAL":
      if (!data.bathroom_count) errors.push("Bathroom count is required")
      break
    case "LODGE_HOTEL":
      if (!data.room_count) errors.push("Room count is required")
      if (!data.room_type) errors.push("Room type is required")
      if (!data.bed_type) errors.push("Bed type is required")
      if (!data.view_type) errors.push("View type is required")
      break
  }

  return errors
}

export const preparePropertyData = (formData: any, propertyType: string) => {
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

  const prepared = { ...formData }

  numericFields.forEach((field) => {
    if (prepared[field] && typeof prepared[field] === "string") {
      const num = Number.parseFloat(prepared[field])
      if (!isNaN(num)) {
        prepared[field] = num
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
    if (prepared[field] !== undefined) {
      prepared[field] = Boolean(prepared[field])
    }
  })

  // Set property type
  prepared.property_type = propertyType

  return prepared
}

// Usage example function
export const createProperty = async (
  propertyType: "COMMERCIAL" | "APARTMENT" | "HOUSE" | "LODGE_HOTEL",
  formData: any,
  photos: string[] = [],
  video?: string,
  ownershipPhoto?: string,
  certificatePhoto?: string,
) => {
  try {
    // Validate data
    const errors = validatePropertyData(formData, propertyType)
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(", ")}`)
    }

    // Prepare data
    const preparedData = preparePropertyData(formData, propertyType)

    // Call appropriate API method
    const { propertiesAPI } = await import("./api/properties")

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

    return result
  } catch (error) {
    console.error("Error creating property:", error)
    throw error
  }
}
