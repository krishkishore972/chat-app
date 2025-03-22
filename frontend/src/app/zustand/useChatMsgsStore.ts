import { create } from "zustand";

type Store = {
    chatMsgs: string[];
    updateChatMsgs: (chatMsgs: string[]) => void;
}

export const useChatMsgsStore = create<Store>((set) => ({
  chatMsgs: [],
  updateChatMsgs: (chatMsgs) => set({ chatMsgs }),
}));
