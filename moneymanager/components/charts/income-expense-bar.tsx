"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface IncomeExpenseData {
  period: string
  income: number
  expenses: number
  net: number
}

interface IncomeExpenseBarChartProps {
  data: IncomeExpenseData[]
  title?: string
  description?: string
}

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--primary)", // Black/grey color like dashboard
  },
  expenses: {
    label: "Expenses",
    color: "var(--muted-foreground)", // Grey color
  },
  net: {
    label: "Net",
    color: "var(--foreground)", // Dark color
  },
} satisfies ChartConfig

export function IncomeExpenseBarChart({
  data,
  title = "Income vs Expenses",
  description = "12-month comparison",
}: IncomeExpenseBarChartProps) {
  // Always show 12 months of data
  const filteredData = React.useMemo(() => {
    return data.slice(-12)
  }, [data])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-[4/3] h-[300px] w-full"
        >
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₹${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `₹${Number(value).toFixed(2)}`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name,
                  ]}
                />
              }
            />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={[4, 4, 0, 0]}
              stackId="b"
            />
          </BarChart>
        </ChartContainer>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
              ₹{filteredData.reduce((sum, item) => sum + item.income, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--muted-foreground)' }}>
              ₹{filteredData.reduce((sum, item) => sum + item.expenses, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net Savings</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              ₹{filteredData.reduce((sum, item) => sum + item.net, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 