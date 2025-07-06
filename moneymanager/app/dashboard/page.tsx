"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { IncomeExpenseBarChart } from "@/components/charts/income-expense-bar"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TransactionForm } from "@/components/transaction-form";
import { useState, useEffect } from "react";

import data from "./data.json"
import { transformToMonthlyIncomeExpense } from "@/lib/chart-utils";
import { generateDummyChartData } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  useEffect(() => {
    setLoading(true);
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .finally(() => setLoading(false));
  }, []);

  // Handler for after adding a transaction
  const handleTransactionAdded = () => {
    setOpen(false);
    setLoading(true);
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .finally(() => setLoading(false));
  };

  // Handler for populating dummy data
  const handlePopulateDummyData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-db", { method: "POST" });
      if (response.ok) {
        // Refresh transactions after populating
        const transactionsResponse = await fetch("/api/transactions");
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error("Error populating dummy data:", error);
    } finally {
      setLoading(false);
    }
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" onAddTransaction={() => setOpen(true)} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Dummy Data Button */}
              {safeTransactions.length === 0 && (
                <div className="px-4 lg:px-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-amber-800 font-medium">No Data Available</h3>
                        <p className="text-amber-700 text-sm mt-1">
                          Populate the database with sample data to see the dashboard in action.
                        </p>
                      </div>
                      <Button 
                        onClick={handlePopulateDummyData}
                        disabled={loading}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {loading ? "Loading..." : "Load Sample Data"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <SectionCards transactions={safeTransactions} />
              <div className="px-4 lg:px-6">
                <IncomeExpenseBarChart data={
                  safeTransactions.length > 0 
                    ? transformToMonthlyIncomeExpense(safeTransactions, 8)
                    : generateDummyChartData()
                } />
              </div>
              {/* Recent Transactions Cards */}
              <div className="px-4 lg:px-6 mt-6">
                <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
                {loading ? (
                  <div className="text-muted-foreground py-8">Loading...</div>
                ) : safeTransactions.length === 0 ? (
                  <div className="text-muted-foreground py-8">No transactions found.</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {safeTransactions.slice(0, 5).map((t: any) => (
                      <div key={t._id} className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${t.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                          {t.type === "income" ? (
                            <span className="text-green-600 text-xl">↑</span>
                          ) : (
                            <span className="text-red-500 text-xl">↓</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base">{t.description}</div>
                          <div className="text-xs text-muted-foreground flex gap-2 mb-1">
                            <span>{new Date(t.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{t.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end min-w-[100px]">
                          <span className={t.type === "income" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                            {t.type === "income" ? "+" : "-"}
                            ₹{t.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs mt-1 px-2 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground">
                            {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="max-w-md w-full">
                  <SheetHeader>
                    <SheetTitle>Add New Transaction</SheetTitle>
                  </SheetHeader>
                  <TransactionForm onSuccess={handleTransactionAdded} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
