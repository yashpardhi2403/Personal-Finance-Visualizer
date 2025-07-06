"use client"

import * as React from "react"
import {
  Cell,
  Pie,
  PieChart,
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
import { Progress } from "@/components/ui/progress"

interface SavingsGoalData {
  goalName: string
  targetAmount: number
  currentAmount: number
  percentage: number
  deadline: string
  category: string
}

interface SavingsGoalProgressChartProps {
  data: SavingsGoalData[]
  title?: string
  description?: string
}

const chartConfig = {
  current: {
    label: "Current Savings",
    color: "#10B981", // Green
  },
  remaining: {
    label: "Remaining",
    color: "#E5E7EB", // Gray
  },
} satisfies ChartConfig

const CATEGORY_COLORS = {
  emergency: "#EF4444", // Red
  vacation: "#3B82F6", // Blue
  house: "#10B981", // Green
  car: "#F59E0B", // Yellow
  education: "#8B5CF6", // Purple
  retirement: "#06B6D4", // Cyan
  other: "#84CC16", // Lime
}

export function SavingsGoalProgressChart({
  data,
  title = "Savings Goals",
  description = "Progress towards your financial goals",
}: SavingsGoalProgressChartProps) {
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null)

  const selectedGoalData = selectedGoal 
    ? data.find(goal => goal.goalName === selectedGoal)
    : null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.other
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Goals List */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.map((goal) => {
            const daysRemaining = getDaysRemaining(goal.deadline)
            const isOverdue = daysRemaining < 0
            const isSelected = selectedGoal === goal.goalName

            return (
              <div
                key={goal.goalName}
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/50'
                }`}
                onClick={() => setSelectedGoal(goal.goalName)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{goal.goalName}</h4>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(goal.category) }}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{goal.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={goal.percentage} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">
                      of {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Deadline</span>
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      {isOverdue 
                        ? `${Math.abs(daysRemaining)} days overdue`
                        : `${daysRemaining} days remaining`
                      }
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Selected Goal Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedGoalData ? selectedGoalData.goalName : "Select a Goal"}
          </CardTitle>
          <CardDescription>
            {selectedGoalData 
              ? `Progress towards ${formatCurrency(selectedGoalData.targetAmount)}`
              : "Click on a goal to see detailed progress"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedGoalData ? (
            <div className="space-y-6">
              {/* Pie Chart */}
              <ChartContainer
                config={chartConfig}
                className="aspect-square h-[200px] w-full"
              >
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'current',
                        value: selectedGoalData.currentAmount,
                        fill: getCategoryColor(selectedGoalData.category)
                      },
                      {
                        name: 'remaining',
                        value: Math.max(0, selectedGoalData.targetAmount - selectedGoalData.currentAmount),
                        fill: '#E5E7EB'
                      }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell key="current" fill={getCategoryColor(selectedGoalData.category)} />
                    <Cell key="remaining" fill="#E5E7EB" />
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          name === 'current' ? 'Saved' : 'Remaining',
                        ]}
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>

              {/* Goal Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedGoalData.targetAmount)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Saved</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedGoalData.currentAmount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Remaining</span>
                    <span className="font-medium">
                      {formatCurrency(Math.max(0, selectedGoalData.targetAmount - selectedGoalData.currentAmount))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {selectedGoalData.percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Deadline</span>
                    <span className="font-medium">
                      {new Date(selectedGoalData.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Monthly Savings Needed */}
                {selectedGoalData.percentage < 100 && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm font-medium mb-1">Monthly Savings Needed</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(
                        Math.max(0, selectedGoalData.targetAmount - selectedGoalData.currentAmount) / 
                        Math.max(1, Math.ceil(getDaysRemaining(selectedGoalData.deadline) / 30))
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      to reach your goal on time
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center text-muted-foreground">
              <p>Select a savings goal to view progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 