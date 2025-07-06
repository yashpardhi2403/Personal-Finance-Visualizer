"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface MonthlyTrendData {
  month: string
  income: number
  expenses: number
  savings: number
  avgDailySpending: number
}

interface MonthlyTrendLineChartProps {
  data: MonthlyTrendData[]
  title?: string
  description?: string
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#10B981", // Green
  },
  expenses: {
    label: "Expenses",
    color: "#EF4444", // Red
  },
  savings: {
    label: "Savings",
    color: "#3B82F6", // Blue
  },
  avgDailySpending: {
    label: "Avg Daily Spending",
    color: "#F59E0B", // Yellow
  },
} satisfies ChartConfig

export function MonthlyTrendLineChart({
  data,
  title = "Monthly Trends",
  description = "Income, expenses, and savings over time",
}: MonthlyTrendLineChartProps) {
  const [chartType, setChartType] = React.useState("line")
  const [metric, setMetric] = React.useState("all")

  const filteredData = React.useMemo(() => {
    if (metric === "all") return data
    
    return data.map(item => ({
      month: item.month,
      [metric]: item[metric as keyof MonthlyTrendData],
    }))
  }, [data, metric])

  const renderChart = () => {
    if (chartType === "area") {
      return (
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
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
          {metric === "all" && (
            <>
              <Area
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                fill="url(#fillIncome)"
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="var(--color-expenses)"
                fill="url(#fillExpenses)"
                stackId="2"
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="var(--color-savings)"
                fill="url(#fillSavings)"
                stackId="3"
              />
            </>
          )}
          {metric !== "all" && (
            <Area
              type="monotone"
              dataKey={metric}
              stroke={`var(--color-${metric})`}
              fill={`url(#fill${metric.charAt(0).toUpperCase() + metric.slice(1)})`}
            />
          )}
        </AreaChart>
      )
    }

    return (
      <LineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
        {metric === "all" && (
          <>
            <Line
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={{ fill: "var(--color-expenses)", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="var(--color-savings)"
              strokeWidth={2}
              dot={{ fill: "var(--color-savings)", strokeWidth: 2, r: 4 }}
            />
          </>
        )}
        {metric !== "all" && (
          <Line
            type="monotone"
            dataKey={metric}
            stroke={`var(--color-${metric})`}
            strokeWidth={2}
            dot={{ fill: `var(--color-${metric})`, strokeWidth: 2, r: 4 }}
          />
        )}
      </LineChart>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={setChartType}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="line">Line</ToggleGroupItem>
              <ToggleGroupItem value="area">Area</ToggleGroupItem>
            </ToggleGroup>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expenses">Expenses</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="avgDailySpending">Daily Spending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-[4/3] h-[300px] w-full"
        >
          {renderChart()}
        </ChartContainer>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Avg Income</p>
            <p className="text-lg font-semibold text-green-600">
              ${(data.reduce((sum, item) => sum + item.income, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              ${(data.reduce((sum, item) => sum + item.expenses, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Savings</p>
            <p className="text-lg font-semibold text-blue-600">
              ${(data.reduce((sum, item) => sum + item.savings, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Daily</p>
            <p className="text-lg font-semibold text-yellow-600">
              ${(data.reduce((sum, item) => sum + item.avgDailySpending, 0) / data.length).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 