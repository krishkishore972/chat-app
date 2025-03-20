import { create } from "zustand";

type Store = {
  authName: string;
  setAuthName: (name: string) => void;
};

export const useAuthStore = create<Store>()((set) => ({
authName:'',
  setAuthName: (name) => set({ authName: name }),
}));

export type { Store };
