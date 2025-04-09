import { create } from "zustand";
import { Msg } from "@/lib/types";

type Store = {
  chatMsgs: Msg[];
  updateChatMsgs: (updater: (prev: Msg[]) => Msg[]) => void;
};

export const useChatMsgsStore = create<Store>((set) => ({
  chatMsgs: [],
  updateChatMsgs: (updater) =>
    set((state) => ({ chatMsgs: updater(state.chatMsgs) })),
}));
