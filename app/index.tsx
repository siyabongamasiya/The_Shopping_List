import { AddItemForm } from "@/components/add-item-form";
import { ShoppingItemCard } from "@/components/shopping-item-card";
import { ShoppingItem } from "@/types/shopping";
import { loadItems, saveItems } from "@/utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load items from storage on mount
  useEffect(() => {
    const loadStoredItems = async () => {
      try {
        const storedItems = await loadItems();
        setItems(storedItems);
      } catch (error) {
        console.error("Failed to load items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredItems();
  }, []);

  // Save items to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveItems(items).catch((error) => {
        console.error("Failed to save items:", error);
      });
    }
  }, [items, isLoading]);

  const unpurchasedItems = items.filter((item) => !item.purchased);
  const purchasedItems = items.filter((item) => item.purchased);

  const handleTogglePurchased = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const handleEdit = (id: string, name: string, quantity: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, name, quantity } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    const itemToDelete = items.find((item) => item.id === id);
    if (!itemToDelete) return;

    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${itemToDelete.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAdd = (name: string, quantity: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      quantity: quantity || "-",
      purchased: false,
    };
    setItems((prevItems) => [newItem, ...prevItems]);

    // Scroll to top to show the newly added item
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const totalItemsToBuy = unpurchasedItems.length;

  // Show loading indicator while fetching data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#2563eb", "#1d4ed8"]} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Image
                source={require("@/assets/images/logo.svg")}
                style={styles.logo}
                contentFit="contain"
              />
              <View>
                <Text style={styles.headerTitle}>Shopping List</Text>
                <Text style={styles.headerSubtitle}>Loading...</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading your items....</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <LinearGradient colors={["#2563eb", "#1d4ed8"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Image
              source={require("@/assets/images/logo.svg")}
              style={styles.logo}
              contentFit="contain"
            />
            <View>
              <Text style={styles.headerTitle}>Shopping List</Text>
              <Text style={styles.headerSubtitle}>
                {totalItemsToBuy} {totalItemsToBuy === 1 ? "item" : "items"} to
                buy
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <LinearGradient
        colors={["#eff6ff", "#ffffff"]}
        style={styles.mainContent}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            items.length === 0 && styles.scrollContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {items.length === 0 ? (
                // Empty State
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <MaterialCommunityIcons
                      name="cart-outline"
                      size={40}
                      color="#9ca3af"
                    />
                  </View>
                  <Text style={styles.emptyTitle}>Your list is empty</Text>
                  <Text style={styles.emptySubtitle}>
                    Add items below to get started with your shopping
                  </Text>
                </View>
              ) : (
                <>
                  {/* TO BUY Section */}
                  {unpurchasedItems.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionHeader}>TO BUY</Text>
                      {unpurchasedItems.map((item) => (
                        <ShoppingItemCard
                          key={item.id}
                          item={item}
                          onTogglePurchased={handleTogglePurchased}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </View>
                  )}

                  {/* PURCHASED Section */}
                  {purchasedItems.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionHeader}>PURCHASED</Text>
                      {purchasedItems.map((item) => (
                        <ShoppingItemCard
                          key={item.id}
                          item={item}
                          onTogglePurchased={handleTogglePurchased}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </LinearGradient>

      {/* Bottom Add Item Form */}
      <AddItemForm onAdd={handleAdd} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#bfdbfe",
    fontSize: 14,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 240, // Space for fixed bottom form + safe area
  },
  scrollContentEmpty: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#6b7280",
    marginBottom: 12,
    paddingHorizontal: 8,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
});
