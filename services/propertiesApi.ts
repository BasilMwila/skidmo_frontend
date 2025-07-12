// import AsyncStorage from "@react-native-async-storage/async-storage"
// import axios from "axios"

// const BASE_URL = "https://skidmo-core-system.onrender.com/api/test/v1/"

// // Base Property Interface
// interface BaseProperty {
//   id?: number
//   term_category: "SHORT" | "LONG"
//   purpose: "RENT" | "BUY" | "RENT_BUY"
//   rental_price?: number | string
//   sale_price?: number | string
//   price_negotiable: boolean
//   property_type: "COMMERCIAL" | "LODGE_HOTEL" | "APARTMENT" | "HOUSE" | "BOARDING"
//   title: string
//   address: string
//   description: string
//   year_of_construction?: number
//   security: boolean
//   pet_friendly: boolean
//   allow_smoking: boolean
//   allow_kids: boolean
//   photos?: PropertyPhoto[]
//   videos?: PropertyVideo[]
//   amenities?: Amenity[]
//   nearby_infrastructure?: Infrastructure[]
//   owner_proof?: string | null
//   agent_certificate?: string | null
//   is_agent: boolean
//   owner?: number
//   created_at?: string
//   updated_at?: string
// }

// // Media Interfaces
// interface PropertyPhoto {
//   id?: number
//   image: string
//   caption?: string
//   is_primary: boolean
// }

// interface PropertyVideo {
//   id?: number
//   video: string
//   caption?: string
// }

// // Amenity Interfaces
// interface Amenity {
//   id?: number
//   name: string
// }

// interface Infrastructure {
//   id?: number
//   name: string
// }

// // Commercial Property Interface
// interface CommercialProperty extends BaseProperty {
//   property_type: "COMMERCIAL"
//   bathroom_count: 1 | 2 | 3 | 4 | 5
//   has_balcony: boolean
//   has_patio: boolean
//   pool: "PRIVATE" | "COMMON" | "NO"
//   garden: "PRIVATE" | "COMMON" | "NO"
// }

// // Lodge/Hotel Property Interface
// interface LodgeHotelProperty extends BaseProperty {
//   property_type: "LODGE_HOTEL"
//   star_rating?: 1 | 2 | 3 | 4 | 5
//   room_type: "SINGLE" | "DOUBLE" | "TWIN" | "SUITE" | "FAMILY" | "VILLA" | "BUNGALOW"
//   room_count: number
//   bed_type: "SINGLE" | "DOUBLE" | "KING" | "SOFA" | "BUNK"
//   view_type: "SEA" | "GARDEN" | "CITY" | "MOUNTAIN"
//   has_balcony: boolean
//   has_patio: boolean
//   has_pool: boolean
//   meal_option?: "BREAKFAST" | "HALF_BOARD" | "FULL_BOARD" | "ALL_INCLUSIVE" | "SELF_CATERING"
//   garden: "PRIVATE" | "COMMON" | "NO"

//   // Bathroom amenities
//   bidet: boolean
//   bath: boolean
//   outdoor_shower: boolean
//   hot_water: boolean
//   hair_dryer: boolean
//   shower_gel: boolean
//   shampoo: boolean
//   conditioner: boolean
//   essentials: boolean

//   // Laundry
//   washing_machine: boolean
//   drying_rack: boolean
//   clothes_storage: boolean
//   free_dryer: boolean
//   iron: boolean
//   hangers: boolean
//   bed_linen: boolean
//   cot: boolean
//   room_darkening_blinds: boolean
//   travel_cot: boolean
//   extra_pillows: boolean
//   mosquito_net: boolean

//   // Kitchen
//   microwave: boolean
//   fridge: boolean
//   cooking_basics: boolean
//   dishes: boolean
//   dishwasher: boolean
//   oven: boolean
//   kettle: boolean
//   coffee_maker: boolean
//   toaster: boolean
//   blender: boolean
//   dining_table: boolean
//   electric_cooker: boolean

//   // Entertainment
//   tv: boolean
//   wifi: boolean

//   // Heating/Cooling
//   air_conditioner: boolean
//   ceiling_fan: boolean
//   heating: boolean
//   portable_fans: boolean

//   // Safety
//   smoke_alarm: boolean
//   carbon_monoxide_alarm: boolean
//   first_aid_kit: boolean
//   luggage_dropoff: boolean
//   lockbox: boolean

//   // Other amenities
//   beach_essentials: boolean
//   self_checkin: boolean
//   spa: boolean
//   parking: boolean
//   fitness_center: boolean
//   bar: boolean
//   restaurant: boolean
//   kids_play_area: boolean
//   wheelchair_access: boolean
//   meeting_rooms: boolean
//   business_center: boolean
//   coworking_space: boolean

//   // Accessibility
//   wheelchair: boolean
//   elevators: boolean
// }

// // Apartment/Flat Property Interface
// interface ApartmentFlat extends BaseProperty {
//   property_type: "APARTMENT"
//   room_count: "STUDIO" | "1" | "2" | "3" | "4" | "5+"
//   bedroom_count: 1 | 2 | 3 | 4 | 5
//   bathroom_count: 1 | 2 | 3 | 4 | 5
//   has_balcony: boolean
//   has_patio: boolean
//   has_pool: boolean
//   garden: "PRIVATE" | "COMMON" | "NO"
// }

// // House/Boarding Property Interface
// interface HouseBoarding extends BaseProperty {
//   property_type: "HOUSE" | "BOARDING"
//   is_boarding: boolean
//   bedroom_count: 1 | 2 | 3 | 4 | 5
//   bathroom_count: 1 | 2 | 3 | 4 | 5
//   has_balcony: boolean
//   has_patio: boolean
//   has_pool: boolean
//   garden: "PRIVATE" | "COMMON" | "NO"
// }

// // API Client
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Request interceptor
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       let token = (global as any).access_token
//       if (!token) {
//         token = await AsyncStorage.getItem("access_token")
//         if (token) (global as any).access_token = token
//       }
//       if (token) config.headers.Authorization = `Bearer ${token}`
//       return config
//     } catch (error) {
//       return Promise.reject(error)
//     }
//   },
//   (error) => Promise.reject(error),
// )

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const refreshToken = await AsyncStorage.getItem("refresh_token")
//         if (!refreshToken) throw new Error("Authentication required")

//         // Implement refresh token logic if needed
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError)
//       }
//     }

//     return Promise.reject(error)
//   },
// )

// // Helper function to create FormData for property creation
// const createPropertyFormData = (
//   data: any,
//   photos: string[],
//   video?: string,
//   ownershipPhoto?: string,
//   certificatePhoto?: string,
// ) => {
//   const formData = new FormData()

//   // Add all property fields (excluding file-related fields)
//   Object.keys(data).forEach((key) => {
//     if (key === "photos" || key === "videos" || key === "amenities" || key === "nearby_infrastructure") {
//       // Skip these as we'll handle them separately
//       return
//     }

//     const value = data[key]
//     if (value !== null && value !== undefined) {
//       if (typeof value === "boolean") {
//         formData.append(key, value.toString())
//       } else if (typeof value === "object") {
//         formData.append(key, JSON.stringify(value))
//       } else {
//         formData.append(key, value.toString())
//       }
//     }
//   })

//   // Add photos with proper React Native file format
//   photos.forEach((photoUri, index) => {
//     // Extract filename from URI or create a default one
//     const filename = photoUri.split("/").pop() || `photo_${index}.jpg`
//     const match = /\.(\w+)$/.exec(filename)
//     const type = match ? `image/${match[1]}` : "image/jpeg"

//     const photoFile = {
//       uri: photoUri,
//       type: type,
//       name: filename,
//     }

//     formData.append("photos", photoFile as any)

//     // Add photo metadata
//     formData.append(`photos_${index}_caption`, `Photo ${index + 1}`)
//     formData.append(`photos_${index}_is_primary`, index === 0 ? "true" : "false")
//   })

//   // Add video if provided
//   if (video) {
//     const videoFilename = video.split("/").pop() || "property_video.mp4"
//     const videoMatch = /\.(\w+)$/.exec(videoFilename)
//     const videoType = videoMatch ? `video/${videoMatch[1]}` : "video/mp4"

//     const videoFile = {
//       uri: video,
//       type: videoType,
//       name: videoFilename,
//     }

//     formData.append("videos", videoFile as any)
//     formData.append("videos_0_caption", "Property walkthrough")
//   }

//   // Add ownership documents with proper file format
//   if (ownershipPhoto) {
//     const ownershipFilename = ownershipPhoto.split("/").pop() || "ownership_proof.jpg"
//     const ownershipMatch = /\.(\w+)$/.exec(ownershipFilename)
//     const ownershipType = ownershipMatch ? `image/${ownershipMatch[1]}` : "image/jpeg"

//     const ownershipFile = {
//       uri: ownershipPhoto,
//       type: ownershipType,
//       name: ownershipFilename,
//     }

//     formData.append("owner_proof", ownershipFile as any)
//   }

//   if (certificatePhoto) {
//     const certificateFilename = certificatePhoto.split("/").pop() || "agent_certificate.jpg"
//     const certificateMatch = /\.(\w+)$/.exec(certificateFilename)
//     const certificateType = certificateMatch ? `image/${certificateMatch[1]}` : "image/jpeg"

//     const certificateFile = {
//       uri: certificatePhoto,
//       type: certificateType,
//       name: certificateFilename,
//     }

//     formData.append("agent_certificate", certificateFile as any)
//   }

//   // Add amenities as JSON string
//   if (data.amenities && data.amenities.length > 0) {
//     formData.append("amenities", JSON.stringify(data.amenities))
//   }

//   // Add nearby infrastructure as JSON string
//   if (data.nearby_infrastructure && data.nearby_infrastructure.length > 0) {
//     formData.append("nearby_infrastructure", JSON.stringify(data.nearby_infrastructure))
//   }

//   console.log("FormData contents:")
//   // Log FormData contents for debugging (React Native specific)
//   if (formData._parts) {
//     formData._parts.forEach(([key, value]) => {
//       if (typeof value === "object" && value.uri) {
//         console.log(`${key}:`, { uri: value.uri, type: value.type, name: value.name })
//       } else {
//         console.log(`${key}:`, value)
//       }
//     })
//   }

//   return formData
// }

// export const propertiesAPI = {
//   filterProperties: async (params: any = {}): Promise<any> => {
//     try {
//       const response = await api.get("properties/filter/", { params })
//       return response.data
//     } catch (error) {
//       console.error("Error filtering properties:", error)
//       throw error
//     }
//   },
//   getFilterOptions: async (): Promise<any> => {
//     try {
//       const response = await api.get("properties/filter/options/")
//       return response.data
//     } catch (error) {
//       console.error("Error getting filter options:", error)
//       throw error
//     }
//   },

//   getPropertyCount: async (params: any = {}): Promise<any> => {
//     try {
//       const response = await api.get("properties/count/", { params })
//       return response.data
//     } catch (error) {
//       console.error("Error getting property count:", error)
//       throw error
//     }
//   },
//   // Commercial Properties
//   commercial: {
//     list: async (): Promise<CommercialProperty[]> => {
//       const response = await api.get("commercial/")
//       return response.data
//     },
//     myProperties: async (): Promise<CommercialProperty[]> => {
//       const response = await api.get("commercial/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number): Promise<CommercialProperty> => {
//       const response = await api.get(`commercial/my_properties/${id}/`)
//       return response.data
//     },
//     updateMyProperty: async (id: number, data: Partial<CommercialProperty>) => {
//       const response = await api.patch(`commercial/my_properties/update/${id}/`, data)
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`commercial/my_properties/delete/${id}/`)
//       return response.data
//     },
//     count: async (): Promise<{ count: number }> => {
//       const response = await api.get("commercial/count/")
//       return response.data
//     },
//     create: async (
//       data: Omit<CommercialProperty, "id">,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

//       const response = await api.post("commercial/create/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         transformRequest: (data, headers) => {
//           // Remove the content-type header to let the browser set it with boundary
//           delete headers["Content-Type"]
//           return data
//         },
//       })
//       return response.data
//     },
//     get: async (id: number): Promise<CommercialProperty> => {
//       const response = await api.get(`commercial/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: Partial<CommercialProperty>) => {
//       const response = await api.patch(`commercial/${id}/`, data)
//       return response.data
//     },
//     delete: async (id: number) => {
//       const response = await api.delete(`commercial/${id}/`)
//       return response.data
//     },
//     getPropertyTypes: async (): Promise<Record<string, string>> => {
//       const response = await api.get("commercial/property_types/")
//       return response.data
//     },
//   },

//   // Apartment/Flat Properties
//   apartment: {
//     list: async (): Promise<ApartmentFlat[]> => {
//       const response = await api.get("apartment/")
//       return response.data
//     },
//     myProperties: async (): Promise<ApartmentFlat[]> => {
//       const response = await api.get("apartment/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number): Promise<ApartmentFlat> => {
//       const response = await api.get(`apartment/my_properties/${id}/`)
//       return response.data
//     },
//     updateMyProperty: async (id: number, data: Partial<ApartmentFlat>) => {
//       const response = await api.patch(`apartment/my_properties/update/${id}/`, data)
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`apartment/my_properties/delete/${id}/`)
//       return response.data
//     },
//     count: async (): Promise<{ count: number }> => {
//       const response = await api.get("apartment/count/")
//       return response.data
//     },
//     create: async (
//       data: Omit<ApartmentFlat, "id">,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

//       const response = await api.post("apartment/create/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         transformRequest: (data, headers) => {
//           delete headers["Content-Type"]
//           return data
//         },
//       })
//       return response.data
//     },
//     get: async (id: number): Promise<ApartmentFlat> => {
//       const response = await api.get(`apartment/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: Partial<ApartmentFlat>) => {
//       const response = await api.patch(`apartment/${id}/`, data)
//       return response.data
//     },
//     delete: async (id: number) => {
//       const response = await api.delete(`apartment/${id}/`)
//       return response.data
//     },
//     getPropertyTypes: async (): Promise<Record<string, string>> => {
//       const response = await api.get("apartment/property_types/")
//       return response.data
//     },
//   },

//   // House/Boarding Properties
//   house: {
//     list: async (): Promise<HouseBoarding[]> => {
//       const response = await api.get("house/")
//       return response.data
//     },
//     myProperties: async (): Promise<HouseBoarding[]> => {
//       const response = await api.get("house/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number): Promise<HouseBoarding> => {
//       const response = await api.get(`house/my_properties/${id}/`)
//       return response.data
//     },
//     updateMyProperty: async (id: number, data: Partial<HouseBoarding>) => {
//       const response = await api.patch(`house/my_properties/update/${id}/`, data)
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`house/my_properties/delete/${id}/`)
//       return response.data
//     },
//     count: async (): Promise<{ count: number }> => {
//       const response = await api.get("house/count/")
//       return response.data
//     },
//     create: async (
//       data: Omit<HouseBoarding, "id">,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

//       const response = await api.post("house/create/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         transformRequest: (data, headers) => {
//           delete headers["Content-Type"]
//           return data
//         },
//       })
//       return response.data
//     },
//     get: async (id: number): Promise<HouseBoarding> => {
//       const response = await api.get(`house/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: Partial<HouseBoarding>) => {
//       const response = await api.patch(`house/${id}/`, data)
//       return response.data
//     },
//     delete: async (id: number) => {
//       const response = await api.delete(`house/${id}/`)
//       return response.data
//     },
//     getPropertyTypes: async (): Promise<Record<string, string>> => {
//       const response = await api.get("house/property_types/")
//       return response.data
//     },
//   },

//   // Lodge/Hotel Properties
//   hotels: {
//     list: async (): Promise<LodgeHotelProperty[]> => {
//       const response = await api.get("hotels/")
//       return response.data
//     },
//     create: async (
//       data: Omit<LodgeHotelProperty, "id">,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

//       const response = await api.post("hotels/create/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         transformRequest: (data, headers) => {
//           delete headers["Content-Type"]
//           return data
//         },
//       })
//       return response.data
//     },
//     get: async (id: number): Promise<LodgeHotelProperty> => {
//       const response = await api.get(`hotels/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: Partial<LodgeHotelProperty>) => {
//       const response = await api.patch(`hotels/${id}/`, data)
//       return response.data
//     },
//     myProperties: async (): Promise<LodgeHotelProperty[]> => {
//       const response = await api.get("hotels/my-properties/")
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`hotels/delete/${id}/`)
//       return response.data
//     },
//     getPropertyTypes: async (): Promise<Record<string, string>> => {
//       const response = await api.get("hotels/property_types/")
//       return response.data
//     },
//   },
// }




import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://192.168.1.184:8000/api/test/v1/"

// Your existing interfaces remain the same...
interface BaseProperty {
  id?: number
  term_category: "SHORT" | "LONG"
  purpose: "RENT" | "BUY" | "RENT_BUY"
  rental_price?: number | string
  sale_price?: number | string
  price_negotiable: boolean
  property_type: "COMMERCIAL" | "LODGE_HOTEL" | "APARTMENT" | "HOUSE" | "BOARDING"
  title: string
  address: string
  description: string
  year_of_construction?: number
  security: boolean
  pet_friendly: boolean
  allow_smoking: boolean
  allow_kids: boolean
  photos?: PropertyPhoto[]
  videos?: PropertyVideo[]
  amenities?: Amenity[]
  nearby_infrastructure?: Infrastructure[]
  owner_proof?: string | null
  agent_certificate?: string | null
  is_agent: boolean
  owner?: number
  created_at?: string
  updated_at?: string
}

interface PropertyPhoto {
  id?: number
  image: string
  caption?: string
  is_primary: boolean
}

interface PropertyVideo {
  id?: number
  video: string
  caption?: string
}

interface Amenity {
  id?: number
  name: string
}

interface Infrastructure {
  id?: number
  name: string
}

// API Client
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // Increased timeout for file uploads
})

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      let token = (global as any).access_token
      if (!token) {
        token = await AsyncStorage.getItem("access_token")
        if (token) (global as any).access_token = token
      }
      // console.log("Sending request with token:", token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    } catch (error) {
      // console.error("Request interceptor error:", error)
      return Promise.reject(error)
    }
  },
  (error) => Promise.reject(error),
)

// Response interceptor with detailed error logging
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    })

    if (error.response?.data) {
      console.log("API Error Response:", error.response.data)

      // Log field-specific errors
      if (typeof error.response.data === "object") {
        console.log("Field errors:", error.response.data)
      }
    }

    return Promise.reject(error)
  },
)

// Helper function to get file extension and MIME type
const getFileInfo = (uri: string) => {
  const filename = uri.split("/").pop() || "file"
  const extension = filename.split(".").pop()?.toLowerCase() || "jpg"

  const mimeTypes: { [key: string]: string } = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }

  return {
    filename,
    mimeType: mimeTypes[extension] || "application/octet-stream",
  }
}

// Fixed FormData creation for React Native
const createPropertyFormData = (
  data: any,
  photos: string[],
  video?: string,
  ownershipPhoto?: string,
  certificatePhoto?: string,
) => {
  const formData = new FormData()

  // Add basic property fields (excluding file-related fields)
  Object.keys(data).forEach((key) => {
    if (["photos", "videos", "amenities", "nearby_infrastructure", "owner_proof", "agent_certificate"].includes(key)) {
      return // Skip these, handle separately
    }

    const value = data[key]
    if (value !== null && value !== undefined) {
      if (typeof value === "boolean") {
        formData.append(key, value.toString())
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value.toString())
      }
    }
  })

  // Add photos with proper React Native format
  photos.forEach((photoUri, index) => {
    const { filename, mimeType } = getFileInfo(photoUri)

    formData.append("photos", {
      uri: photoUri,
      type: mimeType,
      name: filename,
    } as any)

    // Add photo metadata
    formData.append(`photo_${index}_caption`, `Photo ${index + 1}`)
    formData.append(`photo_${index}_is_primary`, index === 0 ? "true" : "false")
  })

  // Add video if provided
  if (video) {
    const { filename, mimeType } = getFileInfo(video)

    formData.append("videos", {
      uri: video,
      type: mimeType,
      name: filename,
    } as any)

    formData.append("video_0_caption", "Property walkthrough")
  }

  // FIXED: Add ownership documents with proper file format
  if (ownershipPhoto) {
    const { filename, mimeType } = getFileInfo(ownershipPhoto)

    // Ensure the file object has all required properties
    const ownershipFile = {
      uri: ownershipPhoto,
      type: mimeType,
      name: filename,
    }

    console.log("Adding owner_proof file:", ownershipFile)
    formData.append("owner_proof", ownershipFile as any)
  }

  if (certificatePhoto) {
    const { filename, mimeType } = getFileInfo(certificatePhoto)

    const certificateFile = {
      uri: certificatePhoto,
      type: mimeType,
      name: filename,
    }

    console.log("Adding agent_certificate file:", certificateFile)
    formData.append("agent_certificate", certificateFile as any)
  }

  // Add amenities and infrastructure as JSON strings
  if (data.amenities && data.amenities.length > 0) {
    formData.append("amenities", JSON.stringify(data.amenities))
  }

  if (data.nearby_infrastructure && data.nearby_infrastructure.length > 0) {
    formData.append("nearby_infrastructure", JSON.stringify(data.nearby_infrastructure))
  }

  // Debug: Log FormData contents
  console.log("FormData contents:")
  if (formData._parts) {
    formData._parts.forEach(([key, value]) => {
      if (typeof value === "object" && value.uri) {
        console.log(`${key}:`, { uri: value.uri, type: value.type, name: value.name })
      } else {
        console.log(`${key}:`, value)
      }
    })
  }

  return formData
}

// Alternative fetch-based approach for better file handling
const createPropertyWithFetch = async (
  endpoint: string,
  data: any,
  photos: string[] = [],
  video?: string,
  ownershipPhoto?: string,
  certificatePhoto?: string,
) => {
  try {
    const token = (global as any).access_token || (await AsyncStorage.getItem("access_token"))

    if (!token) {
      throw new Error("No authentication token found")
    }

    const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

    console.log(`Making request to: ${BASE_URL}${endpoint}`)

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let fetch set it with proper boundary
      },
      body: formData,
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Fetch error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }

      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log("Success response:", result)
    return result
  } catch (error) {
    console.error("Fetch request failed:", error)
    throw error
  }
}

// Axios-based approach with better headers
const createPropertyWithAxios = async (
  endpoint: string,
  data: any,
  photos: string[] = [],
  video?: string,
  ownershipPhoto?: string,
  certificatePhoto?: string,
) => {
  try {
    const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Let axios handle the boundary
      },
      timeout: 120000, // 2 minutes for file uploads
      maxContentLength: Number.POSITIVE_INFINITY,
      maxBodyLength: Number.POSITIVE_INFINITY,
    })

    return response.data
  } catch (error) {
    console.error("Axios request failed:", error)
    throw error
  }
}

export const propertiesAPI = {
  // Your existing methods...
  filterProperties: async (params: any = {}): Promise<any> => {
    try {
      const response = await api.get("properties/filter/", { params })
      return response.data
    } catch (error) {
      console.error("Error filtering properties:", error)
      throw error
    }
  },

  getFilterOptions: async (): Promise<any> => {
    try {
      const response = await api.get("properties/filter/options/")
      return response.data
    } catch (error) {
      console.error("Error getting filter options:", error)
      throw error
    }
  },

  getPropertyCount: async (params: any = {}): Promise<any> => {
    try {
      const response = await api.get("properties/count/", { params })
      return response.data
    } catch (error) {
      console.error("Error getting property count:", error)
      throw error
    }
  },

    // Listing all properties
    listProperties: async (params: any = {}): Promise<any> => {
      try {
        const response = await api.get("properties/", { params })
        return response.data
      } catch (error) {
        console.error("Error listing properties:", error)
        throw error
      }
    }
  ,

  // Fixed commercial properties
  commercial: {
    list: async () => {
      const response = await api.get("commercial/")
      return response.data
    },

    create: async (
      data: any,
      photos: string[] = [],
      video?: string,
      ownershipPhoto?: string,
      certificatePhoto?: string,
    ) => {
      console.log("Creating commercial property with data:", {
        ...data,
        photosCount: photos.length,
        hasVideo: !!video,
        hasOwnershipPhoto: !!ownershipPhoto,
        hasCertificatePhoto: !!certificatePhoto,
      })

      // Try fetch first (often more reliable for file uploads)
      try {
        return await createPropertyWithFetch(
          "commercial/create/",
          data,
          photos,
          video,
          ownershipPhoto,
          certificatePhoto,
        )
      } catch (fetchError) {
        console.log("Fetch failed, trying axios:", fetchError)

        // Fallback to axios
        return await createPropertyWithAxios(
          "commercial/create/",
          data,
          photos,
          video,
          ownershipPhoto,
          certificatePhoto,
        )
      }
    },

    // Other methods remain the same...
    get: async (id: number) => {
      const response = await api.get(`commercial/${id}/`)
      return response.data
    },

    update: async (id: number, data: any) => {
      const response = await api.patch(`commercial/${id}/`, data)
      return response.data
    },

    delete: async (id: number) => {
      const response = await api.delete(`commercial/${id}/`)
      return response.data
    },

    myProperties: async () => {
      const response = await api.get("commercial/my_properties/")
      return response.data
    },

    getMyProperty: async (id: number) => {
      const response = await api.get(`commercial/my_properties/${id}/`)
      return response.data
    },

    updateMyProperty: async (id: number, data: any) => {
      const response = await api.patch(`commercial/my_properties/update/${id}/`, data)
      return response.data
    },

    deleteMyProperty: async (id: number) => {
      const response = await api.delete(`commercial/my_properties/delete/${id}/`)
      return response.data
    },

    count: async () => {
      const response = await api.get("commercial/count/")
      return response.data
    },

    getPropertyTypes: async () => {
      const response = await api.get("commercial/property_types/")
      return response.data
    },
  },

  // Apply the same fixes to other property types
  apartment: {
    list: async () => {
      const response = await api.get("apartment/")
      return response.data
    },

    create: async (
      data: any,
      photos: string[] = [],
      video?: string,
      ownershipPhoto?: string,
      certificatePhoto?: string,
    ) => {
      try {
        return await createPropertyWithFetch("apartment/create/", data, photos, video, ownershipPhoto, certificatePhoto)
      } catch (fetchError: any) {
        console.log("Fetch failed, trying axios:", fetchError)
        return await createPropertyWithAxios("apartment/create/", data, photos, video, ownershipPhoto, certificatePhoto)
      }
    },

    // ... other apartment methods
    get: async (id: number) => {
      const response = await api.get(`apartment/${id}/`)
      return response.data
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`apartment/${id}/`, data)
      return response.data
    },
    delete: async (id: number) => {
      const response = await api.delete(`apartment/${id}/`)
      return response.data
    },
    myProperties: async () => {
      const response = await api.get("apartment/my_properties/")
      return response.data
    },
    getMyProperty: async (id: number) => {
      const response = await api.get(`apartment/my_properties/${id}/`)
      return response.data
    },

  },

  house: {
    list: async () => {
      const response = await api.get("house/")
      return response.data
    },

    create: async (
      data: any,
      photos: string[] = [],
      video?: string,
      ownershipPhoto?: string,
      certificatePhoto?: string,
    ) => {
      try {
        return await createPropertyWithFetch("house/create/", data, photos, video, ownershipPhoto, certificatePhoto)
      } catch (fetchError) {
        console.log("Fetch failed, trying axios:", fetchError)
        return await createPropertyWithAxios("house/create/", data, photos, video, ownershipPhoto, certificatePhoto)
      }
    },

    // ... other house methods
    get: async (id: number) => {
      const response = await api.get(`house/${id}/`)
      return response.data  
    },

    update: async (id: number, data: any) => {
      const response = await api.patch(`house/${id}/`, data)
      return response.data
    },
    delete: async (id: number) => {
      const response = await api.delete(`house/${id}/`)
      return response.data
    },
    myProperties: async () => {
      const response = await api.get("house/my_properties/")
      return response.data
    },
    getMyProperty: async (id: number) => {
      const response = await api.get(`house/my_properties/${id}/`)
      return response.data
    },
    updateMyProperty: async (id: number, data: any) => {
      const response = await api.patch(`house/my_properties/update/${id}/`, data)
      return response.data
    },
    deleteMyProperty: async (id: number) => {
      const response = await api.delete(`house/my_properties/delete/${id}/`)
      return response.data
    },
    count: async () => {
      const response = await api.get("house/count/")
      return response.data
    },
    getPropertyTypes: async () => {
      const response = await api.get("house/property_types/")
      return response.data
    },

  },

  hotels: {
    list: async () => {
      const response = await api.get("hotels/")
      return response.data
    },

    create: async (
      data: any,
      photos: string[] = [],
      video?: string,
      ownershipPhoto?: string,
      certificatePhoto?: string,
    ) => {
      try {
        return await createPropertyWithFetch("hotels/", data, photos, video, ownershipPhoto, certificatePhoto)
      } catch (fetchError) {
        console.log("Fetch failed, trying axios:", fetchError)
        return await createPropertyWithAxios("hotels/create/", data, photos, video, ownershipPhoto, certificatePhoto)
      }
    },

    // ... other hotel methods
    get: async (id: number) => {
      const response = await api.get(`hotels/${id}/`)
      return response.data
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`hotels/${id}/`, data)
      return response.data
    },
    myProperties: async () => {
      const response = await api.get("hotels/my_properties/")
      return response.data
  },
    getMyProperty: async (id: number) => {
      const response = await api.get(`hotels/my_properties/${id}/`)
      return response.data
    },

    deleteMyProperty: async (id: number) => {
      const response = await api.delete(`hotels/delete/${id}/`)
      return response.data
    },

    getPropertyTypes: async () => {
      const response = await api.get("hotels/property_types/")
      return response.data
    },
  },
  }
