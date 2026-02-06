import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Expense } from "../services/api";
import { CATEGORY_EMOJIS, getRelativeTime } from "../utils/helpers";

interface ExpenseItemProps {
  item: Expense;
  onDelete: (id: number) => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  item,
  onDelete,
  onEdit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>
          {CATEGORY_EMOJIS[item.category] || "📦"}
        </Text>
        <View style={styles.info}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
          {item.merchant && (
            <Text style={styles.merchant}>at {item.merchant}</Text>
          )}
          <Text style={styles.time}>{getRelativeTime(item.created_at)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => onEdit(item)}
            style={[styles.iconButton, styles.editButton]}
          >
            <Text style={[styles.iconText, styles.editText]}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={[styles.iconButton, styles.deleteButton]}
          >
            <Text style={[styles.iconText, styles.deleteText]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6", // gray-100
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  emoji: {
    fontSize: 30,
    width: 48,
    height: 48,
    textAlign: "center",
    backgroundColor: "#f9fafb", // gray-50
    borderRadius: 12,
    overflow: "hidden",
    lineHeight: 48,
  },
  info: {
    flex: 1,
  },
  category: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280", // gray-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937", // gray-800
    marginBottom: 2,
  },
  merchant: {
    fontSize: 12,
    color: "#4b5563", // gray-600
    fontStyle: "italic",
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: "#9ca3af", // gray-400
    marginTop: 2,
  },
  actions: {
    alignItems: "flex-end",
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937", // gray-800
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#f9f5ff", // blue-50
  },
  deleteButton: {
    backgroundColor: "#fef2f2", // red-50
  },
  iconText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  editText: {
    color: "#2563eb", // blue-600
  },
  deleteText: {
    color: "#dc2626", // red-600
  },
});
