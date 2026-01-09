import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddItemFormProps {
  onAdd: (name: string, quantity: string) => void;
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const quantityInputRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (!itemName.trim()) {
      setError("Please enter an item name");
      return;
    }

    onAdd(itemName.trim(), quantity.trim());
    setItemName("");
    setQuantity("");
    setError("");
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, focusedInput === "name" && styles.inputFocused]}
          value={itemName}
          onChangeText={(text) => {
            setItemName(text);
            if (error) setError("");
          }}
          placeholder="Item name"
          placeholderTextColor="#9ca3af"
          returnKeyType="next"
          onSubmitEditing={() => quantityInputRef.current?.focus()}
          blurOnSubmit={false}
          onFocus={() => setFocusedInput("name")}
          onBlur={() => setFocusedInput(null)}
        />

        <TextInput
          ref={quantityInputRef}
          style={[
            styles.input,
            styles.quantityInput,
            focusedInput === "quantity" && styles.inputFocused,
          ]}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Quantity (optional)"
          placeholderTextColor="#9ca3af"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          onFocus={() => setFocusedInput("quantity")}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity
          style={[styles.addButton, itemName.trim() && styles.addButtonActive]}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  quantityInput: {
    marginTop: 8,
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonActive: {
    backgroundColor: "#1d4ed8",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});
