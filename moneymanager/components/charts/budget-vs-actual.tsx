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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BudgetVsActualData {
  category: string
  budget: number
  actual: number
  remaining: number
  percentage: number
}

interface BudgetVsActualChartProps {
  data: BudgetVsActualData[]
  title?: string
  description?: string
}

const chartConfig = {
  budget: {
    label: "Budget",
    color: "#3B82F6", // Blue
  },
  actual: {
    label: "Actual",
    color: "#EF4444", // Red
  },
  remaining: {
    label: "Remaining",
    color: "#10B981", // Green
  },
} satisfies ChartConfig

export function BudgetVsActualChart({
  data,
  title = "Budget vs Actual",
  description = "Monthly budget tracking",
}: BudgetVsActualChartProps) {
  const [sortBy, setSortBy] = React.useState("budget")

  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      switch (sortBy) {
        case "budget":
          return b.budget - a.budget
        case "actual":
          return b.actual - a.actual
        case "remaining":
          return b.remaining - a.remaining
        case "percentage":
          return b.percentage - a.percentage
        default:
          return 0
      }
    })
  }, [data, sortBy])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Sort by Budget</SelectItem>
              <SelectItem value="actual">Sort by Actual</SelectItem>
              <SelectItem value="remaining">Sort by Remaining</SelectItem>
              <SelectItem value="percentage">Sort by % Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-[4/3] h-[400px] w-full"
        >
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `$${Number(value).toFixed(2)}`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name,
                  ]}
                />
              }
            />
            <Bar
              dataKey="budget"
              fill="var(--color-budget)"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="actual"
              fill="var(--color-actual)"
              radius={[4, 4, 0, 0]}
              stackId="b"
            />
          </BarChart>
        </ChartContainer>
        
        {/* Budget Status Summary */}
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium">Budget Status</h4>
          <div className="grid grid-cols-2 gap-4">
            {sortedData.map((item) => (
              <div
                key={item.category}
                className="rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span
                    className={`text-xs font-medium ${
                      item.percentage > 100
                        ? "text-red-600"
                        : item.percentage > 80
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Budget:</span>
                    <span>${item.budget.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Spent:</span>
                    <span>${item.actual.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span>Remaining:</span>
                    <span
                      className={
                        item.remaining < 0 ? "text-red-600" : "text-green-600"
                      }
                    >
                      ${item.remaining.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 