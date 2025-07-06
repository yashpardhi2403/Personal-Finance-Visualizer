import { ITransaction } from './models/Transaction'
import { IBudget } from './models/Budget'

// Types for chart data
export interface ExpenseCategoryData {
  category: string
  amount: number
  percentage: number
}

export interface IncomeExpenseData {
  period: string
  income: number
  expenses: number
  net: number
}

export interface BudgetVsActualData {
  category: string
  budget: number
  actual: number
  remaining: number
  percentage: number
}

export interface MonthlyTrendData {
  month: string
  income: number
  expenses: number
  savings: number
  avgDailySpending: number
}

export interface SavingsGoalData {
  goalName: string
  targetAmount: number
  currentAmount: number
  percentage: number
  deadline: string
  category: string
}

/**
 * Transform transactions into expense category data for pie chart
 */
export function transformToExpenseCategories(transactions: ITransaction[]): ExpenseCategoryData[] {
  const categoryTotals = new Map<string, number>()
  
  // Sum expenses by category
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const current = categoryTotals.get(transaction.category) || 0
      categoryTotals.set(transaction.category, current + transaction.amount)
    })
  
  const totalExpenses = Array.from(categoryTotals.values()).reduce((sum, amount) => sum + amount, 0)
  
  return Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
}

/**
 * Transform transactions into monthly income/expense data
 */
export function transformToMonthlyIncomeExpense(transactions: ITransaction[], months: number = 6): IncomeExpenseData[] {
  const monthlyData = new Map<string, { income: number; expenses: number }>()
  
  // Group transactions by month
  transactions.forEach(transaction => {
    const monthKey = new Date(transaction.date).toISOString().slice(0, 7) // YYYY-MM format
    const current = monthlyData.get(monthKey) || { income: 0, expenses: 0 }
    
    if (transaction.type === 'income') {
      current.income += transaction.amount
    } else {
      current.expenses += transaction.amount
    }
    
    monthlyData.set(monthKey, current)
  })
  
  // Convert to array and sort by date
  return Array.from(monthlyData.entries())
    .map(([period, data]) => ({
      period: new Date(period + '-01').toLocaleDateString('en-US', { month: 'short' }),
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }))
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
    .slice(-months)
}

/**
 * Transform budget and transaction data into budget vs actual comparison
 */
export function transformToBudgetVsActual(
  budgets: IBudget[],
  transactions: ITransaction[],
  month: string
): BudgetVsActualData[] {
  const budgetMap = new Map(budgets.map(b => [b.category, b]))
  const actualSpending = new Map<string, number>()
  
  // Calculate actual spending for the month
  transactions
    .filter(t => {
      const transactionMonth = new Date(t.date).toISOString().slice(0, 7)
      return t.type === 'expense' && transactionMonth === month
    })
    .forEach(transaction => {
      const current = actualSpending.get(transaction.category) || 0
      actualSpending.set(transaction.category, current + transaction.amount)
    })
  
  return budgets
    .filter(b => b.month === month)
    .map(budget => {
      const actual = actualSpending.get(budget.category) || 0
      const remaining = budget.amount - actual
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0
      
      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        remaining,
        percentage
      }
    })
    .sort((a, b) => b.budget - a.budget)
}

/**
 * Transform transactions into monthly trend data
 */
export function transformToMonthlyTrends(transactions: ITransaction[], months: number = 6): MonthlyTrendData[] {
  const monthlyData = new Map<string, { 
    income: number; 
    expenses: number; 
    daysInMonth: number;
    transactionCount: number;
  }>()
  
  // Group transactions by month
  transactions.forEach(transaction => {
    const monthKey = new Date(transaction.date).toISOString().slice(0, 7)
    const current = monthlyData.get(monthKey) || { 
      income: 0, 
      expenses: 0, 
      daysInMonth: new Date(transaction.date).getDate(),
      transactionCount: 0
    }
    
    if (transaction.type === 'income') {
      current.income += transaction.amount
    } else {
      current.expenses += transaction.amount
    }
    current.transactionCount++
    
    monthlyData.set(monthKey, current)
  })
  
  return Array.from(monthlyData.entries())
    .map(([monthKey, data]) => {
      const savings = data.income - data.expenses
      const avgDailySpending = data.daysInMonth > 0 ? data.expenses / data.daysInMonth : 0
      
      return {
        month: new Date(monthKey + '-01').toLocaleDateString('en-US', { month: 'short' }),
        income: data.income,
        expenses: data.expenses,
        savings,
        avgDailySpending
      }
    })
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-months)
}

/**
 * Calculate spending by category for a specific time period
 */
export function getSpendingByCategory(
  transactions: ITransaction[],
  startDate: Date,
  endDate: Date
): Map<string, number> {
  const categoryTotals = new Map<string, number>()
  
  transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'expense' && 
             transactionDate >= startDate && 
             transactionDate <= endDate
    })
    .forEach(transaction => {
      const current = categoryTotals.get(transaction.category) || 0
      categoryTotals.set(transaction.category, current + transaction.amount)
    })
  
  return categoryTotals
}

/**
 * Calculate total income for a specific time period
 */
export function getTotalIncome(
  transactions: ITransaction[],
  startDate: Date,
  endDate: Date
): number {
  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'income' && 
             transactionDate >= startDate && 
             transactionDate <= endDate
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

/**
 * Calculate total expenses for a specific time period
 */
export function getTotalExpenses(
  transactions: ITransaction[],
  startDate: Date,
  endDate: Date
): number {
  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'expense' && 
             transactionDate >= startDate && 
             transactionDate <= endDate
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Get month name from date string
 */
export function getMonthName(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long' })
}

/**
 * Get current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

/**
 * Get previous N months in YYYY-MM format
 */
export function getPreviousMonths(count: number): string[] {
  const months: string[] = []
  const today = new Date()
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push(date.toISOString().slice(0, 7))
  }
  
  return months
} 