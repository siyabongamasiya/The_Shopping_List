import { initializeStore, store } from "@/store";
import { setItems, setLoading } from "@/store/shoppingSlice";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Load items from storage and initialize Redux store
    const initApp = async () => {
      try {
        store.dispatch(setLoading(true));
        const items = await initializeStore();
        store.dispatch(setItems(items));
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        // Hide splash screen after data is loaded
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.warn("Error hiding splash screen:", error);
        }
      }
    };

    const timer = setTimeout(initApp, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: "ShoppingList",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </Provider>
  );
}
