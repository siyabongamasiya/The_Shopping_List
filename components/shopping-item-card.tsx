import { ShoppingItem } from "@/types/shopping";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onTogglePurchased: (id: string) => void;
  onEdit: (id: string, name: string, quantity: string) => void;
  onDelete: (id: string) => void;
}

export function ShoppingItemCard({
  item,
  onTogglePurchased,
  onEdit,
  onDelete,
}: ShoppingItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);

  const handleSave = () => {
    if (editName.trim()) {
      onEdit(item.id, editName.trim(), editQuantity.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.card}>
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Item name"
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={styles.editInput}
            value={editQuantity}
            onChangeText={setEditQuantity}
            placeholder="Quantity"
            placeholderTextColor="#9ca3af"
          />
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity
              style={[styles.editButton, styles.saveButton]}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="check" size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close" size={16} color="#6b7280" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, item.purchased && styles.purchasedCard]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onTogglePurchased(item.id)}
        activeOpacity={0.7}
      >
        {item.purchased ? (
          <View style={styles.checkedBox}>
            <MaterialCommunityIcons name="check" size={16} color="#ffffff" />
          </View>
        ) : (
          <View style={styles.uncheckedBox} />
        )}
      </TouchableOpacity>

      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, item.purchased && styles.purchasedText]}>
          {item.name}
        </Text>
        <Text
          style={[styles.itemQuantity, item.purchased && styles.purchasedText]}
        >
          Qty: {item.quantity}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editActionButton]}
          onPress={() => setIsEditing(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="pencil" size={16} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteActionButton]}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="trash-can" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  purchasedCard: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#111827",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  purchasedText: {
    color: "#6b7280",
    textDecorationLine: "line-through",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  editActionButton: {
    backgroundColor: "#dbeafe",
  },
  deleteActionButton: {
    backgroundColor: "#fee2e2",
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 12,
  },
  editButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  saveButton: {
    backgroundColor: "#2563eb",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "500",
  },
});
