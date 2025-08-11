/* eslint-disable @typescript-eslint/no-unused-vars */

// import AsyncStorage from "@react-native-async-storage/async-storage"
// import axios from "axios"

// const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://3985f155a23a.ngrok-free.app/api/test/v1/"

// // Your existing interfaces remain the same...
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

// interface Amenity {
//   id?: number
//   name: string
// }

// interface Infrastructure {
//   id?: number
//   name: string
// }

// // API Client
// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 60000,
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
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//       return config
//     } catch (error) {
//       return Promise.reject(error)
//     }
//   },
//   (error) => Promise.reject(error),
// )

// // Response interceptor with detailed error logging
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.error("API Error:", {
//       message: error.message,
//       status: error.response?.status,
//       url: error.config?.url,
//       method: error.config?.method,
//     })
//     if (error.response?.data) {
//       console.log("API Error Response:", error.response.data)
//       if (typeof error.response.data === "object") {
//         console.log("Field errors:", error.response.data)
//       }
//     }
//     return Promise.reject(error)
//   },
// )

// // Helper function to get file extension and MIME type
// const getFileInfo = (uri: string) => {
//   const filename = uri.split("/").pop() || "file"
//   const extension = filename.split(".").pop()?.toLowerCase() || "jpg"
//   const mimeTypes: { [key: string]: string } = {
//     jpg: "image/jpeg",
//     jpeg: "image/jpeg",
//     png: "image/png",
//     gif: "image/gif",
//     webp: "image/webp",
//     mp4: "video/mp4",
//     mov: "video/quicktime",
//     avi: "video/x-msvideo",
//     pdf: "application/pdf",
//     doc: "application/msword",
//     docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   }

//   return {
//     filename,
//     mimeType: mimeTypes[extension] || "application/octet-stream",
//   }
// }

// // Fixed FormData creation for React Native
// const createPropertyFormData = (
//   data: any,
//   photos: string[],
//   video?: string,
//   ownershipPhoto?: string,
//   certificatePhoto?: string,
// ) => {
//   const formData = new FormData()

//   Object.keys(data).forEach((key) => {
//     if (["photos", "videos", "amenities", "nearby_infrastructure", "owner_proof", "agent_certificate"].includes(key)) {
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
// https://78295584ea48.ngrok-free.app
//   photos.forEach((photoUri, index) => {
//     const { filename, mimeType } = getFileInfo(photoUri)
//     formData.append("photos", {
//       uri: photoUri,
//       type: mimeType,
//       name: filename,
//     } as any)
//     formData.append(`photo_${index}_caption`, `Photo ${index + 1}`)
//     formData.append(`photo_${index}_is_primary`, index === 0 ? "true" : "false")
//   })

//   if (video) {
//     const { filename, mimeType } = getFileInfo(video)
//     formData.append("videos", {
//       uri: video,
//       type: mimeType,
//       name: filename,
//     } as any)
//     formData.append("video_0_caption", "Property walkthrough")
//   }

//   if (ownershipPhoto) {
//     const { filename, mimeType } = getFileInfo(ownershipPhoto)
//     const ownershipFile = {
//       uri: ownershipPhoto,
//       type: mimeType,
//       name: filename,
//     }
//     console.log("Adding owner_proof file:", ownershipFile)
//     formData.append("owner_proof", ownershipFile as any)
//   }

//   if (certificatePhoto) {
//     const { filename, mimeType } = getFileInfo(certificatePhoto)
//     const certificateFile = {
//       uri: certificatePhoto,
//       type: mimeType,
//       name: filename,
//     }
//     console.log("Adding agent_certificate file:", certificateFile)
//     formData.append("agent_certificate", certificateFile as any)
//   }

//   if (data.amenities && data.amenities.length > 0) {
//     formData.append("amenities", JSON.stringify(data.amenities))
//   }

//   if (data.nearby_infrastructure && data.nearby_infrastructure.length > 0) {
//     formData.append("nearby_infrastructure", JSON.stringify(data.nearby_infrastructure))
//   }

//   if ((formData as any)._parts) {
//     ;(formData as any)._parts.forEach(([key, value]: [any, any]) => {
//       if (typeof value === "object" && value.uri) {
//         console.log(`${key}:`, { uri: value.uri, type: value.type, name: value.name })
//       } else {
//         console.log(`${key}:`, value)
//       }
//     })
//   }

//   return formData
// }

// // Alternative fetch-based approach for better file handling
// const createPropertyWithFetch = async (
//   endpoint: string,
//   data: any,
//   photos: string[] = [],
//   video?: string,
//   ownershipPhoto?: string,
//   certificatePhoto?: string,
// ) => {
//   try {
//     const token = (global as any).access_token || (await AsyncStorage.getItem("access_token"))
//     if (!token) {
//       throw new Error("No authentication token found")
//     }

//     const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

//     console.log(`Making request to: ${BASE_URL}${endpoint}`)
//     const response = await fetch(`${BASE_URL}${endpoint}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     })

//     console.log("Response status:", response.status)
//     console.log("Response headers:", response.headers)

//     if (!response.ok) {
//       const errorText = await response.text()
//       console.error("Fetch error response:", errorText)
//       let errorData
//       try {
//         errorData = JSON.parse(errorText)
//       } catch {
//         errorData = { message: errorText }
//       }
//       throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`)
//     }

//     const result = await response.json()
//     console.log("Success response:", result)
//     return result
//   } catch (error) {
//     console.error("Fetch request failed:", error)
//     throw error
//   }
// }

// // Axios-based approach with better headers
// const createPropertyWithAxios = async (
//   endpoint: string,
//   data: any,
//   photos: string[] = [],
//   video?: string,
//   ownershipPhoto?: string,
//   certificatePhoto?: string,
// ) => {
//   try {
//     const formData = createPropertyFormData(data, photos, video, ownershipPhoto, certificatePhoto)

//     const response = await api.post(endpoint, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       timeout: 120000,
//       maxContentLength: Number.POSITIVE_INFINITY,
//       maxBodyLength: Number.POSITIVE_INFINITY,
//     })

//     return response.data
//   } catch (error) {
//     console.error("Axios request failed:", error)
//     throw error
//   }
// }

// export const propertiesAPI = {
//   // NEW: Use your CombinedPropertyFilterView
//   filterPropertiesCombined: async (params: any = {}): Promise<any> => {
//     try {
//       const response = await api.get("properties/filter/", { params })
//       return response.data // This should return { properties: [...], count: number }
//     } catch (error) {
//       console.error("Error filtering properties (combined):", error)
//       throw error
//     }
//   },

//   // Your existing methods...
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

//   listProperties: async (params: any = {}): Promise<any> => {
//     try {
//       const response = await api.get("properties/", { params })
//       return response.data
//     } catch (error) {
//       console.error("Error listing properties:", error)
//       throw error
//     }
//   },

//   // All your existing property type methods remain the same...
//   commercial: {
//     list: async () => {
//       const response = await api.get("commercial/")
//       return response.data
//     },
//     create: async (
//       data: any,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       console.log("Creating commercial property with data:", {
//         ...data,
//         photosCount: photos.length,
//         hasVideo: !!video,
//         hasOwnershipPhoto: !!ownershipPhoto,
//         hasCertificatePhoto: !!certificatePhoto,
//       })
//       try {
//         return await createPropertyWithFetch(
//           "commercial/create/",
//           data,
//           photos,
//           video,
//           ownershipPhoto,
//           certificatePhoto,
//         )
//       } catch (fetchError) {
//         console.log("Fetch failed, trying axios:", fetchError)
//         return await createPropertyWithAxios(
//           "commercial/create/",
//           data,
//           photos,
//           video,
//           ownershipPhoto,
//           certificatePhoto,
//         )
//       }
//     },
//     get: async (id: number) => {
//       const response = await api.get(`commercial/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: any) => {
//       const response = await api.patch(`commercial/${id}/`, data)
//       return response.data
//     },
//     delete: async (id: number) => {
//       const response = await api.delete(`commercial/${id}/`)
//       return response.data
//     },
//     myProperties: async () => {
//       const response = await api.get("commercial/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number) => {
//       const response = await api.get(`commercial/my_properties/${id}/`)
//       return response.data
//     },
//     updateMyProperty: async (id: number, data: any) => {
//       const response = await api.patch(`commercial/my_properties/update/${id}/`, data)
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`commercial/my_properties/delete/${id}/`)
//       return response.data
//     },
//     count: async () => {
//       const response = await api.get("commercial/count/")
//       return response.data
//     },
//     getPropertyTypes: async () => {
//       const response = await api.get("commercial/property_types/")
//       return response.data
//     },
//   },

//   apartment: {
//     list: async () => {
//       const response = await api.get("apartment/")
//       return response.data
//     },
//     create: async (
//       data: any,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       try {
//         return await createPropertyWithFetch("apartment/create/", data, photos, video, ownershipPhoto, certificatePhoto)
//       } catch (fetchError: any) {
//         console.log("Fetch failed, trying axios:", fetchError)
//         return await createPropertyWithAxios("apartment/create/", data, photos, video, ownershipPhoto, certificatePhoto)
//       }
//     },
//     get: async (id: number) => {
//       const response = await api.get(`apartment/retrieve/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: any) => {
//       const response = await api.patch(`apartment/${id}/`, data)
//       return response.data
//     },
//     delete: async (id: number) => {
//       const response = await api.delete(`apartment/${id}/`)
//       return response.data
//     },
//     myProperties: async () => {
//       const response = await api.get("apartment/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number) => {
//       const response = await api.get(`apartment/my_properties/${id}/`)
//       return response.data
//     },
//   },

//   house: {
//     list: async () => {
//       const response = await api.get("house/")
//       return response.data
//     },
//     create: async (
//       data: any,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       try {
//         return await createPropertyWithFetch("house/create/", data, photos, video, ownershipPhoto, certificatePhoto)
//       } catch (fetchError) {
//         console.log("Fetch failed, trying axios:", fetchError)
//         return await createPropertyWithAxios("house/create/", data, photos, video, ownershipPhoto, certificatePhoto)
//       }
//     },
//     get: async (id: number) => {
//       const response = await api.get(`house/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: any) => {
//       const response = await api.patch(`house/${id}/`, data)
//       return response.data
//     },
//     delete: async (id: number) => {
//       const response = await api.delete(`house/${id}/`)
//       return response.data
//     },
//     myProperties: async () => {
//       const response = await api.get("house/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number) => {
//       const response = await api.get(`house/my_properties/${id}/`)
//       return response.data
//     },
//     updateMyProperty: async (id: number, data: any) => {
//       const response = await api.patch(`house/my_properties/update/${id}/`, data)
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`house/my_properties/delete/${id}/`)
//       return response.data
//     },
//     count: async () => {
//       const response = await api.get("house/count/")
//       return response.data
//     },
//     getPropertyTypes: async () => {
//       const response = await api.get("house/property_types/")
//       return response.data
//     },
//   },

//   hotels: {
//     list: async () => {
//       const response = await api.get("hotels/")
//       return response.data
//     },
//     create: async (
//       data: any,
//       photos: string[] = [],
//       video?: string,
//       ownershipPhoto?: string,
//       certificatePhoto?: string,
//     ) => {
//       try {
//         return await createPropertyWithFetch("hotels/", data, photos, video, ownershipPhoto, certificatePhoto)
//       } catch (fetchError) {
//         console.log("Fetch failed, trying axios:", fetchError)
//         return await createPropertyWithAxios("hotels/create/", data, photos, video, ownershipPhoto, certificatePhoto)
//       }
//     },
//     get: async (id: number) => {
//       const response = await api.get(`hotels/${id}/`)
//       return response.data
//     },
//     update: async (id: number, data: any) => {
//       const response = await api.patch(`hotels/${id}/`, data)
//       return response.data
//     },
//     myProperties: async () => {
//       const response = await api.get("hotels/my_properties/")
//       return response.data
//     },
//     getMyProperty: async (id: number) => {
//       const response = await api.get(`hotels/my_properties/${id}/`)
//       return response.data
//     },
//     deleteMyProperty: async (id: number) => {
//       const response = await api.delete(`hotels/delete/${id}/`)
//       return response.data
//     },
//     getPropertyTypes: async () => {
//       const response = await api.get("hotels/property_types/")
//       return response.data
//     },
//   },

//   getProperty: async (id: number, type?: string) => {
//     if (type) {
//       switch (type.toLowerCase()) {
//         case "apartment":
//           return await propertiesAPI.apartment.get(id)
//         case "house":
//           return await propertiesAPI.house.get(id)
//         case "commercial":
//           return await propertiesAPI.commercial.get(id)
//         default:
//           throw new Error("Unknown property type")
//       }
//     } else {
//       try {
//         return await propertiesAPI.apartment.get(id)
//       } catch (e1) {
//         try {
//           return await propertiesAPI.house.get(id)
//         } catch (e2) {
//           try {
//             return await propertiesAPI.commercial.get(id)
//           } catch (e3) {
//             throw new Error("Property not found")
//           }
//         }
//       }
//     }
//   },

//   getPropertyDetails: async (id: string | number, type?: string) => {
//     const numericId = typeof id === "string" ? Number.parseInt(id) : id
//     return await propertiesAPI.getProperty(numericId, type)
//   },
// }



import { default as AsyncStorage, default as axios } from "axios";

import { API_CONFIG } from '../config/apiConfig';

// Then replace the hardcoded BASE_URL with:
const BASE_URL = API_CONFIG.BASE_URL;

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

// NEW: Interfaces for statistics data
export interface OverviewStats {
  total_properties: number
  active_users: number
  monthly_revenue: number
  platform_health: number // Score 0-100
}

export interface TrendData {
  month: string // ISO date string for the month start
  total?: number // For revenue
  count?: number // For users
}

// API Client
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
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
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    } catch (error) {
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
  return { filename, mimeType: mimeTypes[extension] || "application/octet-stream" }
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
  Object.keys(data).forEach((key) => {
    if (["photos", "videos", "amenities", "nearby_infrastructure", "owner_proof", "agent_certificate"].includes(key)) {
      return
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
  photos.forEach((photoUri, index) => {
    const { filename, mimeType } = getFileInfo(photoUri)
    formData.append("photos", {
      uri: photoUri,
      type: mimeType,
      name: filename,
    } as any)
    formData.append(`photo_${index}_caption`, `Photo ${index + 1}`)
    formData.append(`photo_${index}_is_primary`, index === 0 ? "true" : "false")
  })
  if (video) {
    const { filename, mimeType } = getFileInfo(video)
    formData.append("videos", {
      uri: video,
      type: mimeType,
      name: filename,
    } as any)
    formData.append("video_0_caption", "Property walkthrough")
  }
  if (ownershipPhoto) {
    const { filename, mimeType } = getFileInfo(ownershipPhoto)
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
  if (data.amenities && data.amenities.length > 0) {
    formData.append("amenities", JSON.stringify(data.amenities))
  }
  if (data.nearby_infrastructure && data.nearby_infrastructure.length > 0) {
    formData.append("nearby_infrastructure", JSON.stringify(data.nearby_infrastructure))
  }
  if ((formData as any)._parts) {
    ;(formData as any)._parts.forEach(([key, value]: [any, any]) => {
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
      },
      timeout: 120000,
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
  // NEW: Use your CombinedPropertyFilterView
  filterPropertiesCombined: async (params: any = {}): Promise<any> => {
    try {
      const response = await api.get("properties/filter/", { params })
      return response.data // This should return { properties: [...], count: number }
    } catch (error) {
      console.error("Error filtering properties (combined):", error)
      throw error
    }
  },
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
  listProperties: async (params: any = {}): Promise<any> => {
    try {
      const response = await api.get("properties/", { params })
      return response.data
    } catch (error) {
      console.error("Error listing properties:", error)
      throw error
    }
  },
  // All your existing property type methods remain the same...
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
    get: async (id: number) => {
      const response = await api.get(`apartment/retrieve/${id}/`)
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
  getProperty: async (id: number, type?: string) => {
    if (type) {
      switch (type.toLowerCase()) {
        case "apartment":
          return await propertiesAPI.apartment.get(id)
        case "house":
          return await propertiesAPI.house.get(id)
        case "commercial":
          return await propertiesAPI.commercial.get(id)
        default:
          throw new Error("Unknown property type")
      }
    } else {
      try {
        return await propertiesAPI.apartment.get(id)
      } catch (e1) {
        try {
          return await propertiesAPI.house.get(id)
        } catch (e2) {
          try {
            return await propertiesAPI.commercial.get(id)
          } catch (e3) {
            throw new Error("Property not found")
          }
        }
      }
    }
  },
  getPropertyDetails: async (id: string | number, type?: string) => {
    const numericId = typeof id === "string" ? Number.parseInt(id) : id
    return await propertiesAPI.getProperty(numericId, type)
  },

  // NEW: Statistics API methods integrated
  statistics: {
    getOverviewStats: async (): Promise<OverviewStats> => {
      try {
        const response = await api.get("analytics/overview/")
        return response.data
      } catch (error) {
        console.error("Error fetching overview stats:", error)
        // Provide default/empty data on error to prevent app crash
        return {
          total_properties: 0,
          active_users: 0,
          monthly_revenue: 0,
          platform_health: 0,
        }
      }
    },

    getRevenueTrend: async (): Promise<TrendData[]> => {
      try {
        const response = await api.get("analytics/revenue-trend/")
        return response.data
      } catch (error) {
        console.error("Error fetching revenue trend:", error)
        return []
      }
    },

    getUserGrowth: async (): Promise<TrendData[]> => {
      try {
        const response = await api.get("analytics/user-growth/")
        return response.data
      } catch (error) {
        console.error("Error fetching user growth:", error)
        return []
      }
    },
  },
}
