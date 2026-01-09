import { AddItemForm } from "@/components/add-item-form";
import { ShoppingItemCard } from "@/components/shopping-item-card";
import { ShoppingItem } from "@/types/shopping";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Mock data - 5 items (3 unpurchased, 2 purchased)
const initialItems: ShoppingItem[] = [
  { id: "1", name: "Milk", quantity: "2L", purchased: false },
  { id: "2", name: "Bread", quantity: "1 loaf", purchased: false },
  { id: "3", name: "Eggs", quantity: "12", purchased: false },
  { id: "4", name: "Apples", quantity: "1kg", purchased: true },
  { id: "5", name: "Butter", quantity: "1", purchased: true },
];

export default function ShoppingListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);

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
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleAdd = (name: string, quantity: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      quantity: quantity || "-",
      purchased: false,
    };
    setItems((prevItems) => [newItem, ...prevItems]);
  };

  const totalItemsToBuy = unpurchasedItems.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <LinearGradient colors={["#2563eb", "#1d4ed8"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name="cart"
              size={32}
              color="#ffffff"
              style={styles.cartIcon}
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
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            items.length === 0 && styles.scrollContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
        >
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
  cartIcon: {
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
    paddingBottom: 200, // Space for fixed bottom form
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
});
