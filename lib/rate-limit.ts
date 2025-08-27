const RATE_LIMIT_KEY = 'digit_chat_rate_limit';
const MAX_MESSAGES = 5;
const RESET_INTERVAL = 24 * 60 * 60 * 1000;
const PRO_RATE_LIMIT_KEY = 'digit_chat_pro_rate_limit';
const PRO_MAX_PER_MINUTE = 1000;

interface RateLimitData {
  userId: string;
  messageCount: number;
  lastReset: number;
}

function generateUserId(): string {
  const existingId = localStorage.getItem('digit_user_id');
  if (existingId) return existingId;

  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('digit_user_id', newId);
  return newId;
}

function getRateLimitData(): RateLimitData {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) {
    return {
      userId: generateUserId(),
      messageCount: 0,
      lastReset: Date.now(),
    };
  }

  const data: RateLimitData = JSON.parse(stored);
  const now = Date.now();

  if (now - data.lastReset > RESET_INTERVAL) {
    return {
      userId: data.userId,
      messageCount: 0,
      lastReset: now,
    };
  }

  return data;
}

export function getCurrentRateLimit(): {
  messagesLeft: number;
  isLimited: boolean;
} {
  const data = getRateLimitData();
  const messagesLeft = Math.max(0, MAX_MESSAGES - data.messageCount);
  const isLimited = messagesLeft === 0;

  return { messagesLeft, isLimited };
}

export function updateRateLimit(): {
  messagesLeft: number;
  isLimited: boolean;
} {
  const data = getRateLimitData();
  const messagesLeft = Math.max(0, MAX_MESSAGES - data.messageCount);
  const isLimited = messagesLeft === 0;

  if (!isLimited) {
    data.messageCount += 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    return { messagesLeft: messagesLeft - 1, isLimited: false };
  }

  return { messagesLeft, isLimited };
}

export function resetRateLimit(): void {
  const data = getRateLimitData();
  data.messageCount = 0;
  data.lastReset = Date.now();
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

interface ProRateLimitData {
  count: number;
  windowStart: number;
}

function getProRateLimitData(): ProRateLimitData {
  const stored = localStorage.getItem(PRO_RATE_LIMIT_KEY);
  const now = Date.now();
  if (!stored) {
    const initial: ProRateLimitData = { count: 0, windowStart: now };
    localStorage.setItem(PRO_RATE_LIMIT_KEY, JSON.stringify(initial));
    return initial;
  }
  const data: ProRateLimitData = JSON.parse(stored);
  if (now - data.windowStart >= 60_000) {
    const reset: ProRateLimitData = { count: 0, windowStart: now };
    localStorage.setItem(PRO_RATE_LIMIT_KEY, JSON.stringify(reset));
    return reset;
  }
  return data;
}

export function getCurrentProRateLimit(): {
  messagesLeft: number;
  isLimited: boolean;
} {
  return { messagesLeft: 999, isLimited: false };
}

export function updateProRateLimit(): {
  messagesLeft: number;
  isLimited: boolean;
} {
  return { messagesLeft: 999, isLimited: false };
}
