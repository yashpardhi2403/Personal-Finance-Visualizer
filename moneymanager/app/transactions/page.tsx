"use client";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  "All Transactions",
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Utilities",
  "Entertainment",
  "Rent",
  "Salary",
  "Other",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Transactions");
  const [loading, setLoading] = useState(true);
  const [autoLoaded, setAutoLoaded] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/transactions");
        const data = await response.json();
        
        // If no transactions exist and we haven't auto-loaded yet, load sample data
        if (data.length === 0 && !autoLoaded) {
          console.log("No transactions found, auto-loading sample data...");
          await handlePopulateDummyData();
          setAutoLoaded(true);
        } else {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [autoLoaded]);

  const handlePopulateDummyData = async () => {
    try {
      const response = await fetch("/api/test-db", { method: "POST" });
      if (response.ok) {
        const transactionsResponse = await fetch("/api/transactions");
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);
      }
    } catch (error) {
      console.error("Error populating dummy data:", error);
    }
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All Transactions" || t.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-6 bg-muted/50">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <span className="rounded bg-amber-100 px-4 py-2 text-amber-800 text-sm font-medium shadow-sm">You Can filter Transaction data</span>
            </div>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800 font-medium">Loading sample data...</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {!loading && filtered.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No transactions found.</div>
            )}
            {filtered.map((t) => (
              <Card key={t._id} className="flex flex-row items-center px-4 py-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mr-4">
                  {/* Icon based on type or category */}
                  {t.type === "income" ? (
                    <span className="text-green-600 text-xl">↑</span>
                  ) : (
                    <span className="text-red-500 text-xl">↓</span>
                  )}
                </div>
                <CardContent className="flex flex-1 flex-col px-0">
                  <div className="font-semibold text-base">{t.description}</div>
                  <div className="text-xs text-muted-foreground flex gap-2 mb-1">
                    <span>{new Date(t.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{t.category}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <div><span className="font-medium">Amount:</span> ₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div><span className="font-medium">Type:</span> {t.type.charAt(0).toUpperCase() + t.type.slice(1)}</div>
                    <div><span className="font-medium">Created:</span> {t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</div>
                    <div><span className="font-medium">Updated:</span> {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '-'}</div>
                  </div>
                </CardContent>
                <div className="flex flex-col items-end min-w-[100px]">
                  <span className={t.type === "income" ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                    {t.type === "income" ? "+" : "-"}
                    ₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs mt-1 px-2 py-0.5 rounded bg-muted-foreground/10 text-muted-foreground">
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 