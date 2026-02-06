import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../data/expenses.db");
const db = new Database(dbPath);

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

export interface ExpenseInput {
  amount: number;
  currency?: string;
  category: string;
  description: string;
  merchant?: string | null;
  original_input: string;
}

export const initDatabase = () => {
  const createTable = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      category VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      merchant VARCHAR(100),
      original_input TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.exec(createTable);
  console.log("Database initialized");
};

export const createExpense = (expense: ExpenseInput): Expense => {
  const insert = db.prepare(`
    INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
    VALUES (@amount, @currency, @category, @description, @merchant, @original_input)
  `);

  const info = insert.run({
    ...expense,
    currency: expense.currency || "INR",
    merchant: expense.merchant || null,
  });

  return getExpenseById(info.lastInsertRowid as number)!;
};

export const getAllExpenses = (): Expense[] => {
  const stmt = db.prepare("SELECT * FROM expenses ORDER BY created_at DESC");
  return stmt.all() as Expense[];
};

export const getExpenseById = (id: number): Expense | undefined => {
  const stmt = db.prepare("SELECT * FROM expenses WHERE id = ?");
  return stmt.get(id) as Expense | undefined;
};

export const deleteExpense = (id: number): boolean => {
  const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
};
