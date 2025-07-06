import { IconTrendingUp, IconTrendingDown, IconWallet } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards({ transactions = [] }: { transactions?: any[] }) {
  // Calculate totals
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7); // YYYY-MM
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);

  const getMonthTotals = (month: string) => {
    let income = 0, expenses = 0;
    transactions.forEach(t => {
      const tMonth = new Date(t.date).toISOString().slice(0, 7);
      if (tMonth === month) {
        if (t.type === 'income') income += t.amount;
        else if (t.type === 'expense') expenses += t.amount;
      }
    });
    return { income, expenses };
  };

  const { income: thisIncome, expenses: thisExpenses } = getMonthTotals(thisMonth);
  const { income: lastIncome, expenses: lastExpenses } = getMonthTotals(lastMonth);
  const totalBalance = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);
  const savingsRate = thisIncome > 0 ? ((thisIncome - thisExpenses) / thisIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Balance */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Total Balance</div>
          <IconWallet className="text-emerald-700" />
        </div>
        <div className="mt-2 text-3xl font-bold">₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">
          {lastIncome + lastExpenses > 0 ?
            `${(thisIncome - lastIncome >= 0 ? '+' : '')}₹${(thisIncome - lastIncome).toLocaleString(undefined, { minimumFractionDigits: 2 })} from last month`
            : 'No data from last month'}
        </div>
      </div>
      {/* Income */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Income</div>
          <IconTrendingUp className="text-emerald-700" />
        </div>
        <div className="mt-2 text-3xl font-bold">₹{thisIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">
          {lastIncome > 0 ? `${(((thisIncome - lastIncome) / lastIncome) * 100).toFixed(1)}% from last month` : 'No data from last month'}
        </div>
      </div>
      {/* Expenses */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Expenses</div>
          <IconTrendingDown className="text-rose-600" />
        </div>
        <div className="mt-2 text-3xl font-bold">₹{thisExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">
          {lastExpenses > 0 ? `${(((thisExpenses - lastExpenses) / lastExpenses) * 100).toFixed(1)}% from last month` : 'No data from last month'}
        </div>
      </div>
      {/* Savings Rate */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Savings Rate</div>
          <IconTrendingUp className="text-emerald-700" />
        </div>
        <div className="mt-2 text-3xl font-bold">{savingsRate.toFixed(1)}%</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">
          {thisIncome > 0 ? `${(thisIncome - thisExpenses >= 0 ? '+' : '')}${(thisIncome - thisExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })} saved this month` : 'No income this month'}
        </div>
      </div>
    </div>
  )
}
