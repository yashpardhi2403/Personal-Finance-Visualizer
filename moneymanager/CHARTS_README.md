# Personal Finance Charts with Recharts

This project integrates [Recharts](https://recharts.org/) for building interactive and responsive charts for personal finance visualization. The charts are built using TypeScript and follow modern React patterns with proper TypeScript types.

## 🎯 Features

- **Interactive Charts**: Hover tooltips, click interactions, and responsive design
- **Multiple Chart Types**: Pie charts, bar charts, line charts, and area charts
- **Customizable**: Time ranges, chart types, sorting options, and filtering
- **TypeScript Support**: Full type safety with proper interfaces
- **Modern UI**: Built with shadcn/ui components for consistent styling
- **Data Transformation**: Utility functions to transform raw data into chart-ready formats

## 📊 Available Chart Components

### 1. ExpenseCategoryPieChart
A pie chart showing spending breakdown by category.

```tsx
import { ExpenseCategoryPieChart } from '@/components/charts'

const data = [
  { category: "Food", amount: 450, percentage: 25 },
  { category: "Transport", amount: 320, percentage: 18 },
  // ... more categories
]

<ExpenseCategoryPieChart 
  data={data}
  title="Monthly Expense Breakdown"
  description="How you spent your money this month"
/>
```

### 2. IncomeExpenseBarChart
A bar chart comparing income vs expenses over time.

```tsx
import { IncomeExpenseBarChart } from '@/components/charts'

const data = [
  { period: "Jan", income: 5000, expenses: 3200, net: 1800 },
  { period: "Feb", income: 5200, expenses: 3100, net: 2100 },
  // ... more months
]

<IncomeExpenseBarChart 
  data={data}
  title="Income vs Expenses"
  description="Monthly comparison"
/>
```

### 3. BudgetVsActualChart
A bar chart showing budget vs actual spending by category.

```tsx
import { BudgetVsActualChart } from '@/components/charts'

const data = [
  { 
    category: "Food", 
    budget: 500, 
    actual: 450, 
    remaining: 50, 
    percentage: 90 
  },
  // ... more categories
]

<BudgetVsActualChart 
  data={data}
  title="Budget vs Actual Spending"
  description="Track your budget performance"
/>
```

### 4. MonthlyTrendLineChart
A line/area chart showing financial trends over time.

```tsx
import { MonthlyTrendLineChart } from '@/components/charts'

const data = [
  { 
    month: "Jan", 
    income: 5000, 
    expenses: 3200, 
    savings: 1800, 
    avgDailySpending: 103 
  },
  // ... more months
]

<MonthlyTrendLineChart 
  data={data}
  title="Monthly Financial Trends"
  description="Track income, expenses, and savings"
/>
```

### 5. SavingsGoalProgressChart
A comprehensive savings goal tracker with progress visualization.

```tsx
import { SavingsGoalProgressChart } from '@/components/charts'

const data = [
  {
    goalName: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 7500,
    percentage: 75,
    deadline: "2024-12-31",
    category: "emergency",
  },
  // ... more goals
]

<SavingsGoalProgressChart 
  data={data}
  title="Savings Goals Progress"
  description="Track your progress towards financial goals"
/>
```

## 🛠️ Data Transformation Utilities

The `lib/chart-utils.ts` file provides utility functions to transform your transaction and budget data into the format required by the charts:

### Basic Usage

```tsx
import { 
  transformToExpenseCategories,
  transformToMonthlyIncomeExpense,
  transformToBudgetVsActual,
  transformToMonthlyTrends
} from '@/lib/chart-utils'

// Transform transactions to expense categories
const expenseData = transformToExpenseCategories(transactions)

// Transform to monthly income/expense data
const monthlyData = transformToMonthlyIncomeExpense(transactions, 6) // Last 6 months

// Transform budget vs actual data
const budgetData = transformToBudgetVsActual(budgets, transactions, '2024-01')

// Transform to monthly trends
const trendData = transformToMonthlyTrends(transactions, 6)
```

### Available Utility Functions

- `transformToExpenseCategories(transactions)` - Creates pie chart data
- `transformToMonthlyIncomeExpense(transactions, months)` - Creates bar chart data
- `transformToBudgetVsActual(budgets, transactions, month)` - Creates budget comparison data
- `transformToMonthlyTrends(transactions, months)` - Creates trend line data
- `getSpendingByCategory(transactions, startDate, endDate)` - Get category spending for period
- `getTotalIncome(transactions, startDate, endDate)` - Calculate total income
- `getTotalExpenses(transactions, startDate, endDate)` - Calculate total expenses
- `formatCurrency(amount)` - Format numbers as currency
- `getCurrentMonth()` - Get current month in YYYY-MM format
- `getPreviousMonths(count)` - Get array of previous months

## 🎨 Customization

### Chart Colors
Each chart component uses a predefined color scheme, but you can customize colors by modifying the `chartConfig` object in each component:

```tsx
const chartConfig = {
  income: {
    label: "Income",
    color: "#10B981", // Customize this color
  },
  expenses: {
    label: "Expenses", 
    color: "#EF4444", // Customize this color
  },
} satisfies ChartConfig
```

### Responsive Design
All charts are responsive and will adapt to different screen sizes. The chart containers use CSS Grid and Flexbox for optimal layout.

### Interactive Features
- **Tooltips**: Hover over chart elements to see detailed information
- **Time Range Selectors**: Choose different time periods for data display
- **Chart Type Toggles**: Switch between line and area charts where applicable
- **Sorting Options**: Sort data by different metrics
- **Click Interactions**: Select items for detailed views

## 📱 Demo Page

Visit `/charts-demo` to see all charts in action with sample data. This page demonstrates:

- All available chart components
- Sample data structures
- Interactive features
- Responsive design
- Chart customization options

## 🔧 Installation & Setup

The charts are already integrated into your project. Recharts is installed as a dependency in `package.json`.

### Dependencies
- `recharts` - Chart library
- `@radix-ui/react-progress` - Progress component (for savings goals)

### File Structure
```
components/
├── charts/
│   ├── index.ts                    # Export all chart components
│   ├── expense-category-pie.tsx    # Pie chart for expenses
│   ├── income-expense-bar.tsx      # Bar chart for income/expenses
│   ├── budget-vs-actual.tsx        # Budget comparison chart
│   ├── monthly-trend-line.tsx      # Trend line chart
│   └── savings-goal-progress.tsx   # Savings goal tracker
├── ui/
│   ├── chart.tsx                   # Base chart components
│   └── progress.tsx                # Progress bar component
lib/
├── chart-utils.ts                  # Data transformation utilities
└── models/                         # Data models
app/
└── charts-demo/
    └── page.tsx                    # Demo page
```

## 🚀 Usage Examples

### Basic Chart Implementation

```tsx
"use client"

import { ExpenseCategoryPieChart } from '@/components/charts'
import { transformToExpenseCategories } from '@/lib/chart-utils'

export default function DashboardPage() {
  // Assuming you have transactions data
  const transactions = await getTransactions()
  const expenseData = transformToExpenseCategories(transactions)

  return (
    <div className="container mx-auto p-6">
      <ExpenseCategoryPieChart 
        data={expenseData}
        title="This Month's Expenses"
        description="Breakdown by category"
      />
    </div>
  )
}
```

### Multiple Charts on One Page

```tsx
"use client"

import {
  ExpenseCategoryPieChart,
  IncomeExpenseBarChart,
  MonthlyTrendLineChart
} from '@/components/charts'
import {
  transformToExpenseCategories,
  transformToMonthlyIncomeExpense,
  transformToMonthlyTrends
} from '@/lib/chart-utils'

export default function AnalyticsPage() {
  const transactions = await getTransactions()
  
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ExpenseCategoryPieChart 
        data={transformToExpenseCategories(transactions)}
      />
      <IncomeExpenseBarChart 
        data={transformToMonthlyIncomeExpense(transactions)}
      />
      <div className="lg:col-span-2">
        <MonthlyTrendLineChart 
          data={transformToMonthlyTrends(transactions)}
        />
      </div>
    </div>
  )
}
```

## 🎯 Best Practices

1. **Data Transformation**: Always use the utility functions to transform your data
2. **TypeScript**: Leverage the provided TypeScript interfaces for type safety
3. **Responsive Design**: Use CSS Grid and Flexbox for layout
4. **Performance**: Use React.memo for chart components if needed
5. **Accessibility**: Charts include proper ARIA labels and keyboard navigation
6. **Error Handling**: Always handle cases where data might be empty or undefined

## 🔍 Troubleshooting

### Common Issues

1. **Charts not rendering**: Check that data is in the correct format
2. **Missing dependencies**: Ensure all required packages are installed
3. **TypeScript errors**: Verify that data matches the expected interfaces
4. **Responsive issues**: Check CSS classes and container sizing

### Performance Tips

- Use `React.useMemo` for expensive data transformations
- Implement pagination for large datasets
- Consider lazy loading for charts not immediately visible
- Use `React.memo` to prevent unnecessary re-renders

## 📚 Additional Resources

- [Recharts Documentation](https://recharts.org/)
- [Recharts Examples](https://recharts.org/en-US/examples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contributing

When adding new charts:

1. Create the component in `components/charts/`
2. Add TypeScript interfaces for the data
3. Create utility functions in `lib/chart-utils.ts`
4. Export from `components/charts/index.ts`
5. Add to the demo page
6. Update this documentation

---

Happy charting! 📊✨ 