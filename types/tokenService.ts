// @/services/auth/tokenService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Tokens, DecodedToken } from './auth';

class TokenService {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  private static USER_ID_KEY = 'user_id';
  private static IS_VERIFIED_KEY = 'is_verified';

  static async storeTokens(tokens: Tokens): Promise<boolean> {
    try {
      const decoded: DecodedToken = jwtDecode(tokens.access);
      
      if (!decoded.user_id || !decoded.status_verification) {
        throw new Error("Invalid token payload");
      }

      await AsyncStorage.multiSet([
        [this.ACCESS_TOKEN_KEY, tokens.access],
        [this.REFRESH_TOKEN_KEY, tokens.refresh],
        [this.USER_ID_KEY, decoded.user_id],
        [this.IS_VERIFIED_KEY, (decoded.status_verification === "verified").toString()],
      ]);

      return true;
    } catch (error) {
      console.error('TokenService.storeTokens error:', error);
      return false;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      this.ACCESS_TOKEN_KEY,
      this.REFRESH_TOKEN_KEY,
      this.USER_ID_KEY,
      this.IS_VERIFIED_KEY,
    ]);
  }

  static async isTokenValid(): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.exp ? decoded.exp * 1000 > Date.now() : false;
    } catch {
      return false;
    }
  }
}

export default TokenService;