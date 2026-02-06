import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Image,
} from "react-native";
import { api, Expense } from "../services/api";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Food & Dining": "🍔",
  Transport: "🚗",
  Shopping: "🛒",
  Entertainment: "📺",
  "Bills & Utilities": "📄",
  Health: "💊",
  Travel: "✈️",
  Other: "📦",
};

// Simple relative time helper
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};

export default function ExpenseTrackerScreen() {
  const [input, setInput] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastAdded, setLastAdded] = useState<Expense | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (lastAdded) {
      const timer = setTimeout(() => setLastAdded(null), 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [lastAdded]);

  const loadExpenses = async () => {
    try {
      setRefreshing(true);
      const data = await api.getExpenses();
      setExpenses(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load expenses");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddExpense = async () => {
    if (!input.trim()) return;

    try {
      setSubmitting(true);
      Keyboard.dismiss();
      const newExpense = await api.addExpense(input);
      setExpenses([newExpense, ...expenses]);
      setInput("");
      setLastAdded(newExpense);
    } catch (error: any) {
      // Show invalid input error or API error
      Alert.alert("Error", error.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Optimistic delete
              const original = [...expenses];
              setExpenses(expenses.filter((e) => e.id !== id));
              await api.deleteExpense(id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete expense");
              loadExpenses(); // Revert
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Expense }) => (
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
      <View className="items-end gap-3">
        <Text className="text-lg font-extrabold text-gray-800">
          ₹{item.amount}
        </Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          className="p-1.5 bg-red-50 rounded-lg"
        >
          <Text className="text-sm text-red-600 font-bold">✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="p-5 pt-10 bg-white border-b border-gray-200">
        <View className="flex-row items-center gap-3 mt-6">
          <Image
            source={require("../../assets/ico.png")}
            className="w-12 h-12 rounded-xl"
          />
          <View className="flex-col">
            <Text className="text-2xl font-extrabold text-gray-900 tracking-tighter">
              AI Expense Tracker
            </Text>
            <Text className="text-sm text-gray-500 mt-1 font-medium">
              Add expenses just like talking to a friend
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4 flex-row gap-3 bg-white shadow-sm z-10">
        <TextInput
          className="flex-1 h-12 border border-blue-200 rounded-xl px-4 text-base bg-blue-50 text-gray-800"
          placeholder="e.g., Spent 500 on groceries"
          value={input}
          onChangeText={setInput}
          returnKeyType="done"
          onSubmitEditing={handleAddExpense}
          editable={!submitting}
        />
        <TouchableOpacity
          className={`w-16 h-12 rounded-xl justify-center items-center shadow-sm ${
            !input.trim() || submitting ? "bg-gray-300" : "bg-accent"
          }`}
          onPress={handleAddExpense}
          disabled={!input.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {lastAdded && (
        <View className="mx-4 mt-4 p-4 bg-green-50 rounded-xl border border-green-200 flex-row items-center gap-3">
          <Text className="text-xl">✅</Text>
          <View className="flex-1">
            <Text className="font-bold text-green-800 text-sm mb-0.5">
              Expense Added!
            </Text>
            <Text className="text-green-700 text-xs">
              {lastAdded.category} • ₹{lastAdded.amount}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
        refreshing={refreshing}
        onRefresh={loadExpenses}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20 opacity-70">
            <Text className="text-5xl mb-4">👋</Text>
            <Text className="text-base text-gray-500 font-medium">
              No expenses yet. Add your first one!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
