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

// Replace with your machine's IP if testing on real device
// Android Emulator uses 10.0.2.2 for localhost
import { Platform } from "react-native";

// Detected LAN IP: 192.168.31.86
// If you are using an Android Emulator, you can also use "10.0.2.2"
// If you are using an iOS Simulator, "localhost" works too.
const SERVER_IP = "192.168.31.86";

const BASE_URL = `http://${SERVER_IP}:3000/api/expenses`;

export const api = {
  async addExpense(input: string): Promise<Expense> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to add expense");
    }
    return data.expense;
  },

  async getExpenses(): Promise<Expense[]> {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch expenses");
    }
    return data.expenses;
  },

  async deleteExpense(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete expense");
    }
  },

  async updateExpense(id: number, updates: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update expense");
    }
    return data.expense;
  },
};
