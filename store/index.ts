import { loadItems, saveItems } from "@/utils/storage";
import { configureStore } from "@reduxjs/toolkit";
import shoppingReducer from "./shoppingSlice";

// Create the Redux store
export const store = configureStore({
  reducer: {
    shopping: shoppingReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Subscribe to store changes and persist to AsyncStorage
store.subscribe(() => {
  const state = store.getState();
  saveItems(state.shopping.items).catch((error) => {
    console.error("Failed to save items to storage:", error);
  });
});

// Load initial data from AsyncStorage
export const initializeStore = async () => {
  try {
    const items = await loadItems();
    return items;
  } catch (error) {
    console.error("Failed to load items from storage:", error);
    return [];
  }
};
