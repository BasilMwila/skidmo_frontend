import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import React from 'react';

export default function Messages() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to the conversation route
    router.replace('/conversation');
  }, [router]);

  return null; // Return null since we're redirecting
}