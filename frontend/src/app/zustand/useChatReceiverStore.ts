import {create} from 'zustand';

type Store = {
    chatReceiver: string;
    setChatReceiver: (receiver: string) => void;
};

export const useChatReceiverStore = create<Store>((set) => ({
    chatReceiver: '',
    setChatReceiver: (receiver) => set({ chatReceiver: receiver }),
}));

export type { Store };