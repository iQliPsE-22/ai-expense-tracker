import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

interface ExpenseInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ExpenseInput: React.FC<ExpenseInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <View className="p-4 flex-row gap-3 bg-white shadow-sm z-10">
      <TextInput
        className="flex-1 h-12 border border-blue-200 rounded-xl px-4 text-base bg-blue-50 text-gray-800"
        placeholder="e.g., Spent 500 on groceries"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        editable={!isSubmitting}
      />
      <TouchableOpacity
        className={`w-16 h-12 rounded-xl justify-center items-center shadow-sm ${
          !value.trim() || isSubmitting ? "bg-gray-300" : "bg-accent"
        }`}
        onPress={onSubmit}
        disabled={!value.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
