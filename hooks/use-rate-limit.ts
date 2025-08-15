import { useState, useEffect } from 'react';
import { getCurrentRateLimit, updateRateLimit, getCurrentProRateLimit, updateProRateLimit } from '@/lib/rate-limit';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';

export function useRateLimit() {
  const [messagesLeft, setMessagesLeft] = useState(10);
  const [isLimited, setIsLimited] = useState(false);
  const { user } = useUser();
  const currentUser = useQuery(api.auth.getCurrentUser, {});

  useEffect(() => {
    if (currentUser?.isPro) {
      const { messagesLeft: current, isLimited: limited } = getCurrentProRateLimit();
      setMessagesLeft(current);
      setIsLimited(limited);
    } else {
      const { messagesLeft: current, isLimited: limited } = getCurrentRateLimit();
      setMessagesLeft(current);
      setIsLimited(limited);
    }
  }, [currentUser?.isPro]);

  const sendMessage = () => {
    if (currentUser?.isPro) {
      const { messagesLeft: remaining, isLimited: limited } = updateProRateLimit();
      setMessagesLeft(remaining);
      setIsLimited(limited);
      return { messagesLeft: remaining, isLimited: limited };
    }
    const { messagesLeft: remaining, isLimited: limited } = updateRateLimit();
    setMessagesLeft(remaining);
    setIsLimited(limited);
    return { messagesLeft: remaining, isLimited: limited };
  };

  const refreshRateLimit = () => {
    if (currentUser?.isPro) {
      const { messagesLeft: current, isLimited: limited } = getCurrentProRateLimit();
      setMessagesLeft(current);
      setIsLimited(limited);
      return;
    }
    const { messagesLeft: current, isLimited: limited } = getCurrentRateLimit();
    setMessagesLeft(current);
    setIsLimited(limited);
  };

  return {
    messagesLeft,
    isLimited,
    sendMessage,
    refreshRateLimit,
  };
} 