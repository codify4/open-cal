'use client';

import { createContext, useContext, useRef } from 'react';
import type { StoreApi } from 'zustand';
import { useStore } from 'zustand';
import { type ChatStore, createChatStore } from '@/lib/store/chat-store';

interface ChatStoreContext {
  store: StoreApi<ChatStore>;
}

const ChatStoreContext = createContext<ChatStoreContext | null>(null);

export function ChatStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<StoreApi<ChatStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createChatStore();
  }

  return (
    <ChatStoreContext.Provider value={{ store: storeRef.current }}>
      {children}
    </ChatStoreContext.Provider>
  );
}

export function useChatStore<T>(selector: (state: ChatStore) => T): T {
  const context = useContext(ChatStoreContext);
  if (!context) {
    throw new Error('useChatStore must be used within a ChatStoreProvider');
  }
  return useStore(context.store, selector);
}
