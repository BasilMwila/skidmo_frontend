import { propertiesAPI } from '@/services/propertiesApi';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  View
} from 'react-native';


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

export default function FilterScreen() {
  const router = useRouter()
  const [filterOptions, setFilterOptions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filterCount, setFilterCount] = useState<number | null>(null)
  const [isLoadingCount, setIsLoadingCount] = useState(false)

  const navigation = useNavigation()

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
    min_price: null,
    max_price: null,
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
    status: "available",
    is_owner: null,
    is_agent: null,
    only_with_photo: true,
    pet_friendly: null,
    allows_kids: null,
    allows_smoking: null,
    in_unit_laundry: null,
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

  // Count properties matching current filters
  const countFilteredProperties = async () => {
  setIsLoadingCount(true);
  try {
    const cleanedFilters: any = {};
    
    // Prepare filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && 
          !(Array.isArray(value) && value.length === 0)) {
        // Convert boolean values to strings
        cleanedFilters[key] = typeof value === 'boolean' ? value.toString() : value;
      }
    });

    const response = await propertiesAPI.filterProperties({
      ...cleanedFilters,
      count_only: true
    });

    setFilterCount(response.count);
  } catch (error) {
    console.error('Count Error:', error);
    setFilterCount(null);
  } finally {
    setIsLoadingCount(false);
  }
};


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
    const cleanedFilters: any = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        cleanedFilters[key] = typeof value === 'boolean' ? value.toString() : value;
      }
    });

    const response = await propertiesAPI.filterProperties(cleanedFilters);
    router.navigate('Results', { properties: response.properties });
  } catch (error) {
    console.error('Failed to apply filters:', error);
    Alert.alert('Error', 'Failed to apply filters. Please try again.');
  }
};

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
    if (!filterOptions?.propertyTypes) return null

    return Object.entries(filterOptions.propertyTypes).map(([value, label]) => (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, filters.property_type === value && styles.selectedOption]}
        onPress={() => updateFilter("property_type", value)}
      >
        <Text style={[styles.optionText, filters.property_type === value && styles.selectedOptionText]}>{label}</Text>
      </TouchableOpacity>
    ))
  }

  // Render amenities
  const renderAmenities = (amenities: any[], filterKey: string) => {
    if (!amenities) return null

    return amenities.map((amenity: any) => (
      <TouchableOpacity
        key={amenity.id}
        style={[styles.amenityButton, filters[filterKey].includes(amenity.name) && styles.selectedAmenity]}
        onPress={() => toggleArrayFilter(filterKey, amenity.name)}
      >
        <Text style={[styles.amenityText, filters[filterKey].includes(amenity.name) && styles.selectedAmenityText]}>
          {amenity.name}
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity
          onPress={() =>
            setFilters({
              search: "",
              property_type: "",
              purchase_type: "rent",
              min_price: null,
              max_price: null,
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
              status: "available",
              is_owner: null,
              is_agent: null,
              only_with_photo: true,
              pet_friendly: null,
              allows_kids: null,
              allows_smoking: null,
              in_unit_laundry: null,
            })
          }
        >
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Count Display */}
      <FilterCountDisplay filters={filters} />

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.optionsContainer}>{renderPropertyTypes()}</View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Location"
              value={filters.search}
              onChangeText={(text) => updateFilter("search", text)}
            />
            {filters.search.length > 0 && (
              <TouchableOpacity onPress={() => updateFilter("search", "")}>
                <Ionicons name="close-circle" size={20} color="#999" />
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

          {/* Only with photo */}
          {renderCheckbox(
            filters.only_with_photo,
            (value) => updateFilter("only_with_photo", value),
            "Only with photo",
          )}
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
            {["1", "2", "3", "4", "5+"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  styles.smallOption,
                  filters.min_bathrooms === Number.parseInt(option) && styles.selectedOption,
                ]}
                onPress={() => updateFilter("min_bathrooms", Number.parseInt(option))}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.min_bathrooms === Number.parseInt(option) && styles.selectedOptionText,
                  ]}
                >
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
          <Text style={styles.subSectionTitle}>Bathroom & Laundry</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(filterOptions?.bathroomAndLaundry, "bathroom_and_laundry")}
          </View>

          <Text style={styles.subSectionTitle}>Kitchen & Dining</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(filterOptions?.kitchenAndDining, "kitchen_and_dining")}
          </View>

          <Text style={styles.subSectionTitle}>Entertainment</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(filterOptions?.entertainment, "entertainment")}
          </View>

          <Text style={styles.subSectionTitle}>Heating & Cooling</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(filterOptions?.heatingAndCooling, "heating_and_cooling")}
          </View>

          <Text style={styles.subSectionTitle}>Home Safety</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(filterOptions?.homeAndSafety, "home_and_safety")}
          </View>

          <Text style={styles.subSectionTitle}>Accessibility</Text>
          <View style={styles.amenitiesContainer}>
            {renderAmenities(filterOptions?.accessibility, "accessibility")}
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.optionsWrap}>
            {renderOptions(
              ["Yes", "No"],
              filters.security,
              (value) => updateFilter("security", value === "Yes"),
              styles.mediumOption,
            )}
          </View>
        </View>

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
                : `Show ${filterCount} ${filterCount === 1 ? "Listing" : "Listings"}`}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#4CD964",
  },
  toggleText: {
    color: "#999",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#fff",
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
    borderWidth: 1,
    borderColor: "#ddd",
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
  showListingsButton: {
    backgroundColor: "#4CD964",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 24,
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
