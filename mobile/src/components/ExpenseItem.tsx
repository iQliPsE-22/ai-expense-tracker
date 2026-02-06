import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Expense, CATEGORY_EMOJIS } from '../types';

interface Props {
  expense: Expense;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export function ExpenseItem({ expense, onDelete, isDeleting }: Props) {
  const emoji = CATEGORY_EMOJIS[expense.category] || '📦';

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(expense.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, isDeleting && styles.deleting]}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.details}>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.description}>{expense.description}</Text>
          <Text style={styles.time}>{getTimeAgo(expense.created_at)}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>₹{expense.amount}</Text>
        <TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleting: {
    opacity: 0.5,
  },
  left: {
    flexDirection: 'row',
    flex: 1,
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  deleteBtn: {
    fontSize: 20,
    marginTop: 8,
  },
});
