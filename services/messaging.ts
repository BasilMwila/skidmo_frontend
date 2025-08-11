/* eslint-disable import/no-named-as-default-member */
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { API_CONFIG } from '../config/apiConfig';

// Then replace the hardcoded BASE_URL with:
const BASE_URL = API_CONFIG.BASE_URL;

export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  status_verification: "verified" | "unverified" | "pending"
  profileImage?: string
}

export interface Message {
  id: number
  sender: number
  thread: number
  text: string
  created: string
  read: string | null
}

export interface Thread {
  id: number
  participants: number[]
  created: string
  updated: string
  title?: string
}

export interface MessageThread extends Thread {
  last_message?: {
    text: string
    timestamp: string
  }
  unread_count: number
}

export interface CreateMessageData {
  thread: number
  text: string
}

export interface CreateThreadData {
  participants: number[]
  title?: string
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    let token = (global as any).access_token
    if (!token) {
      token = await AsyncStorage.getItem("access_token")
      if (token) {
        ;(global as any).access_token = token
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const messagingAPI = {
  // Get all messages
  getMessages: async (): Promise<Message[]> => {
    try {
      const response = await api.get("messages/")
      return response.data.results || response.data
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw error
    }
  },

  // Create a new message with proper validation
  createMessage: async (messageData: CreateMessageData): Promise<Message> => {
    try {
      // Validate the data before sending
      if (!messageData.thread || !messageData.text?.trim()) {
        throw new Error("Thread ID and text are required")
      }

      const payload = {
        thread: Number(messageData.thread),
        text: messageData.text.trim(),
      }

      console.log("Sending message payload:", payload)

      const response = await api.post("messages/", payload)
      return response.data
    } catch (error) {
      console.error("Error creating message:", error)
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response data:", error.response.data)
        console.error("Response status:", error.response.status)
      }
      throw error
    }
  },

  // Get specific message
  getMessage: async (messageId: number): Promise<Message> => {
    try {
      const response = await api.get(`messages/${messageId}/retrieve/`)
      return response.data
    } catch (error) {
      console.error("Error fetching message:", error)
      throw error
    }
  },

  // Update message
  updateMessage: async (messageId: number, updateData: Partial<Message>): Promise<Message> => {
    try {
      const response = await api.patch(`messages/${messageId}/update/`, updateData)
      return response.data
    } catch (error) {
      console.error("Error updating message:", error)
      throw error
    }
  },

  // Delete message
  deleteMessage: async (messageId: number): Promise<void> => {
    try {
      await api.delete(`messages/${messageId}/delete/`)
    } catch (error) {
      console.error("Error deleting message:", error)
      throw error
    }
  },

  // Mark message as read
  markMessageAsRead: async (messageId: number): Promise<void> => {
    try {
      await api.post(`messages/${messageId}/mark_read/`)
    } catch (error) {
      console.error("Error marking message as read:", error)
      throw error
    }
  },

  // Get unread message count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get("messages/unread_count/")
      return response.data.unread_count || 0
    } catch (error) {
      console.error("Error fetching unread count:", error)
      return 0
    }
  },

  // Get all threads with optimized loading
  getThreads: async (): Promise<MessageThread[]> => {
    try {
      const response = await api.get("threads/")
      const threads = response.data.results || response.data

      // Transform threads to include message info with better error handling
      const threadsWithMessages = await Promise.allSettled(
        threads.map(async (thread: Thread) => {
          try {
            const messages = await messagingAPI.getThreadMessages(thread.id)
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
            const unreadCount = messages.filter((msg) => !msg.read).length

            return {
              ...thread,
              last_message: lastMessage
                ? {
                    text: lastMessage.text,
                    timestamp: lastMessage.created,
                  }
                : undefined,
              unread_count: unreadCount,
            }
          } catch (error) {
            console.error(`Error fetching messages for thread ${thread.id}:`, error)
            return {
              ...thread,
              unread_count: 0,
            }
          }
        }),
      )

      // Filter out failed promises and return successful ones
      return threadsWithMessages
        .filter((result): result is PromiseFulfilledResult<MessageThread> => result.status === "fulfilled")
        .map((result) => result.value)
    } catch (error) {
      console.error("Error fetching threads:", error)
      throw error
    }
  },

  // Get specific thread
  getThread: async (threadId: number): Promise<Thread> => {
    try {
      const response = await api.get(`threads/${threadId}/retrieve/`)
      return response.data
    } catch (error) {
      console.error("Error fetching thread:", error)
      throw error
    }
  },

  // Create a new thread with proper validation
  createThread: async (threadData: CreateThreadData): Promise<Thread> => {
    try {
      // Validate participants
      if (!threadData.participants || 
          threadData.participants.length < 2 || 
          threadData.participants.some(id => !id)
      ) {
        console.error("Invalid participants:", threadData.participants);
        throw new Error("At least two valid participant IDs are required");
      }

      console.log("Creating thread with data:", threadData);
      const response = await api.post("threads/", threadData);
      return response.data;
    } catch (error) {
      console.error("Error creating thread:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Response:", error.response.data);
      }
      throw error;
    }
  },
  // Get messages for a specific thread
  getThreadMessages: async (threadId: number): Promise<Message[]> => {
    try {
      const response = await api.get(`threads/${threadId}/messages/`)
      return response.data.results || response.data
    } catch (error) {
      console.error("Error fetching thread messages:", error)
      throw error
    }
  },

  // Create or get existing thread with a user
 createOrGetThread: async (currentUserId: number, otherUserId: number): Promise<Thread> => {
  try {
    if (!currentUserId || !otherUserId) {
      throw new Error("Both user IDs are required");
    }

    console.log("Creating or getting thread for participants:", currentUserId, otherUserId);

    // First, get all threads to check if one exists with these participants
    const threads = await messagingAPI.getThreads();

    // Look for existing thread with both participants
    const existingThread = threads.find((thread) => {
      const participants = thread.participants;
      return (
        participants.includes(currentUserId) &&
        participants.includes(otherUserId)
      );
    });

    if (existingThread) {
      console.log("Found existing thread:", existingThread.id);
      return existingThread;
    }

    // If no existing thread, create a new one
    console.log("Creating new thread for participants:", currentUserId, otherUserId);
    const newThread = await messagingAPI.createThread({
      participants: [currentUserId, otherUserId],
      title: `Chat between ${currentUserId} and ${otherUserId}` // Optional title
    });
    return newThread;
  } catch (error) {
    console.error("Error creating/getting thread:", error);
    throw new Error("Failed to create or get thread");
  }
},
  // Send a message to a thread
  sendMessage: async (threadId: number, text: string): Promise<Message> => {
    try {
      if (!threadId || !text?.trim()) {
        throw new Error("Thread ID and text are required")
      }

      return await messagingAPI.createMessage({
        thread: threadId,
        text: text.trim(),
      })
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  // Start conversation from property listing
  startListingConversation: async (ownerId: number, propertyId: number, propertyTitle?: string): Promise<Thread> => {
    try {
      if (!ownerId || typeof ownerId !== "number") {
        throw new Error("Valid owner ID is required")
      }

      console.log("Starting listing conversation with owner:", ownerId)

      // Create or get existing thread with the property owner
      const thread = await messagingAPI.createOrGetThread(ownerId, ownerId) // Assuming ownerId is the current user for this context

      // Send initial message about the property
      const initialMessage = propertyTitle
        ? `Hi! I'm interested in your property: ${propertyTitle}`
        : `Hi! I'm interested in your property listing.`

      await messagingAPI.sendMessage(thread.id, initialMessage)

      return thread
    } catch (error) {
      console.error("Error starting listing conversation:", error)
      throw error
    }
  },

  // Start conversation from buy/rent inquiry
  startPropertyInquiry: async (
    ownerId: number,
    propertyId: number,
    inquiryType: "buy" | "rent",
    propertyTitle?: string,
  ): Promise<Thread> => {
    try {
      if (!ownerId || typeof ownerId !== "number") {
        throw new Error("Valid owner ID is required")
      }

      console.log("Starting property inquiry with owner:", ownerId, "type:", inquiryType)

      // Create or get existing thread with the property owner
      const thread = await messagingAPI.createOrGetThread(ownerId, ownerId) // Assuming ownerId is the current user for this context

      // Send initial message based on inquiry type
      const action = inquiryType === "buy" ? "purchase" : "rent"
      const initialMessage = propertyTitle
        ? `Hi! I'm interested in ${inquiryType === "buy" ? "buying" : "renting"} your property: ${propertyTitle}`
        : `Hi! I'm interested in your property for ${action}.`

      await messagingAPI.sendMessage(thread.id, initialMessage)

      return thread
    } catch (error) {
      console.error("Error starting property inquiry:", error)
      throw error
    }
  },
}

// Legacy service for backward compatibility
export const messagingService = messagingAPI
