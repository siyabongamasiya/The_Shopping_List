import { ShoppingItem } from "@/types/shopping";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShoppingState {
  items: ShoppingItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ShoppingState = {
  items: [],
  isLoading: false,
  error: null,
};

const shoppingSlice = createSlice({
  name: "shopping",
  initialState,
  reducers: {
    // Add a new item to the list
    addItem: (
      state,
      action: PayloadAction<{ name: string; quantity: string }>
    ) => {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: action.payload.name,
        quantity: action.payload.quantity,
        purchased: false,
        createdAt: Date.now(),
      };
      state.items.push(newItem);
      state.error = null;
    },

    // Edit an existing item
    editItem: (
      state,
      action: PayloadAction<{ id: string; name: string; quantity: string }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.name = action.payload.name;
        item.quantity = action.payload.quantity;
        state.error = null;
      } else {
        state.error = "Item not found";
      }
    },

    // Delete an item
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.error = null;
    },

    // Toggle the purchased status of an item
    togglePurchased: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.purchased = !item.purchased;
        state.error = null;
      } else {
        state.error = "Item not found";
      }
    },

    // Load items from storage (used when app starts)
    setItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addItem,
  editItem,
  deleteItem,
  togglePurchased,
  setItems,
  setLoading,
  setError,
  clearError,
} = shoppingSlice.actions;

export default shoppingSlice.reducer;
