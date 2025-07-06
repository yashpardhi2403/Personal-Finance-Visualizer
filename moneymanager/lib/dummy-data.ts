import { ITransaction } from './models/Transaction';
import { IBudget } from './models/Budget';
import { IncomeExpenseData } from './chart-utils';

// Realistic financial profile for consistent data generation
interface FinancialProfile {
  baseSalary: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  categoryBudgets: Record<string, number>;
  categorySpending: Record<string, number>;
}

// Generate a realistic financial profile
function generateFinancialProfile(): FinancialProfile {
  // Base salary between 45,000 - 75,000 per month (realistic for Indian market)
  const baseSalary = Math.floor(Math.random() * 30000) + 45000;
  
  // Additional income sources (freelance, investments, etc.)
  const freelanceIncome = Math.floor(Math.random() * 8000) + 2000;
  const investmentIncome = Math.floor(Math.random() * 3000) + 500;
  const bonusIncome = Math.floor(Math.random() * 5000) + 1000;
  
  const monthlyIncome = baseSalary + freelanceIncome + investmentIncome + bonusIncome;
  
  // Realistic budget allocation percentages
  const budgetAllocation = {
    'Rent': 0.35,        // 35% of income
    'Food': 0.15,        // 15% of income
    'Transport': 0.08,   // 8% of income
    'Utilities': 0.06,   // 6% of income
    'Health': 0.05,      // 5% of income
    'Entertainment': 0.08, // 8% of income
    'Shopping': 0.10,    // 10% of income
  };
  
  const categoryBudgets: Record<string, number> = {};
  Object.entries(budgetAllocation).forEach(([category, percentage]) => {
    categoryBudgets[category] = Math.round(monthlyIncome * percentage);
  });
  
  // Realistic spending patterns (with some variance)
  const categorySpending: Record<string, number> = {};
  Object.entries(categoryBudgets).forEach(([category, budget]) => {
    // Add realistic variance: 70-130% of budget
    const variance = 0.7 + (Math.random() * 0.6);
    categorySpending[category] = Math.round(budget * variance);
  });
  
  const monthlyExpenses = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
  
  return {
    baseSalary,
    monthlyIncome,
    monthlyExpenses,
    categoryBudgets,
    categorySpending
  };
}

// Generate dummy transactions for the last 6 months with realistic patterns
export function generateDummyTransactions(): ITransaction[] {
  const transactions: ITransaction[] = [];
  const profile = generateFinancialProfile();
  
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Entertainment', 'Rent'];
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus'];
  
  // Generate data for the last 3 months with realistic trends (reduced from 6 months)
  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Add seasonal variations and trends
    const seasonalFactor = 1 + (Math.sin(monthOffset * Math.PI / 2) * 0.1); // ±10% seasonal variation
    const trendFactor = 1 + (monthOffset * 0.02); // Gradual increase over time
    
    // Generate transactions for this month
    const monthlyTransactions = generateMonthlyTransactions(
      profile, 
      year, 
      month, 
      seasonalFactor * trendFactor,
      monthOffset
    );
    
    transactions.push(...monthlyTransactions);
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate transactions for a specific month (optimized for speed)
function generateMonthlyTransactions(
  profile: FinancialProfile, 
  year: number, 
  month: number, 
  factor: number,
  monthOffset: number
): ITransaction[] {
  const transactions: ITransaction[] = [];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Entertainment', 'Rent'];
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus'];
  
  // Income transactions (1-2 per month - reduced from 1-3)
  const incomeCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < incomeCount; i++) {
    const day = Math.floor(Math.random() * 28) + 1;
    const transactionDate = new Date(year, month, day);
    
    let category: string;
    let amount: number;
    
    if (i === 0) {
      // Main salary (always present)
      category = 'Salary';
      amount = Math.round(profile.baseSalary * factor);
    } else {
      // Additional income
      category = incomeCategories[Math.floor(Math.random() * 3) + 1]; // Skip Salary
      switch (category) {
        case 'Freelance':
          amount = Math.round((profile.monthlyIncome - profile.baseSalary) * 0.4 * factor);
          break;
        case 'Investment':
          amount = Math.round((profile.monthlyIncome - profile.baseSalary) * 0.2 * factor);
          break;
        case 'Bonus':
          amount = Math.round((profile.monthlyIncome - profile.baseSalary) * 0.4 * factor);
          break;
        default:
          amount = Math.round((profile.monthlyIncome - profile.baseSalary) * 0.3 * factor);
      }
    }
    
    const descriptions = {
      'Salary': ['Monthly Salary', 'Paycheck', 'Base Salary'],
      'Freelance': ['Freelance Project', 'Consulting Work', 'Side Project', 'Web Development'],
      'Investment': ['Stock Dividends', 'Interest Income', 'Investment Returns', 'Mutual Fund'],
      'Bonus': ['Performance Bonus', 'Year-end Bonus', 'Incentive Bonus', 'Quarterly Bonus']
    };
    
    const descriptionList = descriptions[category as keyof typeof descriptions];
    const description = descriptionList[Math.floor(Math.random() * descriptionList.length)];
    
    transactions.push({
      _id: `dummy_${year}_${month}_income_${i}`,
      amount,
      description,
      category,
      date: transactionDate.toISOString().split('T')[0],
      type: 'income',
      createdAt: transactionDate.toISOString(),
      updatedAt: transactionDate.toISOString()
    });
  }
  
  // Expense transactions (8-12 per month - reduced from 15-25)
  const expenseCount = Math.floor(Math.random() * 5) + 8;
  const monthlySpending = profile.categorySpending;
  
  for (let i = 0; i < expenseCount; i++) {
    const day = Math.floor(Math.random() * 28) + 1;
    const transactionDate = new Date(year, month, day);
    
    // Weighted category selection based on spending patterns
    const category = selectWeightedCategory(expenseCategories, monthlySpending);
    
    // Generate realistic amount based on category and monthly budget
    const amount = generateRealisticExpenseAmount(category, monthlySpending[category], factor);
    
    const descriptions = {
      'Food': ['Grocery Shopping', 'Restaurant', 'Coffee Shop', 'Takeout', 'Lunch', 'Dinner', 'Breakfast'],
      'Transport': ['Fuel', 'Public Transport', 'Uber Ride', 'Parking', 'Car Maintenance', 'Metro Card'],
      'Shopping': ['Clothing', 'Electronics', 'Home Goods', 'Books', 'Gifts', 'Amazon Purchase'],
      'Health': ['Doctor Visit', 'Medicine', 'Gym Membership', 'Health Insurance', 'Pharmacy'],
      'Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Gas Bill', 'Mobile Bill'],
      'Entertainment': ['Movie Tickets', 'Concert', 'Netflix Subscription', 'Games', 'Dining Out'],
      'Rent': ['Monthly Rent', 'Apartment Rent', 'House Rent', 'Maintenance']
    };
    
    const descriptionList = descriptions[category as keyof typeof descriptions];
    const description = descriptionList[Math.floor(Math.random() * descriptionList.length)];
    
    transactions.push({
      _id: `dummy_${year}_${month}_expense_${i}`,
      amount,
      description,
      category,
      date: transactionDate.toISOString().split('T')[0],
      type: 'expense',
      createdAt: transactionDate.toISOString(),
      updatedAt: transactionDate.toISOString()
    });
  }
  
  return transactions;
}

// Select category based on spending weight
function selectWeightedCategory(categories: string[], spending: Record<string, number>): string {
  const totalSpending = Object.values(spending).reduce((sum, amount) => sum + amount, 0);
  const weights = categories.map(cat => spending[cat] / totalSpending);
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < categories.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return categories[i];
    }
  }
  
  return categories[0];
}

// Generate realistic expense amount
function generateRealisticExpenseAmount(category: string, monthlyBudget: number, factor: number): number {
  const baseAmount = monthlyBudget / 8; // Assume 8 transactions per category per month
  
  // Category-specific variations
  const variations = {
    'Rent': { min: 0.9, max: 1.1 },      // Very consistent
    'Food': { min: 0.3, max: 2.0 },      // Highly variable
    'Transport': { min: 0.5, max: 1.5 }, // Moderate variation
    'Shopping': { min: 0.2, max: 3.0 },  // Highly variable
    'Health': { min: 0.1, max: 5.0 },    // Very variable (medical expenses)
    'Utilities': { min: 0.8, max: 1.2 }, // Consistent
    'Entertainment': { min: 0.3, max: 2.5 } // Variable
  };
  
  const variation = variations[category as keyof typeof variations] || { min: 0.5, max: 1.5 };
  const randomFactor = variation.min + (Math.random() * (variation.max - variation.min));
  
  return Math.round(baseAmount * randomFactor * factor);
}

// Generate dummy budgets for current and previous month using the same financial profile
export function generateDummyBudgets(): IBudget[] {
  const budgets: IBudget[] = [];
  const profile = generateFinancialProfile();
  const categories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Entertainment', 'Rent'];
  
  // Current month
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  
  // Previous month
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthStr = prevMonth.toISOString().slice(0, 7);
  
  // Define which categories should be over budget (realistic scenarios)
  const overBudgetCategories = ['Shopping', 'Entertainment']; // Categories that commonly go over budget
  const underBudgetCategories = ['Utilities', 'Health']; // Categories that usually stay under budget
  const normalCategories = ['Food', 'Transport', 'Rent']; // Categories with normal variance
  
  // Generate budgets for current month
  categories.forEach(category => {
    const budgetAmount = profile.categoryBudgets[category];
    const budgetVariance = 0.9 + (Math.random() * 0.2);
    const amount = Math.round(budgetAmount * budgetVariance);
    
    let spentVariance: number;
    
    if (overBudgetCategories.includes(category)) {
      // Categories that commonly go over budget: 110-140% of budget
      spentVariance = 1.1 + (Math.random() * 0.3);
    } else if (underBudgetCategories.includes(category)) {
      // Categories that usually stay under budget: 60-95% of budget
      spentVariance = 0.6 + (Math.random() * 0.35);
    } else {
      // Normal categories: 70-110% of budget
      spentVariance = 0.7 + (Math.random() * 0.4);
    }
    
    const spent = Math.round(amount * spentVariance);
    
    budgets.push({
      _id: `budget_${currentMonth}_${category}`,
      category,
      amount,
      spent,
      month: currentMonth
    });
  });
  
  // Generate budgets for previous month (different pattern)
  categories.forEach(category => {
    const budgetAmount = profile.categoryBudgets[category];
    const budgetVariance = 0.85 + (Math.random() * 0.3);
    const amount = Math.round(budgetAmount * budgetVariance);
    
    let spentVariance: number;
    
    if (overBudgetCategories.includes(category)) {
      // Previous month: 105-130% of budget (slightly less over budget)
      spentVariance = 1.05 + (Math.random() * 0.25);
    } else if (underBudgetCategories.includes(category)) {
      // Previous month: 65-90% of budget
      spentVariance = 0.65 + (Math.random() * 0.25);
    } else {
      // Previous month: 75-105% of budget
      spentVariance = 0.75 + (Math.random() * 0.3);
    }
    
    const spent = Math.round(amount * spentVariance);
    
    budgets.push({
      _id: `budget_${prevMonthStr}_${category}`,
      category,
      amount,
      spent,
      month: prevMonthStr
    });
  });
  
  return budgets;
}

// Generate dummy chart data for income/expense bar chart using the same financial profile
export function generateDummyChartData(): IncomeExpenseData[] {
  const chartData: IncomeExpenseData[] = [];
  const profile = generateFinancialProfile();
  
  // Generate data for the last 8 months with realistic trends (increased for better chart visualization)
  for (let monthOffset = 7; monthOffset >= 0; monthOffset--) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    // Add realistic trends and seasonal variations
    const seasonalFactor = 1 + (Math.sin(monthOffset * Math.PI / 4) * 0.08); // ±8% seasonal variation
    const trendFactor = 1 + (monthOffset * 0.015); // Gradual 1.5% monthly increase
    const randomFactor = 0.95 + (Math.random() * 0.1); // ±5% random variation
    
    const totalFactor = seasonalFactor * trendFactor * randomFactor;
    
    // Base income and expenses from profile
    const baseIncome = profile.monthlyIncome;
    const baseExpenses = profile.monthlyExpenses;
    
    // Apply factors to create realistic monthly variations
    const income = Math.round(baseIncome * totalFactor);
    const expenses = Math.round(baseExpenses * totalFactor);
    const net = income - expenses;
    
    chartData.push({
      period: monthName,
      income,
      expenses,
      net
    });
  }
  
  return chartData;
}

// Generate all dummy data from a single financial profile for complete consistency
export function generateConsistentDummyData() {
  const profile = generateFinancialProfile();
  
  return {
    transactions: generateDummyTransactionsFromProfile(profile),
    budgets: generateDummyBudgetsFromProfile(profile),
    chart: generateDummyChartDataFromProfile(profile)
  };
}

// Generate transactions from a specific profile
function generateDummyTransactionsFromProfile(profile: FinancialProfile): ITransaction[] {
  const transactions: ITransaction[] = [];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Entertainment', 'Rent'];
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus'];
  
  // Generate data for the last 3 months with realistic trends (reduced from 6 months)
  for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Add seasonal variations and trends
    const seasonalFactor = 1 + (Math.sin(monthOffset * Math.PI / 2) * 0.1);
    const trendFactor = 1 + (monthOffset * 0.02);
    
    const monthlyTransactions = generateMonthlyTransactions(
      profile, 
      year, 
      month, 
      seasonalFactor * trendFactor,
      monthOffset
    );
    
    transactions.push(...monthlyTransactions);
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate budgets from a specific profile with controlled over-budget categories
function generateDummyBudgetsFromProfile(profile: FinancialProfile): IBudget[] {
  const budgets: IBudget[] = [];
  const categories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Entertainment', 'Rent'];
  
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7);
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthStr = prevMonth.toISOString().slice(0, 7);
  
  // Define which categories should be over budget (realistic scenarios)
  const overBudgetCategories = ['Shopping', 'Entertainment']; // Categories that commonly go over budget
  const underBudgetCategories = ['Utilities', 'Health']; // Categories that usually stay under budget
  const normalCategories = ['Food', 'Transport', 'Rent']; // Categories with normal variance
  
  // Generate budgets for current month
  categories.forEach(category => {
    const budgetAmount = profile.categoryBudgets[category];
    const budgetVariance = 0.9 + (Math.random() * 0.2);
    const amount = Math.round(budgetAmount * budgetVariance);
    
    let spentVariance: number;
    
    if (overBudgetCategories.includes(category)) {
      // Categories that commonly go over budget: 110-140% of budget
      spentVariance = 1.1 + (Math.random() * 0.3);
    } else if (underBudgetCategories.includes(category)) {
      // Categories that usually stay under budget: 60-95% of budget
      spentVariance = 0.6 + (Math.random() * 0.35);
    } else {
      // Normal categories: 70-110% of budget
      spentVariance = 0.7 + (Math.random() * 0.4);
    }
    
    const spent = Math.round(amount * spentVariance);
    
    budgets.push({
      _id: `budget_${currentMonth}_${category}`,
      category,
      amount,
      spent,
      month: currentMonth
    });
  });
  
  // Generate budgets for previous month (different pattern)
  categories.forEach(category => {
    const budgetAmount = profile.categoryBudgets[category];
    const budgetVariance = 0.85 + (Math.random() * 0.3);
    const amount = Math.round(budgetAmount * budgetVariance);
    
    let spentVariance: number;
    
    if (overBudgetCategories.includes(category)) {
      // Previous month: 105-130% of budget (slightly less over budget)
      spentVariance = 1.05 + (Math.random() * 0.25);
    } else if (underBudgetCategories.includes(category)) {
      // Previous month: 65-90% of budget
      spentVariance = 0.65 + (Math.random() * 0.25);
    } else {
      // Previous month: 75-105% of budget
      spentVariance = 0.75 + (Math.random() * 0.3);
    }
    
    const spent = Math.round(amount * spentVariance);
    
    budgets.push({
      _id: `budget_${prevMonthStr}_${category}`,
      category,
      amount,
      spent,
      month: prevMonthStr
    });
  });
  
  return budgets;
}

// Generate chart data from a specific profile
function generateDummyChartDataFromProfile(profile: FinancialProfile): IncomeExpenseData[] {
  const chartData: IncomeExpenseData[] = [];
  
  for (let monthOffset = 7; monthOffset >= 0; monthOffset--) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthOffset);
    
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const seasonalFactor = 1 + (Math.sin(monthOffset * Math.PI / 4) * 0.08);
    const trendFactor = 1 + (monthOffset * 0.015);
    const randomFactor = 0.95 + (Math.random() * 0.1);
    
    const totalFactor = seasonalFactor * trendFactor * randomFactor;
    
    const baseIncome = profile.monthlyIncome;
    const baseExpenses = profile.monthlyExpenses;
    
    const income = Math.round(baseIncome * totalFactor);
    const expenses = Math.round(baseExpenses * totalFactor);
    const net = income - expenses;
    
    chartData.push({
      period: monthName,
      income,
      expenses,
      net
    });
  }
  
  return chartData;
}

// Get dummy data based on type (maintains backward compatibility)
export function getDummyData(type: 'transactions' | 'budgets' | 'chart') {
  switch (type) {
    case 'transactions':
      return generateDummyTransactions();
    case 'budgets':
      return generateDummyBudgets();
    case 'chart':
      return generateDummyChartData();
    default:
      return [];
  }
} 