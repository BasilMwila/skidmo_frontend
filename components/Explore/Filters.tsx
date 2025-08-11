
// "use client"
// import { propertiesAPI } from "@/services/propertiesApi"
// import { Ionicons } from "@expo/vector-icons"
// import { useNavigation, useRouter } from "expo-router"
// import { useEffect, useState } from "react"
// import {
//   ActivityIndicator,
//   Alert,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native"
// import DateTimePicker from "@react-native-community/datetimepicker" // Import DateTimePicker

// // FilterCountDisplay component is not part of FilterScreen, so no changes here.
// const FilterCountDisplay = ({ filters }) => {
//   const [counts, setCounts] = useState<{ [key: string]: number }>({})
//   const [loading, setLoading] = useState(false)

//   const updateCounts = async () => {
//     setLoading(true)
//     try {
//       const newCounts: { [key: string]: number } = {}
//       // Get total count without filters
//       const totalResponse = await propertiesAPI.filterProperties({
//         count_only: true,
//       })
//       newCounts["All Properties"] = totalResponse.count || 0

//       // Get counts for each active filter
//       for (const [key, value] of Object.entries(filters)) {
//         if (value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
//           const response = await propertiesAPI.filterProperties({
//             [key]: value,
//             count_only: true,
//           })
//           newCounts[key] = response.count || 0
//         }
//       }
//       setCounts(newCounts)
//     } catch (error) {
//       console.error("Error fetching counts:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     updateCounts()
//   }, [filters])

//   return (
//     <View style={styles.countContainer}>
//       {loading ? (
//         <ActivityIndicator size="small" />
//       ) : (
//         <>
//           {Object.entries(counts).map(([filterName, count]) => (
//             <View key={filterName} style={styles.countItem}>
//               <Text style={styles.countLabel}>{filterName}:</Text>
//               <Text style={styles.countValue}>{count}</Text>
//             </View>
//           ))}
//         </>
//       )}
//     </View>
//   )
// }

// // Add onApply and onClose props for modal functionality
// export default function FilterScreen({ onApply, onClose }) {
//   const router = useRouter()
//   const [filterOptions, setFilterOptions] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [filterCount, setFilterCount] = useState<number | null>(null)
//   const [isLoadingCount, setIsLoadingCount] = useState(false)
//   const navigation = useNavigation()

//   // State for date pickers
//   const [checkInDate, setCheckInDate] = useState<Date | null>(null)
//   const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
//   const [showCheckInPicker, setShowCheckInPicker] = useState(false)
//   const [showCheckOutPicker, setShowCheckOutPicker] = useState(false)

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     })
//   }, [])

//   // State for all filter options
//   const [filters, setFilters] = useState({
//     search: "",
//     property_type: "",
//     purchase_type: "rent",
//     rental_type: "long_term", // long_term or short_term
//     min_price: null,
//     max_price: null,
//     min_square_feet: null,
//     max_square_feet: null,
//     number_of_rooms: null,
//     min_bedrooms: null,
//     min_bathrooms: null,
//     has_pool: null,
//     has_garden: null,
//     security: null,
//     balcony: null,
//     patio: null,
//     amenities: [],
//     garden_sub_filters: [],
//     bathroom_and_laundry: [],
//     kitchen_and_dining: [],
//     entertainment: [],
//     heating_and_cooling: [],
//     home_and_safety: [],
//     accessibility: [],
//     other_amenities: [],
//     nearby_infrastructure: [],
//     status: "available",
//     is_owner: null,
//     is_agent: null,
//     only_with_photo: true,
//     only_with_video: null,
//     online_tour: null,
//     pet_friendly: null,
//     allows_kids: null,
//     allows_smoking: null,
//     in_unit_laundry: null,
//     year_from: null,
//     year_to: null,
//     check_in_date: null, // New filter state for check-in date (ISO string)
//     check_out_date: null, // New filter state for check-out date (ISO string)
//   })

//   // Load filter options on mount
//   useEffect(() => {
//     const loadFilterOptions = async () => {
//       try {
//         const options = await propertiesAPI.getFilterOptions()
//         setFilterOptions(options)
//         setLoading(false)
//       } catch (error) {
//         console.error("Failed to load filter options:", error)
//         setLoading(false)
//       }
//     }
//     loadFilterOptions()
//   }, [])

//   // Helper to format date for display
//   const formatDate = (date: Date | null) => {
//     if (!date) return ""
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     })
//   }

//   // Handlers for date picker changes
//   const onCheckInDateChange = (event: any, selectedDate?: Date) => {
//     setShowCheckInPicker(false)
//     if (selectedDate) {
//       setCheckInDate(selectedDate)
//       updateFilter("check_in_date", selectedDate.toISOString()) // Store as ISO string
//     }
//   }

//   const onCheckOutDateChange = (event: any, selectedDate?: Date) => {
//     setShowCheckOutPicker(false)
//     if (selectedDate) {
//       setCheckOutDate(selectedDate)
//       updateFilter("check_out_date", selectedDate.toISOString()) // Store as ISO string
//     }
//   }

//   // Count properties matching current filters
//   const countFilteredProperties = async () => {
//     setIsLoadingCount(true)
//     try {
//       const cleanedFilters: any = {}
//       // Prepare filters
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)) {
//           // Convert boolean values to strings
//           cleanedFilters[key] = typeof value === "boolean" ? value.toString() : value
//         }
//       })
//       const response = await propertiesAPI.filterProperties({
//         ...cleanedFilters,
//         count_only: true,
//       })
//       setFilterCount(response.count)
//     } catch (error) {
//       console.error("Count Error:", error)
//       setFilterCount(null)
//     } finally {
//       setIsLoadingCount(false)
//     }
//   }

//   // Update count when filters change (with debounce)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       countFilteredProperties()
//     }, 500)
//     return () => clearTimeout(timer)
//   }, [filters])

//   useEffect(() => {
//     console.log("Current filters state:", filters)
//   }, [filters])

//   // Handle applying filters
//   const applyFilters = async () => {
//     try {
//       const cleanedFilters: any = {}
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
//           cleanedFilters[key] = typeof value === "boolean" ? value.toString() : value
//         }
//       })
//       const response = await propertiesAPI.filterProperties(cleanedFilters)
//       // Use the onApply prop to pass filtered properties back to the parent
//       onApply(response.properties)
//     } catch (error) {
//       console.error("Failed to apply filters:", error)
//       Alert.alert("Error", "Failed to apply filters. Please try again.")
//     }
//   }

//   // Handle save settings
//   const saveSettings = () => {
//     // Implement save settings logic here
//     Alert.alert("Settings Saved", "Your filter settings have been saved.")
//   }

//   // Update specific filter
//   const updateFilter = (key: string, value: any) => {
//     console.log(`Filter changed - ${key}:`, value)
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }))
//   }

//   // Toggle array-based filters
//   const toggleArrayFilter = (key: string, item: string) => {
//     console.log(`Toggling array filter - ${key}:`, item)
//     setFilters((prev) => {
//       const currentArray = prev[key] || []
//       const newArray = currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item]
//       console.log(`New ${key} array:`, newArray)
//       return {
//         ...prev,
//         [key]: newArray,
//       }
//     })
//   }

//   // Render option buttons
//   const renderOptions = (options: any[], selectedOption: any, onSelect: (value: any) => void, style = {}) => {
//     return options.map((option, index) => (
//       <TouchableOpacity
//         key={index}
//         style={[styles.optionButton, selectedOption === option && styles.selectedOption, style]}
//         onPress={() => {
//           console.log("Selected option:", option)
//           onSelect(option)
//         }}
//       >
//         <Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>{option}</Text>
//       </TouchableOpacity>
//     ))
//   }

//   // Render checkbox
//   const renderCheckbox = (selected: boolean, onToggle: (value: boolean) => void, label: string) => (
//     <TouchableOpacity style={styles.checkboxRow} onPress={() => onToggle(!selected)}>
//       <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
//         {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
//       </View>
//       <Text style={styles.checkboxLabel}>{label}</Text>
//     </TouchableOpacity>
//   )

//   // Render property types
//   const renderPropertyTypes = () => {
//     const propertyTypes = [
//       { value: "house", label: "House" },
//       { value: "boarding_house", label: "Boarding house" },
//       { value: "hotel_room", label: "Hotel room" },
//       { value: "apartment", label: "Apartment/flat" },
//       { value: "lodge", label: "Lodge" },
//       { value: "commercial", label: "Commercial" },
//     ]
//     return propertyTypes.map((type) => (
//       <TouchableOpacity
//         key={type.value}
//         style={[styles.propertyTypeButton, filters.property_type === type.value && styles.selectedPropertyType]}
//         onPress={() => updateFilter("property_type", type.value)}
//       >
//         <Text
//           style={[styles.propertyTypeText, filters.property_type === type.value && styles.selectedPropertyTypeText]}
//         >
//           {type.label}
//         </Text>
//       </TouchableOpacity>
//     ))
//   }

//   // Render amenities
//   const renderAmenities = (amenities: string[], filterKey: string) => {
//     return amenities.map((amenity: string) => (
//       <TouchableOpacity
//         key={amenity}
//         style={[styles.amenityButton, filters[filterKey].includes(amenity) && styles.selectedAmenity]}
//         onPress={() => toggleArrayFilter(filterKey, amenity)}
//       >
//         <Text style={[styles.amenityText, filters[filterKey].includes(amenity) && styles.selectedAmenityText]}>
//           {amenity}
//         </Text>
//       </TouchableOpacity>
//     ))
//   }

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={onClose}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Filter</Text>
//         <TouchableOpacity
//           onPress={() =>
//             setFilters({
//               search: "",
//               property_type: "",
//               purchase_type: "rent",
//               rental_type: "long_term",
//               min_price: null,
//               max_price: null,
//               min_square_feet: null,
//               max_square_feet: null,
//               number_of_rooms: null,
//               min_bedrooms: null,
//               min_bathrooms: null,
//               has_pool: null,
//               has_garden: null,
//               security: null,
//               balcony: null,
//               patio: null,
//               amenities: [],
//               garden_sub_filters: [],
//               bathroom_and_laundry: [],
//               kitchen_and_dining: [],
//               entertainment: [],
//               heating_and_cooling: [],
//               home_and_safety: [],
//               accessibility: [],
//               other_amenities: [],
//               nearby_infrastructure: [],
//               status: "available",
//               is_owner: null,
//               is_agent: null,
//               only_with_photo: true,
//               only_with_video: null,
//               online_tour: null,
//               pet_friendly: null,
//               allows_kids: null,
//               allows_smoking: null,
//               in_unit_laundry: null,
//               year_from: null,
//               year_to: null,
//               check_in_date: null, // Reset new date filters
//               check_out_date: null, // Reset new date filters
//             })
//           }
//         >
//           <Text style={styles.clearButton}>Clear</Text>
//         </TouchableOpacity>
//       </View>
//       <ScrollView style={styles.scrollView}>
//         {/* Rent/Buy Toggle */}
//         <View style={styles.toggleContainer}>
//           <TouchableOpacity
//             style={[
//               styles.toggleButton,
//               filters.purchase_type === "rent" && styles.toggleButtonActive,
//               { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
//             ]}
//             onPress={() => updateFilter("purchase_type", "rent")}
//           >
//             <Text style={[styles.toggleText, filters.purchase_type === "rent" && styles.toggleTextActive]}>Rent</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.toggleButton,
//               filters.purchase_type === "sale" && styles.toggleButtonActive,
//               { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
//             ]}
//             onPress={() => updateFilter("purchase_type", "sale")}
//           >
//             <Text style={[styles.toggleText, filters.purchase_type === "sale" && styles.toggleTextActive]}>Buy</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Property Type */}
//         <View style={styles.propertyTypeContainer}>{renderPropertyTypes()}</View>

//         {/* Long-term/Short-term Toggle */}
//         <View style={styles.rentalTypeContainer}>
//           <TouchableOpacity
//             style={[styles.rentalTypeButton, filters.rental_type === "long_term" && styles.rentalTypeButtonActive]}
//             onPress={() => updateFilter("rental_type", "long_term")}
//           >
//             <Text style={[styles.rentalTypeText, filters.rental_type === "long_term" && styles.rentalTypeTextActive]}>
//               Long-term
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.rentalTypeButton, filters.rental_type === "short_term" && styles.rentalTypeButtonActive]}
//             onPress={() => updateFilter("rental_type", "short_term")}
//           >
//             <Text style={[styles.rentalTypeText, filters.rental_type === "short_term" && styles.rentalTypeTextActive]}>
//               Short-term
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Check-in/Check-out Date Pickers (conditionally rendered) */}
//         {filters.rental_type === "short_term" && (
//           <View style={styles.datePickerContainer}>
//             <TouchableOpacity style={styles.dateInputWrapper} onPress={() => setShowCheckInPicker(true)}>
//               <Text style={checkInDate ? styles.dateInputText : styles.dateInputPlaceholder}>
//                 {checkInDate ? formatDate(checkInDate) : "Check in"}
//               </Text>
//               <Ionicons name="calendar-outline" size={20} color="#666" />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.dateInputWrapper} onPress={() => setShowCheckOutPicker(true)}>
//               <Text style={checkOutDate ? styles.dateInputText : styles.dateInputPlaceholder}>
//                 {checkOutDate ? formatDate(checkOutDate) : "Check out"}
//               </Text>
//               <Ionicons name="calendar-outline" size={20} color="#666" />
//             </TouchableOpacity>
//           </View>
//         )}

//         {showCheckInPicker && (
//           <DateTimePicker
//             value={checkInDate || new Date()}
//             mode="date"
//             display="default"
//             onChange={onCheckInDateChange}
//           />
//         )}
//         {showCheckOutPicker && (
//           <DateTimePicker
//             value={checkOutDate || new Date()}
//             mode="date"
//             display="default"
//             onChange={onCheckOutDateChange}
//           />
//         )}

//         {/* Location */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Location</Text>
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="City"
//               value={filters.search}
//               onChangeText={(text) => updateFilter("search", text)}
//             />
//             {filters.search.length > 0 && (
//               <TouchableOpacity onPress={() => updateFilter("search", "")}>
//                 <Ionicons name="close" size={20} color="#999" />
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={styles.locationSuggestion}>
//             <Text style={styles.suggestionText}>Compound, street, house №</Text>
//           </View>
//         </View>

//         {/* Price */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Price</Text>
//           <View style={styles.priceContainer}>
//             <View style={styles.priceInput}>
//               <TextInput
//                 placeholder="From, ZMW"
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateFilter("min_price", text ? Number.parseFloat(text) : null)}
//               />
//             </View>
//             <View style={styles.priceInput}>
//               <TextInput
//                 placeholder="To, ZMW"
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateFilter("max_price", text ? Number.parseFloat(text) : null)}
//               />
//             </View>
//           </View>
//           {/* Media options */}
//           {renderCheckbox(
//             filters.only_with_photo,
//             (value) => updateFilter("only_with_photo", value),
//             "Only with photo",
//           )}
//           {renderCheckbox(
//             filters.only_with_video === true,
//             (value) => updateFilter("only_with_video", value),
//             "Only with video",
//           )}
//           {renderCheckbox(filters.online_tour === true, (value) => updateFilter("online_tour", value), "Online tour")}
//         </View>

//         {/* Listed by */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Listed by</Text>
//           {renderCheckbox(filters.is_owner === true, (value) => updateFilter("is_owner", value), "Only owner")}
//           {renderCheckbox(filters.is_agent === true, (value) => updateFilter("is_agent", value), "Only agent")}
//         </View>

//         {/* Property */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Property</Text>
//           {/* Square feet */}
//           <Text style={styles.subSectionTitle}>Square feet</Text>
//           <View style={styles.priceContainer}>
//             <View style={styles.priceInput}>
//               <TextInput
//                 placeholder="From, m2"
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateFilter("min_square_feet", text ? Number.parseFloat(text) : null)}
//               />
//             </View>
//             <View style={styles.priceInput}>
//               <TextInput
//                 placeholder="To, m2"
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateFilter("max_square_feet", text ? Number.parseFloat(text) : null)}
//               />
//             </View>
//           </View>
//           {/* Number of rooms */}
//           <Text style={styles.subSectionTitle}>Number of rooms</Text>
//           <View style={styles.optionsWrap}>
//             {["Studio apartment", "1", "2", "3", "4", "5+"].map((option) => (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.optionButton,
//                   styles.roomOption,
//                   filters.number_of_rooms === option && styles.selectedOption,
//                 ]}
//                 onPress={() => updateFilter("number_of_rooms", option)}
//               >
//                 <Text style={[styles.optionText, filters.number_of_rooms === option && styles.selectedOptionText]}>
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {/* Number of bedrooms */}
//           <Text style={styles.subSectionTitle}>Number of bedrooms</Text>
//           <View style={styles.optionsWrap}>
//             {["1", "2", "3", "4", "5", "6", "7+"].map((option) => (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.optionButton,
//                   styles.smallOption,
//                   filters.min_bedrooms === Number.parseInt(option) && styles.selectedOption,
//                 ]}
//                 onPress={() => updateFilter("min_bedrooms", Number.parseInt(option))}
//               >
//                 <Text
//                   style={[
//                     styles.optionText,
//                     filters.min_bedrooms === Number.parseInt(option) && styles.selectedOptionText,
//                   ]}
//                 >
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {/* Number of bathrooms */}
//           <Text style={styles.subSectionTitle}>Number of bathrooms</Text>
//           <View style={styles.optionsWrap}>
//             {["Self contained", "1", "2", "3", "4", "5+"].map((option) => (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.optionButton,
//                   styles.bathroomOption,
//                   filters.min_bathrooms === option && styles.selectedOption,
//                 ]}
//                 onPress={() => updateFilter("min_bathrooms", option)}
//               >
//                 <Text style={[styles.optionText, filters.min_bathrooms === option && styles.selectedOptionText]}>
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           {/* Balcony */}
//           <Text style={styles.subSectionTitle}>Balcony</Text>
//           <View style={styles.optionsWrap}>
//             {renderOptions(
//               ["Yes", "No"],
//               filters.balcony,
//               (value) => updateFilter("balcony", value === "Yes"),
//               styles.mediumOption,
//             )}
//           </View>
//           {/* Patio */}
//           <Text style={styles.subSectionTitle}>Patio</Text>
//           <View style={styles.optionsWrap}>
//             {renderOptions(
//               ["Yes", "No"],
//               filters.patio,
//               (value) => updateFilter("patio", value === "Yes"),
//               styles.mediumOption,
//             )}
//           </View>
//           {/* Pool */}
//           <Text style={styles.subSectionTitle}>Pool</Text>
//           <View style={styles.optionsWrap}>
//             {renderOptions(
//               ["Private", "Common", "No"],
//               filters.has_pool,
//               (value) => updateFilter("has_pool", value === "No" ? false : value),
//               styles.mediumOption,
//             )}
//           </View>
//           {/* Garden */}
//           <Text style={styles.subSectionTitle}>Garden</Text>
//           <View style={styles.optionsWrap}>
//             {renderOptions(
//               ["Private", "Common", "No"],
//               filters.has_garden,
//               (value) => updateFilter("has_garden", value === "No" ? false : value),
//               styles.mediumOption,
//             )}
//           </View>
//           {/* Additional checkboxes */}
//           {renderCheckbox(
//             filters.pet_friendly === true,
//             (value) => updateFilter("pet_friendly", value),
//             "Pet friendly",
//           )}
//           {renderCheckbox(filters.allows_kids === true, (value) => updateFilter("allows_kids", value), "Allows kids")}
//           {renderCheckbox(
//             filters.allows_smoking === true,
//             (value) => updateFilter("allows_smoking", value),
//             "Allows smoking",
//           )}
//           {renderCheckbox(
//             filters.in_unit_laundry === true,
//             (value) => updateFilter("in_unit_laundry", value),
//             "In-unit laundry",
//           )}
//         </View>

//         {/* Amenities */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Amenities</Text>
//           <Text style={styles.subSectionTitle}>Other amenities</Text>
//           <View style={styles.amenitiesContainer}>
//             {renderAmenities(
//               [
//                 "TV",
//                 "Wi-Fi",
//                 "Washing machine",
//                 "Microwave",
//                 "Fridge",
//                 "Dryer",
//                 "Cooking basics",
//                 "Kitchen",
//                 "Dishes and cutlery",
//                 "Wardrobes",
//                 "Hangers",
//                 "Bidet",
//                 "Hot water",
//                 "Shower gel",
//                 "Essentials",
//                 "Bed linen",
//                 "Room-darkening blinds",
//                 "Cot",
//                 "Travel cot",
//                 "Air conditioner",
//                 "Ceiling fan",
//                 "Portable fans",
//                 "Beach essentials",
//                 "Exterior security cameras on property",
//                 "Smoke alarm",
//                 "Carbon monoxide alarm",
//                 "Parking space",
//                 "Self check-in",
//                 "Luggage drop-off allowed",
//               ],
//               "other_amenities",
//             )}
//           </View>
//         </View>

//         {/* Additional */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Additional</Text>
//           {/* Year of construction */}
//           <Text style={styles.subSectionTitle}>Year of construction</Text>
//           <View style={styles.priceContainer}>
//             <View style={styles.priceInput}>
//               <TextInput
//                 placeholder="From"
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateFilter("year_from", text ? Number.parseInt(text) : null)}
//               />
//             </View>
//             <View style={styles.priceInput}>
//               <TextInput
//                 placeholder="To"
//                 keyboardType="numeric"
//                 onChangeText={(text) => updateFilter("year_to", text ? Number.parseInt(text) : null)}
//               />
//             </View>
//           </View>
//           {/* Security */}
//           <Text style={styles.subSectionTitle}>Security</Text>
//           <View style={styles.optionsWrap}>
//             {renderOptions(
//               ["Yes", "No"],
//               filters.security,
//               (value) => updateFilter("security", value === "Yes"),
//               styles.mediumOption,
//             )}
//           </View>
//           {/* Near-by Infrastructure */}
//           <Text style={styles.subSectionTitle}>Near-by Infrastructure</Text>
//           <View style={styles.amenitiesContainer}>
//             {renderAmenities(
//               ["School", "Park", "Hospital", "Clinic", "Shopping mall", "Gym", "Police station"],
//               "nearby_infrastructure",
//             )}
//           </View>
//         </View>

//         {/* Save settings button */}
//         <TouchableOpacity style={styles.saveSettingsButton} onPress={saveSettings}>
//           <Text style={styles.saveSettingsText}>Save settings</Text>
//         </TouchableOpacity>

//         {/* Show listings button */}
//         <TouchableOpacity
//           style={[styles.showListingsButton, (isLoadingCount || filterCount === 0) && styles.disabledButton]}
//           onPress={applyFilters}
//           disabled={isLoadingCount || filterCount === 0}
//         >
//           {isLoadingCount ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.showListingsText}>
//               {filterCount === 0
//                 ? "No Listings Match Filters"
//                 : `Show ${filterCount ?? 0} ${filterCount === 1 ? "listing" : "listings"}`}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   clearButton: {
//     color: "#4CD964",
//     fontSize: 16,
//   },
//   countContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   countItem: {
//     flexDirection: "row",
//     marginRight: 16,
//     marginBottom: 8,
//   },
//   countLabel: {
//     fontSize: 14,
//     color: "#666",
//     marginRight: 4,
//   },
//   countValue: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     overflow: "hidden",
//   },
//   toggleButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   toggleButtonActive: {
//     backgroundColor: "#ddd",
//   },
//   toggleText: {
//     color: "#999",
//     fontWeight: "500",
//   },
//   toggleTextActive: {
//     color: "#000",
//   },
//   propertyTypeContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 12,
//     marginTop: 16,
//   },
//   propertyTypeButton: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     margin: 4,
//     backgroundColor: "#fff",
//   },
//   selectedPropertyType: {
//     backgroundColor: "#4CD964",
//     borderColor: "#4CD964",
//   },
//   propertyTypeText: {
//     color: "#333",
//     fontSize: 14,
//   },
//   selectedPropertyTypeText: {
//     color: "#fff",
//   },
//   rentalTypeContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     marginTop: 16,
//     gap: 8,
//   },
//   rentalTypeButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: "#E8F5E8",
//     borderWidth: 1,
//     borderColor: "#E8F5E8",
//   },
//   rentalTypeButtonActive: {
//     backgroundColor: "#4CD964",
//     borderColor: "#4CD964",
//   },
//   rentalTypeText: {
//     color: "#4CD964",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   rentalTypeTextActive: {
//     color: "#fff",
//   },
//   // New styles for date pickers
//   datePickerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     marginTop: 16,
//     marginBottom: 16, // Add some space before the next section
//   },
//   dateInputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "48%", // Adjust width for two columns with space
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     backgroundColor: "#f5f5f5", // Light grey background
//   },
//   dateInputText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   dateInputPlaceholder: {
//     fontSize: 16,
//     color: "#999", // Placeholder color
//   },
//   optionsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginHorizontal: 12,
//     marginTop: 16,
//   },
//   optionButton: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     margin: 4,
//     backgroundColor: "#fff",
//   },
//   selectedOption: {
//     backgroundColor: "#4CD964",
//     borderColor: "#4CD964",
//   },
//   optionText: {
//     color: "#333",
//     fontSize: 14,
//   },
//   selectedOptionText: {
//     color: "#fff",
//   },
//   section: {
//     marginTop: 24,
//     paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//   },
//   subSectionTitle: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   locationSuggestion: {
//     marginTop: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//   },
//   suggestionText: {
//     color: "#999",
//   },
//   priceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   priceInput: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     backgroundColor: "#f5f5f5",
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 8,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     marginRight: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxSelected: {
//     backgroundColor: "#4CD964",
//     borderColor: "#4CD964",
//   },
//   checkboxLabel: {
//     fontSize: 16,
//   },
//   optionsWrap: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginHorizontal: -4,
//     marginBottom: 8,
//   },
//   smallOption: {
//     minWidth: 40,
//     paddingHorizontal: 8,
//   },
//   mediumOption: {
//     minWidth: 60,
//   },
//   roomOption: {
//     minWidth: 80,
//   },
//   bathroomOption: {
//     minWidth: 70,
//   },
//   amenitiesContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginHorizontal: -4,
//   },
//   amenityButton: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     margin: 4,
//     backgroundColor: "#fff",
//   },
//   selectedAmenity: {
//     backgroundColor: "#4CD964",
//     borderColor: "#4CD964",
//   },
//   amenityText: {
//     color: "#333",
//     fontSize: 14,
//   },
//   selectedAmenityText: {
//     color: "#fff",
//   },
//   saveSettingsButton: {
//     backgroundColor: "#E8F5E8",
//     borderRadius: 8,
//     paddingVertical: 16,
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginBottom: 16,
//     marginTop: 24,
//   },
//   saveSettingsText: {
//     color: "#4CD964",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   showListingsButton: {
//     backgroundColor: "#4CD964",
//     borderRadius: 8,
//     paddingVertical: 16,
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginBottom: 24,
//   },
//   disabledButton: {
//     backgroundColor: "#ccc",
//   },
//   showListingsText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// })



"use client"
import { propertiesAPI } from "@/services/propertiesApi"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
// Remove the old DateTimePicker import
// import DateTimePicker from "@react-native-community/datetimepicker"
import { DatePickerModal } from "react-native-paper-dates" // Import DatePickerModal

// FilterCountDisplay component is not part of FilterScreen, so no changes here.
const FilterCountDisplay = ({ filters }) => {
  const [counts, setCounts] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)

  const updateCounts = async () => {
    setLoading(true)
    try {
      const newCounts: { [key: string]: number } = {}
      // Get total count without filters
      const totalResponse = await propertiesAPI.filterProperties({
        count_only: true,
      })
      newCounts["All Properties"] = totalResponse.count || 0

      // Get counts for each active filter
      for (const [key, value] of Object.entries(filters)) {
        if (value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
          const response = await propertiesAPI.filterProperties({
            [key]: value,
            count_only: true,
          })
          newCounts[key] = response.count || 0
        }
      }
      setCounts(newCounts)
    } catch (error) {
      console.error("Error fetching counts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateCounts()
  }, [filters])

  return (
    <View style={styles.countContainer}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <>
          {Object.entries(counts).map(([filterName, count]) => (
            <View key={filterName} style={styles.countItem}>
              <Text style={styles.countLabel}>{filterName}:</Text>
              <Text style={styles.countValue}>{count}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  )
}

// Add onApply and onClose props for modal functionality
export default function FilterScreen({ onApply, onClose }) {
  const router = useRouter()
  const [filterOptions, setFilterOptions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filterCount, setFilterCount] = useState<number | null>(null)
  const [isLoadingCount, setIsLoadingCount] = useState(false)
  const navigation = useNavigation()

  // State for date selection
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [checkInVisible, setCheckInVisible] = useState(false) // State for DatePickerModal visibility
  const [checkOutVisible, setCheckOutVisible] = useState(false) // State for DatePickerModal visibility

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  // State for all filter options
  const [filters, setFilters] = useState({
    search: "",
    property_type: "",
    purchase_type: "rent",
    rental_type: "long_term", // long_term or short_term
    min_price: null,
    max_price: null,
    min_square_feet: null,
    max_square_feet: null,
    number_of_rooms: null,
    min_bedrooms: null,
    min_bathrooms: null,
    has_pool: null,
    has_garden: null,
    security: null,
    balcony: null,
    patio: null,
    amenities: [],
    garden_sub_filters: [],
    bathroom_and_laundry: [],
    kitchen_and_dining: [],
    entertainment: [],
    heating_and_cooling: [],
    home_and_safety: [],
    accessibility: [],
    other_amenities: [],
    nearby_infrastructure: [],
    status: "available",
    is_owner: null,
    is_agent: null,
    only_with_photo: true,
    only_with_video: null,
    online_tour: null,
    pet_friendly: null,
    allows_kids: null,
    allows_smoking: null,
    in_unit_laundry: null,
    year_from: null,
    year_to: null,
    check_in_date: null, // New filter state for check-in date (ISO string)
    check_out_date: null, // New filter state for check-out date (ISO string)
  })

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await propertiesAPI.getFilterOptions()
        setFilterOptions(options)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load filter options:", error)
        setLoading(false)
      }
    }
    loadFilterOptions()
  }, [])

  // Helper to format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // Handlers for DatePickerModal changes
  const onCheckInDateChange = (params: { date: Date }) => {
    setCheckInVisible(false)
    if (params.date) {
      setCheckInDate(params.date)
      updateFilter("check_in_date", params.date.toISOString()) // Store as ISO string
      // Set checkout date to 1 day after check-in if not set or before check-in
      if (!checkOutDate || checkOutDate <= params.date) {
        const nextDay = new Date(params.date)
        nextDay.setDate(nextDay.getDate() + 1)
        setCheckOutDate(nextDay)
        updateFilter("check_out_date", nextDay.toISOString())
      }
    }
  }

  const onCheckOutDateChange = (params: { date: Date }) => {
    setCheckOutVisible(false)
    if (params.date) {
      setCheckOutDate(params.date)
      updateFilter("check_out_date", params.date.toISOString()) // Store as ISO string
    }
  }

  // Count properties matching current filters
  const countFilteredProperties = async () => {
    setIsLoadingCount(true)
    try {
      const cleanedFilters: any = {}
      // Prepare filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0)) {
          // Convert boolean values to strings
          cleanedFilters[key] = typeof value === "boolean" ? value.toString() : value
        }
      })
      const response = await propertiesAPI.filterProperties({
        ...cleanedFilters,
        count_only: true,
      })
      setFilterCount(response.count)
    } catch (error) {
      console.error("Count Error:", error)
      setFilterCount(null)
    } finally {
      setIsLoadingCount(false)
    }
  }

  // Update count when filters change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      countFilteredProperties()
    }, 500)
    return () => clearTimeout(timer)
  }, [filters])

  useEffect(() => {
    console.log("Current filters state:", filters)
  }, [filters])

  // Handle applying filters
  const applyFilters = async () => {
    try {
      const cleanedFilters: any = {}
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== "" && !(Array.isArray(value) && value.length === 0)) {
          cleanedFilters[key] = typeof value === "boolean" ? value.toString() : value
        }
      })
      const response = await propertiesAPI.filterProperties(cleanedFilters)
      // Use the onApply prop to pass filtered properties back to the parent
      onApply(response.properties)
    } catch (error) {
      console.error("Failed to apply filters:", error)
      Alert.alert("Error", "Failed to apply filters. Please try again.")
    }
  }

  // Handle save settings
  const saveSettings = () => {
    // Implement save settings logic here
    Alert.alert("Settings Saved", "Your filter settings have been saved.")
  }

  // Update specific filter
  const updateFilter = (key: string, value: any) => {
    console.log(`Filter changed - ${key}:`, value)
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Toggle array-based filters
  const toggleArrayFilter = (key: string, item: string) => {
    console.log(`Toggling array filter - ${key}:`, item)
    setFilters((prev) => {
      const currentArray = prev[key] || []
      const newArray = currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item]
      console.log(`New ${key} array:`, newArray)
      return {
        ...prev,
        [key]: newArray,
      }
    })
  }

  // Render option buttons
  const renderOptions = (options: any[], selectedOption: any, onSelect: (value: any) => void, style = {}) => {
    return options.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.optionButton, selectedOption === option && styles.selectedOption, style]}
        onPress={() => {
          console.log("Selected option:", option)
          onSelect(option)
        }}
      >
        <Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>{option}</Text>
      </TouchableOpacity>
    ))
  }

  // Render checkbox
  const renderCheckbox = (selected: boolean, onToggle: (value: boolean) => void, label: string) => (
    <TouchableOpacity style={styles.checkboxRow} onPress={() => onToggle(!selected)}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  )

  // Render property types
  const renderPropertyTypes = () => {
    const propertyTypes = [
      { value: "house", label: "House" },
      { value: "boarding_house", label: "Boarding house" },
      { value: "hotel_room", label: "Hotel room" },
      { value: "apartment", label: "Apartment/flat" },
      { value: "lodge", label: "Lodge" },
      { value: "commercial", label: "Commercial" },
    ]
    return propertyTypes.map((type) => (
      <TouchableOpacity
        key={type.value}
        style={[styles.propertyTypeButton, filters.property_type === type.value && styles.selectedPropertyType]}
        onPress={() => updateFilter("property_type", type.value)}
      >
        <Text
          style={[styles.propertyTypeText, filters.property_type === type.value && styles.selectedPropertyTypeText]}
        >
          {type.label}
        </Text>
      </TouchableOpacity>
    ))
  }

  // Render amenities
  const renderAmenities = (amenities: string[], filterKey: string) => {
    return amenities.map((amenity: string) => (
      <TouchableOpacity
        key={amenity}
        style={[styles.amenityButton, filters[filterKey].includes(amenity) && styles.selectedAmenity]}
        onPress={() => toggleArrayFilter(filterKey, amenity)}
      >
        <Text style={[styles.amenityText, filters[filterKey].includes(amenity) && styles.selectedAmenityText]}>
          {amenity}
        </Text>
      </TouchableOpacity>
    ))
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity
          onPress={() => {
            setFilters({
              search: "",
              property_type: "",
              purchase_type: "rent",
              rental_type: "long_term",
              min_price: null,
              max_price: null,
              min_square_feet: null,
              max_square_feet: null,
              number_of_rooms: null,
              min_bedrooms: null,
              min_bathrooms: null,
              has_pool: null,
              has_garden: null,
              security: null,
              balcony: null,
              patio: null,
              amenities: [],
              garden_sub_filters: [],
              bathroom_and_laundry: [],
              kitchen_and_dining: [],
              entertainment: [],
              heating_and_cooling: [],
              home_and_safety: [],
              accessibility: [],
              other_amenities: [],
              nearby_infrastructure: [],
              status: "available",
              is_owner: null,
              is_agent: null,
              only_with_photo: true,
              only_with_video: null,
              online_tour: null,
              pet_friendly: null,
              allows_kids: null,
              allows_smoking: null,
              in_unit_laundry: null,
              year_from: null,
              year_to: null,
              check_in_date: null, // Reset new date filters
              check_out_date: null, // Reset new date filters
            })
            setCheckInDate(null) // Reset local date states
            setCheckOutDate(null) // Reset local date states
          }}
        >
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Rent/Buy Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              filters.purchase_type === "rent" && styles.toggleButtonActive,
              { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
            ]}
            onPress={() => updateFilter("purchase_type", "rent")}
          >
            <Text style={[styles.toggleText, filters.purchase_type === "rent" && styles.toggleTextActive]}>Rent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              filters.purchase_type === "sale" && styles.toggleButtonActive,
              { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
            ]}
            onPress={() => updateFilter("purchase_type", "sale")}
          >
            <Text style={[styles.toggleText, filters.purchase_type === "sale" && styles.toggleTextActive]}>Buy</Text>
          </TouchableOpacity>
        </View>

        {/* Property Type */}
        <View style={styles.propertyTypeContainer}>{renderPropertyTypes()}</View>

        {/* Long-term/Short-term Toggle */}
        <View style={styles.rentalTypeContainer}>
          <TouchableOpacity
            style={[styles.rentalTypeButton, filters.rental_type === "long_term" && styles.rentalTypeButtonActive]}
            onPress={() => updateFilter("rental_type", "long_term")}
          >
            <Text style={[styles.rentalTypeText, filters.rental_type === "long_term" && styles.rentalTypeTextActive]}>
              Long-term
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rentalTypeButton, filters.rental_type === "short_term" && styles.rentalTypeButtonActive]}
            onPress={() => updateFilter("rental_type", "short_term")}
          >
            <Text style={[styles.rentalTypeText, filters.rental_type === "short_term" && styles.rentalTypeTextActive]}>
              Short-term
            </Text>
          </TouchableOpacity>
        </View>

        {/* Check-in/Check-out Date Pickers (conditionally rendered) */}
        {filters.rental_type === "short_term" && (
          <View style={styles.datePickerContainer}>
            <TouchableOpacity style={styles.dateInputWrapper} onPress={() => setCheckInVisible(true)}>
              <Text style={checkInDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                {checkInDate ? formatDate(checkInDate) : "Check in"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateInputWrapper} onPress={() => setCheckOutVisible(true)}>
              <Text style={checkOutDate ? styles.dateInputText : styles.dateInputPlaceholder}>
                {checkOutDate ? formatDate(checkOutDate) : "Check out"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="City"
              value={filters.search}
              onChangeText={(text) => updateFilter("search", text)}
            />
            {filters.search.length > 0 && (
              <TouchableOpacity onPress={() => updateFilter("search", "")}>
                <Ionicons name="close" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.locationSuggestion}>
            <Text style={styles.suggestionText}>Compound, street, house №</Text>
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceInput}>
              <TextInput
                placeholder="From, ZMW"
                keyboardType="numeric"
                onChangeText={(text) => updateFilter("min_price", text ? Number.parseFloat(text) : null)}
              />
            </View>
            <View style={styles.priceInput}>
              <TextInput
                placeholder="To, ZMW"
                keyboardType="numeric"
                onChangeText={(text) => updateFilter("max_price", text ? Number.parseFloat(text) : null)}
              />
            </View>
          </View>
          {/* Media options */}
          {renderCheckbox(
            filters.only_with_photo,
            (value) => updateFilter("only_with_photo", value),
            "Only with photo",
          )}
          {renderCheckbox(
            filters.only_with_video === true,
            (value) => updateFilter("only_with_video", value),
            "Only with video",
          )}
          {renderCheckbox(filters.online_tour === true, (value) => updateFilter("online_tour", value), "Online tour")}
        </View>

        {/* Listed by */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listed by</Text>
          {renderCheckbox(filters.is_owner === true, (value) => updateFilter("is_owner", value), "Only owner")}
          {renderCheckbox(filters.is_agent === true, (value) => updateFilter("is_agent", value), "Only agent")}
        </View>

        {/* Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property</Text>
          {/* Square feet */}
          <Text style={styles.subSectionTitle}>Square feet</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceInput}>
              <TextInput
                placeholder="From, m2"
                keyboardType="numeric"
                onChangeText={(text) => updateFilter("min_square_feet", text ? Number.parseFloat(text) : null)}
              />
            </View>
            <View style={styles.priceInput}>
              <TextInput
                placeholder="To, m2"
                keyboardType="numeric"
                onChangeText={(text) => updateFilter("max_square_feet", text ? Number.parseFloat(text) : null)}
              />
            </View>
          </View>
          {/* Number of rooms */}
          <Text style={styles.subSectionTitle}>Number of rooms</Text>
          <View style={styles.optionsWrap}>
            {["Studio apartment", "1", "2", "3", "4", "5+"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  styles.roomOption,
                  filters.number_of_rooms === option && styles.selectedOption,
                ]}
                onPress={() => updateFilter("number_of_rooms", option)}
              >
                <Text style={[styles.optionText, filters.number_of_rooms === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Number of bedrooms */}
          <Text style={styles.subSectionTitle}>Number of bedrooms</Text>
          <View style={styles.optionsWrap}>
            {["1", "2", "3", "4", "5", "6", "7+"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  styles.smallOption,
                  filters.min_bedrooms === Number.parseInt(option) && styles.selectedOption,
                ]}
                onPress={() => updateFilter("min_bedrooms", Number.parseInt(option))}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.min_bedrooms === Number.parseInt(option) && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Number of bathrooms */}
          <Text style={styles.subSectionTitle}>Number of bathrooms</Text>
          <View style={styles.optionsWrap}>
            {["Self contained", "1", "2", "3", "4", "5+"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  styles.bathroomOption,
                  filters.min_bathrooms === option && styles.selectedOption,
                ]}
                onPress={() => updateFilter("min_bathrooms", option)}
              >
                <Text style={[styles.optionText, filters.min_bathrooms === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Balcony */}
          <Text style={styles.subSectionTitle}>Balcony</Text>
          <View style={styles.optionsWrap}>
            {renderOptions(
              ["Yes", "No"],
              filters.balcony,
              (value) => updateFilter("balcony", value === "Yes"),
              styles.mediumOption,
            )}
          </View>
          {/* Patio */}
          <Text style={styles.subSectionTitle}>Patio</Text>
          <View style={styles.optionsWrap}>
            {renderOptions(
              ["Yes", "No"],
              filters.patio,
              (value) => updateFilter("patio", value === "Yes"),
              styles.mediumOption,
            )}
          </View>
          {/* Pool */}
          <Text style={styles.subSectionTitle}>Pool</Text>
          <View style={styles.optionsWrap}>
            {renderOptions(
              ["Private", "Common", "No"],
              filters.has_pool,
              (value) => updateFilter("has_pool", value === "No" ? false : value),
              styles.mediumOption,
            )}
          </View>
          {/* Garden */}
          <Text style={styles.subSectionTitle}>Garden</Text>
          <View style={styles.optionsWrap}>
            {renderOptions(
              ["Private", "Common", "No"],
              filters.has_garden,
              (value) => updateFilter("has_garden", value === "No" ? false : value),
              styles.mediumOption,
            )}
          </View>
          {/* Additional checkboxes */}
          {renderCheckbox(
            filters.pet_friendly === true,
            (value) => updateFilter("pet_friendly", value),
            "Pet friendly",
          )}
          {renderCheckbox(filters.allows_kids === true, (value) => updateFilter("allows_kids", value), "Allows kids")}
          {renderCheckbox(
            filters.allows_smoking === true,
            (value) => updateFilter("allows_smoking", value),
            "Allows smoking",
          )}
          {renderCheckbox(
            filters.in_unit_laundry === true,
            (value) => updateFilter("in_unit_laundry", value),
            "In-unit laundry",
          )}
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <Text style={styles.subSectionTitle}>Other amenities</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(
              [
                "TV",
                "Wi-Fi",
                "Washing machine",
                "Microwave",
                "Fridge",
                "Dryer",
                "Cooking basics",
                "Kitchen",
                "Dishes and cutlery",
                "Wardrobes",
                "Hangers",
                "Bidet",
                "Hot water",
                "Shower gel",
                "Essentials",
                "Bed linen",
                "Room-darkening blinds",
                "Cot",
                "Travel cot",
                "Air conditioner",
                "Ceiling fan",
                "Portable fans",
                "Beach essentials",
                "Exterior security cameras on property",
                "Smoke alarm",
                "Carbon monoxide alarm",
                "Parking space",
                "Self check-in",
                "Luggage drop-off allowed",
              ],
              "other_amenities",
            )}
          </View>
        </View>

        {/* Additional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional</Text>
          {/* Year of construction */}
          <Text style={styles.subSectionTitle}>Year of construction</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceInput}>
              <TextInput
                placeholder="From"
                keyboardType="numeric"
                onChangeText={(text) => updateFilter("year_from", text ? Number.parseInt(text) : null)}
              />
            </View>
            <View style={styles.priceInput}>
              <TextInput
                placeholder="To"
                keyboardType="numeric"
                onChangeText={(text) => updateFilter("year_to", text ? Number.parseInt(text) : null)}
              />
            </View>
          </View>
          {/* Security */}
          <Text style={styles.subSectionTitle}>Security</Text>
          <View style={styles.optionsWrap}>
            {renderOptions(
              ["Yes", "No"],
              filters.security,
              (value) => updateFilter("security", value === "Yes"),
              styles.mediumOption,
            )}
          </View>
          {/* Near-by Infrastructure */}
          <Text style={styles.subSectionTitle}>Near-by Infrastructure</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(
              ["School", "Park", "Hospital", "Clinic", "Shopping mall", "Gym", "Police station"],
              "nearby_infrastructure",
            )}
          </View>
        </View>

        {/* Save settings button */}
        <TouchableOpacity style={styles.saveSettingsButton} onPress={saveSettings}>
          <Text style={styles.saveSettingsText}>Save settings</Text>
        </TouchableOpacity>

        {/* Show listings button */}
        <TouchableOpacity
          style={[styles.showListingsButton, (isLoadingCount || filterCount === 0) && styles.disabledButton]}
          onPress={applyFilters}
          disabled={isLoadingCount || filterCount === 0}
        >
          {isLoadingCount ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.showListingsText}>
              {filterCount === 0
                ? "No Listings Match Filters"
                : `Show ${filterCount ?? 0} ${filterCount === 1 ? "listing" : "listings"}`}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date Pickers */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={checkInVisible}
        onDismiss={() => setCheckInVisible(false)}
        date={checkInDate} // Pass the Date object directly
        onConfirm={onCheckInDateChange}
        label="Select check-in date"
        saveLabel="Save"
      />
      <DatePickerModal
        locale="en"
        mode="single"
        visible={checkOutVisible}
        onDismiss={() => setCheckOutVisible(false)}
        date={checkOutDate} // Pass the Date object directly
        onConfirm={onCheckOutDateChange}
        label="Select check-out date"
        saveLabel="Save"
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    color: "#4CD964",
    fontSize: 16,
  },
  countContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countItem: {
    flexDirection: "row",
    marginRight: 16,
    marginBottom: 8,
  },
  countLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  countValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  toggleButtonActive: {
    backgroundColor: "#ddd",
  },
  toggleText: {
    color: "#999",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#000",
  },
  propertyTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginTop: 16,
  },
  propertyTypeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    backgroundColor: "#fff",
  },
  selectedPropertyType: {
    backgroundColor: "#4CD964",
    borderColor: "#4CD964",
  },
  propertyTypeText: {
    color: "#333",
    fontSize: 14,
  },
  selectedPropertyTypeText: {
    color: "#fff",
  },
  rentalTypeContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  rentalTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E8F5E8",
    borderWidth: 1,
    borderColor: "#E8F5E8",
  },
  rentalTypeButtonActive: {
    backgroundColor: "#4CD964",
    borderColor: "#4CD964",
  },
  rentalTypeText: {
    color: "#4CD964",
    fontSize: 14,
    fontWeight: "500",
  },
  rentalTypeTextActive: {
    color: "#fff",
  },
  // New styles for date pickers
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16, // Add some space before the next section
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "48%", // Adjust width for two columns with space
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5", // Light grey background
  },
  dateInputText: {
    fontSize: 16,
    color: "#333",
  },
  dateInputPlaceholder: {
    fontSize: 16,
    color: "#999", // Placeholder color
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    marginTop: 16,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: "#fff",
  },
  selectedOption: {
    backgroundColor: "#4CD964",
    borderColor: "#4CD964",
  },
  optionText: {
    color: "#333",
    fontSize: 14,
  },
  selectedOptionText: {
    color: "#fff",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  locationSuggestion: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  suggestionText: {
    color: "#999",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceInput: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#4CD964",
    borderColor: "#4CD964",
  },
  checkboxLabel: {
    fontSize: 16,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 8,
  },
  smallOption: {
    minWidth: 40,
    paddingHorizontal: 8,
  },
  mediumOption: {
    minWidth: 60,
  },
  roomOption: {
    minWidth: 80,
  },
  bathroomOption: {
    minWidth: 70,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  amenityButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 4,
    backgroundColor: "#fff",
  },
  selectedAmenity: {
    backgroundColor: "#4CD964",
    borderColor: "#4CD964",
  },
  amenityText: {
    color: "#333",
    fontSize: 14,
  },
  selectedAmenityText: {
    color: "#fff",
  },
  saveSettingsButton: {
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 24,
  },
  saveSettingsText: {
    color: "#4CD964",
    fontSize: 16,
    fontWeight: "600",
  },
  showListingsButton: {
    backgroundColor: "#4CD964",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  showListingsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
