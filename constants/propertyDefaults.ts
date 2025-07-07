import type {
  ApartmentProperty,
  CommercialProperty,
  HouseProperty,
  LodgeHotelProperty,
  PropertyType,
} from "@/types/types"

export const getPropertyDefaults = (propertyType: PropertyType, userId: number) => {
  const baseDefaults = {
    term_category: propertyType === "HOUSE" || propertyType === "BOARDING" ? ("LONG" as const) : ("SHORT" as const),
    purpose: "RENT" as const,
    rental_price: undefined,
    sale_price: undefined,
    price_negotiable: false,
    title: "",
    address: "",
    price: 0,
    description: "",
    year_of_construction: undefined,
    security: false,
    pet_friendly: false,
    allow_smoking: false,
    allow_kids: false,
    photos: [],
    videos: [],
    owner: userId,
    owner_proof: undefined,
    agent_certificate: undefined,
    is_agent: false,
  }

  switch (propertyType) {
    case "COMMERCIAL":
      return {
        ...baseDefaults,
        property_type: "COMMERCIAL" as const,
        bathroom_count: 1 as const,
        has_balcony: false,
        has_patio: false,
        in_unit_laundry: false,
        pool: "NO" as const,
        garden: "NO" as const,
        amenities: [],
        nearby_infrastructure: [],
      } as Partial<CommercialProperty>

    case "LODGE_HOTEL":
      return {
        ...baseDefaults,
        property_type: "LODGE_HOTEL" as const,
        star_rating: undefined,
        room_type: "SINGLE" as const,
        room_count: 1,
        bed_type: "SINGLE" as const,
        view_type: "GARDEN" as const,
        has_balcony: false,
        has_patio: false,
        has_pool: false,
        meal_option: undefined,
        garden: "NO" as const,

        // Bathroom amenities
        bidet: false,
        bath: false,
        outdoor_shower: false,
        hot_water: false,
        hair_dryer: false,
        shower_gel: false,
        shampoo: false,
        conditioner: false,
        essentials: false,

        // Laundry
        washing_machine: false,
        drying_rack: false,
        clothes_storage: false,
        free_dryer: false,
        iron: false,
        hangers: false,
        bed_linen: false,
        cot: false,
        room_darkening_blinds: false,
        travel_cot: false,
        extra_pillows: false,
        mosquito_net: false,

        // Kitchen
        microwave: false,
        fridge: false,
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

        // Entertainment
        tv: false,
        wifi: false,

        // Heating/Cooling
        air_conditioner: false,
        ceiling_fan: false,
        heating: false,
        portable_fans: false,

        // Safety
        smoke_alarm: false,
        carbon_monoxide_alarm: false,
        first_aid_kit: false,
        luggage_dropoff: false,
        lockbox: false,

        // Other amenities
        beach_essentials: false,
        self_checkin: false,
        spa: false,
        parking: false,
        fitness_center: false,
        bar: false,
        restaurant: false,
        kids_play_area: false,
        wheelchair_access: false,
        meeting_rooms: false,
        business_center: false,
        coworking_space: false,

        // Accessibility
        wheelchair: false,
        elevators: false,
      } as Partial<LodgeHotelProperty>

    case "APARTMENT":
      return {
        ...baseDefaults,
        property_type: "APARTMENT" as const,
        room_count: "1" as const,
        bedroom_count: 1 as const,
        bathroom_count: 1 as const,
        has_balcony: false,
        has_patio: false,
        has_pool: false,
        garden: "NO" as const,
        amenities: [],
        nearby_infrastructure: [],
      } as Partial<ApartmentProperty>

    case "HOUSE":
    case "BOARDING":
      return {
        ...baseDefaults,
        property_type: propertyType,
        is_boarding: propertyType === "BOARDING",
        bedroom_count: 1 as const,
        bathroom_count: 1 as const,
        has_balcony: false,
        has_patio: false,
        has_pool: false,
        garden: "NO" as const,
        amenities: [],
        nearby_infrastructure: [],
      } as Partial<HouseProperty>

    default:
      return baseDefaults
  }
}

export const PROPERTY_TYPE_LABELS = {
  COMMERCIAL: "Commercial",
  LODGE_HOTEL: "Lodge/Hotel",
  APARTMENT: "Apartment/Flat",
  HOUSE: "House",
  BOARDING: "Boarding House",
} as const

export const PURPOSE_LABELS = {
  RENT: "For Rent",
  BUY: "For Sale",
  RENT_BUY: "Rent or Buy",
} as const

export const TERM_CATEGORY_LABELS = {
  SHORT: "Short-term",
  LONG: "Long-term",
} as const
