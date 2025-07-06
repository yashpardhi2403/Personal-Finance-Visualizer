import { ObjectId } from 'mongodb';

// Predefined categories for transactions and budgeting (Stage 2+)
export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Utilities'
  | 'Entertainment'
  | 'Rent'
  | 'Salary'
  | 'Other';

// Transaction Interface (Stage 1+)
export interface Transaction {
  _id?: ObjectId;
  amount: number;
  description: string;
  category: Category;
  date: string; // e.g., "2025-07-06"
  type: 'income' | 'expense';
  createdAt?: Date;
  updatedAt?: Date;
}

// Budget Interface (Stage 3)
export interface Budget {
  _id?: ObjectId;
  category: Category;
  amount: number;    // Budgeted amount
  spent: number;     // Tracked/cached total
  month: string;     // e.g., "2025-07"
  createdAt?: Date;
  updatedAt?: Date;
}

// Dashboard Summary (Stage 2+)
export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  categoryBreakdown: {
    category: Category;
    total: number;
  }[];
}

// Chart Types (for frontend use)
export interface MonthlyExpenseData {
  month: string; // e.g., "2025-07"
  totalExpense: number;
}

export interface CategoryPieData {
  category: Category;
  amount: number;
}
