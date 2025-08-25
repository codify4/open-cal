import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import {
  getCurrentProRateLimit,
  getCurrentRateLimit,
  updateProRateLimit,
  updateRateLimit,
} from '@/lib/rate-limit';

export function useRateLimit() {
  const [messagesLeft, setMessagesLeft] = useState(10);
  const [isLimited, setIsLimited] = useState(false);
  const currentUser = useQuery(api.auth.getCurrentUser, {});

  useEffect(() => {
    if (currentUser?.isPro) {
      setMessagesLeft(999);
      setIsLimited(false);
    } else {
      const { messagesLeft: current, isLimited: limited } =
        getCurrentRateLimit();
      setMessagesLeft(current);
      setIsLimited(limited);
    }
  }, [currentUser?.isPro]);

  const sendMessage = () => {
    if (currentUser?.isPro) {
      return { messagesLeft: 999, isLimited: false };
    }
    const { messagesLeft: remaining, isLimited: limited } = updateRateLimit();
    setMessagesLeft(remaining);
    setIsLimited(limited);
    return { messagesLeft: remaining, isLimited: limited };
  };

  const refreshRateLimit = () => {
    if (currentUser?.isPro) {
      setMessagesLeft(999);
      setIsLimited(false);
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
