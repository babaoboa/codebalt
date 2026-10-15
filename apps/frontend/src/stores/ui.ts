import { create } from "zustand";

type UiState = {
  count: number;
  name: string;
  increment: () => void;
  setName: (name: string) => void;
};

// Keep shared UI state here; API data is owned by TanStack Query.
export const useUiStore = create<UiState>()((set) => ({
  count: 0,
  name: "Codebalt",
  increment: () => set((state) => ({ count: state.count + 1 })),
  setName: (name) => set({ name }),
}));
