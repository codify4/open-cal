import { useState, useEffect } from 'react';
import { getCurrentRateLimit, updateRateLimit } from '@/lib/rate-limit';

export function useRateLimit() {
  const [messagesLeft, setMessagesLeft] = useState(10);
  const [isLimited, setIsLimited] = useState(false);

  useEffect(() => {
    const { messagesLeft: current, isLimited: limited } = getCurrentRateLimit();
    setMessagesLeft(current);
    setIsLimited(limited);
  }, []);

  const sendMessage = () => {
    const { messagesLeft: remaining, isLimited: limited } = updateRateLimit();
    setMessagesLeft(remaining);
    setIsLimited(limited);
    return { messagesLeft: remaining, isLimited: limited };
  };

  const refreshRateLimit = () => {
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