"use client"

import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

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

const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Pink
]

interface ExpenseCategoryData {
  category: string
  amount: number
  percentage: number
}

interface ExpenseCategoryPieChartProps {
  data: ExpenseCategoryData[]
  title?: string
  description?: string
}

const chartConfig = {
  Food: { label: "Food", color: "#3B82F6" },
  Transport: { label: "Transport", color: "#EF4444" },
  Shopping: { label: "Shopping", color: "#10B981" },
  Health: { label: "Health", color: "#F59E0B" },
  Utilities: { label: "Utilities", color: "#8B5CF6" },
  Entertainment: { label: "Entertainment", color: "#F97316" },
  Rent: { label: "Rent", color: "#06B6D4" },
  Other: { label: "Other", color: "#84CC16" },
} satisfies ChartConfig

export function ExpenseCategoryPieChart({
  data,
  title = "Expense Breakdown",
  description = "Spending by category",
}: ExpenseCategoryPieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[300px] w-full"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
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
          </PieChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">{item.category}</span>
              <span className="ml-auto font-medium">
                ₹{item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 