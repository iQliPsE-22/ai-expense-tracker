import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
    <View className="flex-row bg-white p-4 rounded-2xl items-center justify-between shadow-sm border border-gray-100 mb-3">
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-3xl w-12 h-12 text-center bg-gray-50 rounded-xl overflow-hidden leading-[48px]">
          {CATEGORY_EMOJIS[item.category] || "📦"}
        </Text>
        <View className="flex-1">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">
            {item.category}
          </Text>
          <Text
            className="text-base font-semibold text-gray-800 mb-0.5"
            numberOfLines={1}
          >
            {item.description}
          </Text>
          {item.merchant && (
            <Text className="text-xs text-gray-600 italic mb-0.5">
              at {item.merchant}
            </Text>
          )}
          <Text className="text-xs text-gray-400 mt-0.5">
            {getRelativeTime(item.created_at)}
          </Text>
        </View>
      </View>
      <View className="items-end gap-2">
        <Text className="text-lg font-extrabold text-gray-800">
          ₹{item.amount}
        </Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onEdit(item)}
            className="p-1.5 bg-blue-50 rounded-lg"
          >
            <Text className="text-sm text-blue-600 font-bold">✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="p-1.5 bg-red-50 rounded-lg"
          >
            <Text className="text-sm text-red-600 font-bold">✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
