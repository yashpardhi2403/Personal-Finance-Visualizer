"use client"

import {
  ExpenseCategoryPieChart,
  IncomeExpenseBarChart,
  BudgetVsActualChart,
  MonthlyTrendLineChart,
  SavingsGoalProgressChart,
  type ExpenseCategoryData,
  type IncomeExpenseData,
  type BudgetVsActualData,
  type MonthlyTrendData,
  type SavingsGoalData,
} from "@/components/charts"

// Sample data for demonstration
const sampleExpenseData: ExpenseCategoryData[] = [
  { category: "Food", amount: 45000, percentage: 25 },
  { category: "Transport", amount: 32000, percentage: 18 },
  { category: "Shopping", amount: 28000, percentage: 16 },
  { category: "Health", amount: 20000, percentage: 11 },
  { category: "Utilities", amount: 18000, percentage: 10 },
  { category: "Entertainment", amount: 15000, percentage: 8 },
  { category: "Rent", amount: 120000, percentage: 67 },
  { category: "Other", amount: 10000, percentage: 6 },
]

const sampleIncomeExpenseData: IncomeExpenseData[] = [
  { period: "Jan", income: 50000, expenses: 32000, net: 18000 },
  { period: "Feb", income: 52000, expenses: 31000, net: 21000 },
  { period: "Mar", income: 48000, expenses: 34000, net: 14000 },
  { period: "Apr", income: 55000, expenses: 29000, net: 26000 },
  { period: "May", income: 51000, expenses: 33000, net: 18000 },
  { period: "Jun", income: 54000, expenses: 28000, net: 26000 },
]

const sampleBudgetData: BudgetVsActualData[] = [
  { category: "Food", budget: 50000, actual: 45000, remaining: 5000, percentage: 90 },
  { category: "Transport", budget: 40000, actual: 32000, remaining: 8000, percentage: 80 },
  { category: "Shopping", budget: 30000, actual: 28000, remaining: 2000, percentage: 93 },
  { category: "Health", budget: 25000, actual: 20000, remaining: 5000, percentage: 80 },
  { category: "Utilities", budget: 20000, actual: 18000, remaining: 2000, percentage: 90 },
  { category: "Entertainment", budget: 20000, actual: 15000, remaining: 5000, percentage: 75 },
]

const sampleTrendData: MonthlyTrendData[] = [
  { month: "Jan", income: 50000, expenses: 32000, savings: 18000, avgDailySpending: 1033 },
  { month: "Feb", income: 52000, expenses: 31000, savings: 21000, avgDailySpending: 1111 },
  { month: "Mar", income: 48000, expenses: 34000, savings: 14000, avgDailySpending: 1100 },
  { month: "Apr", income: 55000, expenses: 29000, savings: 26000, avgDailySpending: 967 },
  { month: "May", income: 51000, expenses: 33000, savings: 18000, avgDailySpending: 1067 },
  { month: "Jun", income: 54000, expenses: 28000, savings: 26000, avgDailySpending: 933 },
]

const sampleSavingsData: SavingsGoalData[] = [
  {
    goalName: "Emergency Fund",
    targetAmount: 100000,
    currentAmount: 75000,
    percentage: 75,
    deadline: "2024-12-31",
    category: "emergency",
  },
  {
    goalName: "Vacation Fund",
    targetAmount: 50000,
    currentAmount: 32000,
    percentage: 64,
    deadline: "2024-08-15",
    category: "vacation",
  },
  {
    goalName: "House Down Payment",
    targetAmount: 500000,
    currentAmount: 150000,
    percentage: 30,
    deadline: "2025-06-30",
    category: "house",
  },
  {
    goalName: "New Car",
    targetAmount: 250000,
    currentAmount: 80000,
    percentage: 32,
    deadline: "2024-10-31",
    category: "car",
  },
]

export default function ChartsDemoPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Personal Finance Charts Demo</h1>
        <p className="text-muted-foreground">
          Interactive charts built with Recharts for personal finance visualization
        </p>
      </div>

      <div className="grid gap-8">
        {/* Expense Category Pie Chart */}
        <section>
          <ExpenseCategoryPieChart
            data={sampleExpenseData}
            title="Monthly Expense Breakdown"
            description="How you spent your money this month"
          />
        </section>

        {/* Income vs Expense Bar Chart */}
        <section>
          <IncomeExpenseBarChart
            data={sampleIncomeExpenseData}
            title="Income vs Expenses"
            description="Monthly comparison of income and expenses"
          />
        </section>

        {/* Budget vs Actual Chart */}
        <section>
          <BudgetVsActualChart
            data={sampleBudgetData}
            title="Budget vs Actual Spending"
            description="Track your budget performance by category"
          />
        </section>

        {/* Monthly Trend Line Chart */}
        <section>
          <MonthlyTrendLineChart
            data={sampleTrendData}
            title="Monthly Financial Trends"
            description="Track income, expenses, and savings over time"
          />
        </section>

        {/* Savings Goal Progress Chart */}
        <section>
          <SavingsGoalProgressChart
            data={sampleSavingsData}
            title="Savings Goals Progress"
            description="Track your progress towards financial goals"
          />
        </section>
      </div>

      {/* Features Overview */}
      <section className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Chart Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Interactive Elements</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Hover tooltips with detailed information</li>
              <li>• Click interactions for detailed views</li>
              <li>• Responsive design for all screen sizes</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Data Visualization</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Pie charts for category breakdowns</li>
              <li>• Bar charts for comparisons</li>
              <li>• Line charts for trends over time</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Customization</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Time range selectors</li>
              <li>• Chart type toggles</li>
              <li>• Sort and filter options</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
} 