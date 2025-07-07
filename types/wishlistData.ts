export interface Listing {
    id: number;
    property_type: string;
    purchase_type: string;
    title: string;
    description: string;
    price: string; // Note this is string in your API
    rating: number;
    images: string[] | null;
    more_images: string[] | null;
    address: string;
    number_of_rooms: number;
    number_of_bedrooms: number;
    number_of_bathrooms: number;
    balcony: boolean;
    patio: boolean;
    pool: string;
    garden: string;
    security: boolean;
    nearby_infrastructure: string;
    year_of_construction: number;
    contact: string;
    is_owner: boolean;
    is_agent: boolean;
    status: string;
    lister: number;
    amenities: string[];
    // Add other listing fields as needed
  }
  
  export interface WishlistItem {
    id: number;
    listing: {
      title: string;
      price: number;
      purchase_type: string;
      number_of_bedrooms: number;
      number_of_bathrooms: number;
      address: string;
      images?: string[];
    };
    guest_count: number;
    start_date: string;
    end_date: string;
  }
  
  // Response type for API calls
  export interface WishlistResponse {
    data: WishlistItem[];
    count?: number;
    total?: number;
    page?: number;
    limit?: number;
  }
  
  // Parameters for fetching wishlist
  export interface WishlistParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  // Payload for adding to wishlist
  export interface AddToWishlistPayload {
    listingId: number; // Changed from productId to listingId
  }
  
  // Payload for removing from wishlist
  export interface RemoveFromWishlistPayload {
    wishlistItemId: number; // Changed from string to number
  }