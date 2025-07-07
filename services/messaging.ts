import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://skidmo-core-system.onrender.com/api/test/v1/';

interface Message {
  id: number;
  text: string;
  created_at: string;
  is_read: boolean;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  attachments?: Array<{
    id: number;
    url: string;
    type: 'image' | 'video' | 'document';
  }>;
}

export interface Thread {
  id: number;
  created: string;
  updated: string;
  last_message: {
    id: number;
    text: string;
    created: string;
    read: boolean | null;
    sender: {
      id: number;
      name: string;
      avatar?: string;
    };
    thread: number;
  } | null;
  participants: Array<{
    id: number;
    name: string;
    avatar?: string;
  }>;
  unread_count: number;
  listing?: {
    id: number;
    title: string;
    price: number;
    image?: string;
  };
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const messagingService = {
  getMyThreads: async (): Promise<Thread[]> => {
    try {
      const response = await api.get('/users/my_threads/');
      const threads = Array.isArray(response.data) ? response.data : [];
      
      const resolvedThreads = await Promise.all(threads.map(async thread => {
        const currentUserId = await AsyncStorage.getItem('userId');
        const otherParticipant = thread.participants.find(
          p => p.id.toString() !== currentUserId
        ) || { id: 0, name: 'Unknown User' };
        
        return {
          ...thread,
          other_user: otherParticipant,
          created_at: thread.created,
          updated_at: thread.updated
        };
      }));
      return resolvedThreads;
    } catch (error) {
      console.error('Get threads error:', error);
      throw new Error('Failed to load threads');
    }
  },

  getThreadMessages: async (threadId: number): Promise<Message[]> => {
    try {
      const response = await api.get(`/threads/${threadId}/messages/`);
      return response.data?.results || response.data || [];
    } catch (error) {
      console.error('Get messages error:', error);
      throw new Error('Failed to load messages');
    }
  },

  sendMessage: async (threadId: number, text: string): Promise<Message> => {
    try {
      const response = await api.post('/messages/', { thread: threadId, text });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw new Error('Failed to send message');
    }
  },

  // NEW: Start conversation with listing owner
  startListingConversation: async (listingId: number, initialMessage?: string): Promise<Thread> => {
    try {
      const response = await api.post(`/listings/${listingId}/start_conversation/`, {
        initial_message: initialMessage
      });

      // Get the full thread details
      const threadResponse = await api.get(`/threads/${response.data.thread_id}/retrieve/`);
      return threadResponse.data;
    } catch (error) {
      console.error('Start conversation error:', error);
      throw new Error('Failed to start conversation');
    }
  },

  // NEW: Get or create thread with a specific user
  getOrCreateThread: async (userId: number): Promise<Thread> => {
    try {
      // First try to get existing thread
      const threadsResponse = await api.get('/users/my_threads/');
      const existingThread = threadsResponse.data.find((thread: Thread) => 
        thread.participants.some(p => p.id === userId)
      );

      if (existingThread) {
        return existingThread;
      }

      // If no existing thread, create a new one
      const response = await api.post('/threads/', {
        participants: [userId]
      });

      // Get the full thread details
      const threadResponse = await api.get(`/threads/${response.data.id}/`);
      return threadResponse.data;
    } catch (error) {
      console.error('Get or create thread error:', error);
      throw new Error('Failed to get or create thread');
    }
  },

  // NEW: Mark messages as read
  markMessagesAsRead: async (threadId: number): Promise<void> => {
    try {
      await api.post(`/messages/mark_read/`, { thread_id: threadId });
    } catch (error) {
      console.error('Mark messages as read error:', error);
      throw new Error('Failed to mark messages as read');
    }
  },

  // NEW: Get unread message count
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/messages/unread_count/');
      return response.data.unread_count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
};