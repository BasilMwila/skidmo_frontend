// @/services/auth/types.ts
export interface Tokens {
    access: string;
    refresh: string;
  }
  
  export interface UserData {
    id?: string;
    username: string;
    name: string;
    phone_number: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // ... other fields
  }
  
  export interface DecodedToken {
    user_id: string;
    status_verification: string;
    exp?: number;
    // ... other claims
  }