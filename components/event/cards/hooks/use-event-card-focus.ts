import { useEffect, useRef, useState } from 'react';

export const useEventCardFocus = (onFocus?: (eventId: string) => void) => {
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setIsFocused(true);

    if (onFocus) {
      onFocus(eventId);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isFocused]);

  return {
    isFocused,
    cardRef,
    handleCardClick,
  };
};
