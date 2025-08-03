import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import type { UIMessage } from 'ai';

export interface ChatState {
  messages: UIMessage[];
  input: string;
}

export interface ChatActions {
  setMessages: (messages: UIMessage[]) => void;
  setInput: (input: string) => void;
  clearChat: () => void;
  addMessage: (message: UIMessage) => void;
}

export type ChatStore = ChatState & ChatActions;

export const defaultChatState: ChatState = {
  messages: [],
  input: '',
};

export const createChatStore = (initState: ChatState = defaultChatState) => {
  return createStore<ChatStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setMessages: (messages: UIMessage[]) =>
          set({ messages }),

        setInput: (input: string) =>
          set({ input }),

        clearChat: () =>
          set({ messages: [], input: '' }),

        addMessage: (message: UIMessage) =>
          set((state) => ({
            messages: [...state.messages, message],
          })),
      }),
      {
        name: 'chat-store',
      }
    )
  );
}; 