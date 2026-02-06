import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense, CATEGORY_EMOJIS } from '../types';

interface Props {
  expense: Expense;
  onDismiss: () => void;
}

export function SuccessCard({ expense, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const emoji = CATEGORY_EMOJIS[expense.category] || '📦';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Added Successfully!</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>₹{expense.amount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{emoji} {expense.category}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{expense.description}</Text>
      </View>
      {expense.merchant && (
        <View style={styles.row}>
          <Text style={styles.label}>Merchant:</Text>
          <Text style={styles.value}>{expense.merchant}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 90,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
});
