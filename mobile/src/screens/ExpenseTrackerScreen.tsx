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
  StyleSheet,
  Platform,
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require("../../assets/ico.png")} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>AI Expense Tracker</Text>
            <Text style={styles.subtitle}>
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
        <View style={styles.successToast}>
          <Text style={styles.checkIcon}>✅</Text>
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>Expense Added!</Text>
            <Text style={styles.successSubtitle}>
              {lastAdded.category} • ₹{lastAdded.amount}
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={loadExpenses}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👋</Text>
            <Text style={styles.emptyText}>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Expense</Text>
              <TouchableOpacity
                onPress={() => setEditingExpense(null)}
                style={styles.closeButton}
              >
                <Text>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Amount</Text>
            <TextInput
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              style={[styles.input, styles.amountInput]}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              style={styles.input}
            />

            <Text style={styles.label}>Category</Text>
            <TextInput
              value={editCategory}
              onChangeText={setEditCategory}
              style={[styles.input, styles.lastInput]}
            />

            <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // gray-50
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // gray-200
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24, // mt-6
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerTextContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827", // gray-900
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280", // gray-500
    marginTop: 4,
    fontWeight: "500",
  },
  successToast: {
    position: "absolute",
    bottom: 8,
    zIndex: 1000,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#ecfdf5", // green-50
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0", // green-200
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkIcon: {
    fontSize: 20,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontWeight: "bold",
    color: "#065f46", // green-800
    fontSize: 14,
    marginBottom: 2,
  },
  successSubtitle: {
    color: "#15803d", // green-700
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    opacity: 0.7,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280", // gray-500
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#f3f4f6", // gray-100
    borderRadius: 9999,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b7280", // gray-500
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f9fafb", // gray-50
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
  },
  amountInput: {
    fontWeight: "bold",
    fontSize: 18,
  },
  lastInput: {
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#7b47db", // accent
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
