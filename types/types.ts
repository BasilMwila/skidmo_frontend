// Property Types based on Django models
export type PropertyType = "COMMERCIAL" | "LODGE_HOTEL" | "APARTMENT" | "HOUSE" | "BOARDING"

export type TermCategory = "SHORT" | "LONG"
export type Purpose = "RENT" | "BUY" | "RENT_BUY"

// Base Property interface
export interface BaseProperty {
  id?: number
  term_category: TermCategory
  purpose: Purpose
  rental_price?: number
  sale_price?: number
  price_negotiable: boolean
  property_type: PropertyType
  title: string
  address: string
  description: string
  year_of_construction?: number
  security: boolean
  pet_friendly: boolean
  allow_smoking: boolean
  allow_kids: boolean
  photos: PropertyPhoto[]
  videos: PropertyVideo[]
  owner_proof?: string | null
  agent_certificate?: string | null
  is_agent: boolean
  created_at?: string
  updated_at?: string
}

// Property Photo interface
export interface PropertyPhoto {
  image: string
  caption?: string
  is_primary: boolean
}

// Property Video interface
export interface PropertyVideo {
  video: string
  caption?: string
}

// Amenity interface
export interface Amenity {
  name: string
}

// Infrastructure interface
export interface Infrastructure {
  name: string
}

// House/Boarding Property
export interface HouseProperty extends BaseProperty {
  property_type: "HOUSE" | "BOARDING"
  is_boarding: boolean
  bedroom_count: 1 | 2 | 3 | 4 | 5
  bathroom_count: 1 | 2 | 3 | 4 | 5
  has_balcony: boolean
  has_patio: boolean
  has_pool: boolean
  garden: "PRIVATE" | "COMMON" | "NO"
  amenities: Amenity[]
  nearby_infrastructure: Infrastructure[]
  owner: number
}

// Apartment Property
export interface ApartmentProperty extends BaseProperty {
  property_type: "APARTMENT"
  room_count: "STUDIO" | "1" | "2" | "3" | "4" | "5+"
  bedroom_count: 1 | 2 | 3 | 4 | 5
  bathroom_count: 1 | 2 | 3 | 4 | 5
  has_balcony: boolean
  has_patio: boolean
  has_pool: boolean
  garden: "PRIVATE" | "COMMON" | "NO"
  amenities: Amenity[]
  nearby_infrastructure: Infrastructure[]
  owner: number
}

// Lodge/Hotel Property
export interface LodgeHotelProperty extends BaseProperty {
  property_type: "LODGE_HOTEL"
  star_rating?: 1 | 2 | 3 | 4 | 5
  room_type: "SINGLE" | "DOUBLE" | "TWIN" | "SUITE" | "FAMILY" | "VILLA" | "BUNGALOW"
  room_count: number
  bed_type: "SINGLE" | "DOUBLE" | "KING" | "SOFA" | "BUNK"
  view_type: "SEA" | "GARDEN" | "CITY" | "MOUNTAIN"
  has_balcony: boolean
  has_patio: boolean
  has_pool: boolean
  meal_option?: "BREAKFAST" | "HALF_BOARD" | "FULL_BOARD" | "ALL_INCLUSIVE" | "SELF_CATERING"
  garden: "PRIVATE" | "COMMON" | "NO"
  owner: number

  // Bathroom amenities
  bidet: boolean
  bath: boolean
  outdoor_shower: boolean
  hot_water: boolean
  hair_dryer: boolean
  shower_gel: boolean
  shampoo: boolean
  conditioner: boolean
  essentials: boolean

  // Laundry
  washing_machine: boolean
  drying_rack: boolean
  clothes_storage: boolean
  free_dryer: boolean
  iron: boolean
  hangers: boolean
  bed_linen: boolean
  cot: boolean
  room_darkening_blinds: boolean
  travel_cot: boolean
  extra_pillows: boolean
  mosquito_net: boolean

  // Kitchen
  microwave: boolean
  fridge: boolean
  cooking_basics: boolean
  dishes: boolean
  dishwasher: boolean
  oven: boolean
  kettle: boolean
  coffee_maker: boolean
  toaster: boolean
  blender: boolean
  dining_table: boolean
  electric_cooker: boolean

  // Entertainment
  tv: boolean
  wifi: boolean

  // Heating/Cooling
  air_conditioner: boolean
  ceiling_fan: boolean
  heating: boolean
  portable_fans: boolean

  // Safety
  smoke_alarm: boolean
  carbon_monoxide_alarm: boolean
  first_aid_kit: boolean
  luggage_dropoff: boolean
  lockbox: boolean

  // Other amenities
  beach_essentials: boolean
  self_checkin: boolean
  spa: boolean
  parking: boolean
  fitness_center: boolean
  bar: boolean
  restaurant: boolean
  kids_play_area: boolean
  wheelchair_access: boolean
  meeting_rooms: boolean
  business_center: boolean
  coworking_space: boolean

  // Accessibility
  wheelchair: boolean
  elevators: boolean
}

// Commercial Property
export interface CommercialProperty extends BaseProperty {
  property_type: "COMMERCIAL"
  bathroom_count: 1 | 2 | 3 | 4 | 5
  has_balcony: boolean
  has_patio: boolean
  in_unit_laundry: boolean
  pool: "PRIVATE" | "COMMON" | "NO"
  garden: "PRIVATE" | "COMMON" | "NO"
  amenities: Amenity[]
  nearby_infrastructure: Infrastructure[]
  owner: number
}

// Union type for all property types
export type Property = HouseProperty | ApartmentProperty | LodgeHotelProperty | CommercialProperty

// API Response types
export interface PropertyListResponse {
  count: number
  next?: string
  previous?: string
  results: Property[]
}

export interface PropertyCreateResponse {
  id: number
  message: string
  property: Property
}

// Filter types
export interface PropertyFilters {
  property_type?: PropertyType
  term_category?: TermCategory
  purpose?: Purpose
  min_price?: number
  max_price?: number
  bedroom_count?: number
  bathroom_count?: number
  has_pool?: boolean
  pet_friendly?: boolean
  location?: string
}
