import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useRouter } from 'expo-router'

interface SearchButtonProps {
  onPress?: () => void;
  searchParams?: {
    term: string;
    checkIn?: string;
    checkOut?: string;
    // Add other filter parameters you need
  };
}

const SearchButton: React.FC<SearchButtonProps> = ({ onPress, searchParams }) => {
  const router = useRouter()

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
    
    // Navigate to search screen with parameters
    router.push({
      pathname: "/search/searchData",
      params: searchParams
    })
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Text style={styles.buttonText}>Search</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#22c55e",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
})

export default SearchButton