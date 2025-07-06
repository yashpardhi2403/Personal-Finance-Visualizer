import { AppSidebar } from "@/components/app-sidebar"
import { IncomeExpenseBarChart } from "@/components/charts/income-expense-bar"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

// Sample income/expense data for the last 12 months
const incomeExpenseData = [
  { period: "Jan", income: 45000, expenses: 32000, net: 13000 },
  { period: "Feb", income: 48000, expenses: 34000, net: 14000 },
  { period: "Mar", income: 52000, expenses: 36000, net: 16000 },
  { period: "Apr", income: 49000, expenses: 33000, net: 16000 },
  { period: "May", income: 55000, expenses: 38000, net: 17000 },
  { period: "Jun", income: 51000, expenses: 35000, net: 16000 },
  { period: "Jul", income: 58000, expenses: 42000, net: 16000 },
  { period: "Aug", income: 54000, expenses: 39000, net: 15000 },
  { period: "Sep", income: 60000, expenses: 41000, net: 19000 },
  { period: "Oct", income: 57000, expenses: 38000, net: 19000 },
  { period: "Nov", income: 62000, expenses: 43000, net: 19000 },
  { period: "Dec", income: 65000, expenses: 45000, net: 20000 },
]

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <IncomeExpenseBarChart data={incomeExpenseData} />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
