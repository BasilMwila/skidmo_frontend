// File validation utilities

export const validateFileUri = (uri: string): boolean => {
  if (!uri) return false

  // Check if it's a valid file URI
  const validPrefixes = ["file://", "content://", "ph://", "assets-library://"]
  return validPrefixes.some((prefix) => uri.startsWith(prefix))
}

export const validateImageFile = (uri: string): boolean => {
  if (!validateFileUri(uri)) return false

  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
  const lowerUri = uri.toLowerCase()
  return validExtensions.some((ext) => lowerUri.includes(ext))
}

export const validateVideoFile = (uri: string): boolean => {
  if (!validateFileUri(uri)) return false

  const validExtensions = [".mp4", ".mov", ".avi", ".mkv"]
  const lowerUri = uri.toLowerCase()
  return validExtensions.some((ext) => lowerUri.includes(ext))
}

export const validateDocumentFile = (uri: string): boolean => {
  if (!validateFileUri(uri)) return false

  const validExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
  const lowerUri = uri.toLowerCase()
  return validExtensions.some((ext) => lowerUri.includes(ext))
}

// Helper to check file size (if available)
export const checkFileSize = async (uri: string, maxSizeMB = 10): Promise<boolean> => {
  try {
    // This would require react-native-fs or similar library
    // For now, just return true
    return true
  } catch (error) {
    console.warn("Could not check file size:", error)
    return true
  }
}

// Comprehensive file validation
export const validatePropertyFiles = (
  photos: string[],
  video?: string,
  ownershipPhoto?: string,
  certificatePhoto?: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate photos
  if (photos.length === 0) {
    errors.push("At least one photo is required")
  } else {
    photos.forEach((photo, index) => {
      if (!validateImageFile(photo)) {
        errors.push(`Photo ${index + 1} is not a valid image file`)
      }
    })
  }

  // Validate video (optional)
  if (video && !validateVideoFile(video)) {
    errors.push("Video file is not valid")
  }

  // Validate ownership photo (required for some property types)
  if (ownershipPhoto && !validateDocumentFile(ownershipPhoto)) {
    errors.push("Ownership proof file is not valid")
  }

  // Validate certificate photo (required for agents)
  if (certificatePhoto && !validateDocumentFile(certificatePhoto)) {
    errors.push("Agent certificate file is not valid")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
