import { create } from "zustand";
import type { ShoppingItem } from "@/types";

interface StoreState {
  shoppingItems: ShoppingItem[];
  setShoppingItems: (items: ShoppingItem[]) => void;
  removeItem: (id: string) => void;
  updateItem: (updatedItem: ShoppingItem) => void;
  addItem: (newItem: ShoppingItem) => void;
  updateItemOverTempId: (tempId: string, newItem: ShoppingItem) => void;
}

export const useShoppingItemsStore = create<StoreState>()((set) => ({
  shoppingItems: [],
  setShoppingItems: (items) => set({ shoppingItems: items }),
  removeItem: (id: string) =>
    set((state) => ({
      shoppingItems: state.shoppingItems.filter((item) => item._id !== id),
    })),
  updateItem: (updatedItem: ShoppingItem) =>
    set((state) => ({
      shoppingItems: state.shoppingItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      ),
    })),
  addItem: (newItem: ShoppingItem) =>
    set((state) => ({
      shoppingItems: [...state.shoppingItems, newItem],
    })),
  updateItemOverTempId: (tempId: string, newItem: ShoppingItem) =>
    set((state) => ({
      shoppingItems: state.shoppingItems.map((item) =>
        item._id === tempId ? newItem : item
      ),
    })),
}));