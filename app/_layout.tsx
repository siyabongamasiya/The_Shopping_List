import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after component mounts
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Error hiding splash screen:", error);
      }
    };

    // Add a small delay to ensure everything is loaded
    const timer = setTimeout(hideSplash, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
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
    </>
  );
}
