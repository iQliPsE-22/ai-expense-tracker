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
  Modal,
} from "react-native";
import { api, Expense } from "../services/api";
import { ExpenseItem } from "../components/ExpenseItem";
import { ExpenseInput } from "../components/ExpenseInput";

export default function ExpenseTrackerScreen() {
  const [input, setInput] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastAdded, setLastAdded] = useState<Expense | null>(null);

  // Edit State
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

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

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditAmount(expense.amount.toString());
    setEditDescription(expense.description);
    setEditCategory(expense.category);
  };

  const handleUpdate = async () => {
    if (!editingExpense) return;

    try {
      const updated = await api.updateExpense(editingExpense.id, {
        amount: parseFloat(editAmount),
        description: editDescription,
        category: editCategory,
      });

      setExpenses(
        expenses.map((e) => (e.id === editingExpense.id ? updated : e)),
      );
      setEditingExpense(null);
    } catch (error) {
      Alert.alert("Error", "Failed to update expense");
    }
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseItem item={item} onDelete={handleDelete} onEdit={handleEdit} />
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

      <ExpenseInput
        value={input}
        onChangeText={setInput}
        onSubmit={handleAddExpense}
        isSubmitting={submitting}
      />

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

      <Modal
        visible={!!editingExpense}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingExpense(null)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">Edit Expense</Text>
              <TouchableOpacity
                onPress={() => setEditingExpense(null)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Text>✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-bold text-gray-500 mb-1">Amount</Text>
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              className="bg-gray-50 p-3 rounded-xl mb-4 font-bold text-lg border border-gray-200"
            />

            <Text className="text-sm font-bold text-gray-500 mb-1">
              Description
            </Text>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-200"
            />

            <Text className="text-sm font-bold text-gray-500 mb-1">
              Category
            </Text>
            <TextInput
              value={editCategory}
              onChangeText={setEditCategory}
              className="bg-gray-50 p-3 rounded-xl mb-6 border border-gray-200"
            />

            <TouchableOpacity
              onPress={handleUpdate}
              className="bg-accent p-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            </TouchableOpacity>
            <View className="h-8" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
