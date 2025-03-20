import { create } from "zustand";

type User = {
  id: number;
  username: string;
  password: string;
  createdAt: string;
};

type Store = {
  users: User[];
  setUser: (user: User) => void;
  // You might want to add a method to set all users at once
  setUsers: (users: User[]) => void;
};

export const useUserStore = create<Store>()((set) => ({
  users: [],
  setUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),
  setUsers: (users) => set({ users }),
}));

export type { Store, User };
