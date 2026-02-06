export interface Expense {
  id: number;
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
  original_input: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  'Food & Dining': '🍔',
  'Transport': '🚗',
  'Shopping': '🛒',
  'Entertainment': '📺',
  'Bills & Utilities': '📄',
  'Health': '💊',
  'Travel': '✈️',
  'Other': '📦',
};
