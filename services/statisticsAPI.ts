// services/statisticsAPI.ts

// IMPORTANT: Replace this with your actual backend API base URL
// For example: "http://192.168.1.100:8000/api/analytics" if running locally
// or "https://your-backend-domain.com/api/analytics" for production
import { API_CONFIG } from '../config/apiConfig';

// Then replace the hardcoded BASE_URL with:
const BASE_URL = API_CONFIG.BASE_URL;

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

export const statisticsAPI = {
  getOverviewStats: async (): Promise<OverviewStats> => {
    try {
      const response = await fetch(`${BASE_URL}/overview/`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch overview statistics")
      }
      const data: OverviewStats = await response.json()
      return data
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
      const response = await fetch(`${BASE_URL}/revenue-trend/`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch revenue trend")
      }
      const data: TrendData[] = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching revenue trend:", error)
      return []
    }
  },

  getUserGrowth: async (): Promise<TrendData[]> => {
    try {
      const response = await fetch(`${BASE_URL}/user-growth/`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch user growth")
      }
      const data: TrendData[] = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching user growth:", error)
      return []
    }
  },
}
