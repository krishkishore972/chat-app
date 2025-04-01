import { create } from "zustand";
import { Msg } from "@/lib/types";




type Store = {
  chatMsgs: Msg[]; // Store messages of type `Msg`
  updateChatMsgs: (chatMsgs: Msg[]) => void; // Update function expects `Msg[]`
};

export const useChatMsgsStore = create<Store>((set) => ({
  chatMsgs: [],
  updateChatMsgs: (chatMsgs) => set({ chatMsgs }),
}));
