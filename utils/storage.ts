import { ShoppingItem } from "@/types/shopping";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@shopping_list_items";

/**
 * Save shopping items to AsyncStorage
 */
export const saveItems = async (items: ShoppingItem[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving items to storage:", error);
    throw error;
  }
};

/**
 * Load shopping items from AsyncStorage
 */
export const loadItems = async (): Promise<ShoppingItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading items from storage:", error);
    return [];
  }
};

/**
 * Clear all items from AsyncStorage
 */
export const clearItems = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing items from storage:", error);
    throw error;
  }
};
