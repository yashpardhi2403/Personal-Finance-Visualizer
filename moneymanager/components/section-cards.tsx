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

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Balance */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Total Balance</div>
          <IconWallet className="text-emerald-700" />
        </div>
        <div className="mt-2 text-3xl font-bold">₹12,580.00</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">+₹1,245.00 from last month</div>
      </div>
      {/* Income */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Income</div>
          <IconTrendingUp className="text-emerald-700" />
        </div>
        <div className="mt-2 text-3xl font-bold">₹4,395.00</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">+12.5% from last month</div>
      </div>
      {/* Expenses */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Expenses</div>
          <IconTrendingDown className="text-rose-600" />
        </div>
        <div className="mt-2 text-3xl font-bold">₹2,150.00</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">-3.2% from last month</div>
      </div>
      {/* Savings Rate */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[120px]">
        <div className="flex items-start justify-between">
          <div className="text-base font-semibold">Savings Rate</div>
          <IconTrendingUp className="text-emerald-700" />
        </div>
        <div className="mt-2 text-3xl font-bold">51.1%</div>
        <div className="mt-1 text-sm text-muted-foreground font-medium">+4.3% from last month</div>
      </div>
    </div>
  )
}
