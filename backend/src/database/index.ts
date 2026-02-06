import Database from 'better-sqlite3';
import path from 'path';
import { Expense, ExpenseInput } from '../types';

const dbPath = path.join(__dirname, '../../data/expenses.db');
let db: Database.Database;

export function initDatabase(): void {
  db = new Database(dbPath);
  
  db.exec(`
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
  `);
  
  console.log('Database initialized');
}

export function createExpense(expense: ExpenseInput): Expense {
  const stmt = db.prepare(`
    INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    expense.amount,
    expense.currency,
    expense.category,
    expense.description,
    expense.merchant,
    expense.original_input
  );
  
  return getExpenseById(result.lastInsertRowid as number)!;
}

export function getAllExpenses(): Expense[] {
  const stmt = db.prepare('SELECT * FROM expenses ORDER BY created_at DESC');
  return stmt.all() as Expense[];
}

export function getExpenseById(id: number): Expense | undefined {
  const stmt = db.prepare('SELECT * FROM expenses WHERE id = ?');
  return stmt.get(id) as Expense | undefined;
}

export function deleteExpense(id: number): boolean {
  const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}
