"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [populating, setPopulating] = useState(false);

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      setError(null);
      try {
        const month = getCurrentMonth();
        const res = await fetch(`/api/budgets?month=${month}`);
        if (!res.ok) throw new Error("Failed to fetch budgets");
        const data = await res.json();
        setBudgets(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  const handlePopulateDummyData = async () => {
    setPopulating(true);
    try {
      const response = await fetch("/api/test-db", { method: "POST" });
      if (response.ok) {
        // Refresh budgets after populating
        const month = getCurrentMonth();
        const budgetsResponse = await fetch(`/api/budgets?month=${month}`);
        const budgetsData = await budgetsResponse.json();
        setBudgets(budgetsData);
      }
    } catch (error) {
      console.error("Error populating dummy data:", error);
    } finally {
      setPopulating(false);
    }
  };

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
        <div className="flex flex-1 flex-col p-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-3xl font-bold mb-2">Budgets</h1>
            <p className="text-muted-foreground mb-6">Set and track your monthly spending limits</p>
          </div>
          
          {/* Dummy Data Button */}
          {!loading && budgets.length === 0 && (
            <div className="px-4 lg:px-6 mb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-amber-800 font-medium">No Budgets Found</h3>
                    <p className="text-amber-700 text-sm mt-1">
                      Populate the database with sample budgets to see the data.
                    </p>
                  </div>
                  <Button 
                    onClick={handlePopulateDummyData}
                    disabled={populating}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {populating ? "Loading..." : "Load Sample Data"}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-4 lg:px-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : budgets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No budgets found for this month.</div>
            ) : (
              <>
                {/* Budget Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {(() => {
                    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
                    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
                    const totalRemaining = totalBudget - totalSpent;
                    const overallProgress = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
                    const overBudgetCount = budgets.filter(b => (b.spent / b.amount) > 1).length;
                    
                    return (
                      <>
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Budget</p>
                              <p className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Spent</p>
                              <p className="text-lg font-semibold">₹{totalSpent.toLocaleString()}</p>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Remaining</p>
                              <p className={`text-2xl font-bold ${totalRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₹{Math.abs(totalRemaining).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Progress</p>
                              <p className="text-lg font-semibold">{overallProgress}%</p>
                            </div>
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Categories</p>
                              <p className="text-2xl font-bold">{budgets.length}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Over Budget</p>
                              <p className={`text-lg font-semibold ${overBudgetCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {overBudgetCount}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </>
                    );
                  })()}
                </div>
                
                                {/* Individual Budget Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {budgets.map((budget) => {
                    const percentUsed = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
                    const remaining = budget.amount - budget.spent;
                    const isOverBudget = percentUsed > 100;
                    
                    return (
                      <Card key={budget._id} className="p-6">
                        <CardHeader className="p-0 pb-4">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-semibold">{budget.category}</CardTitle>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                ₹{budget.spent.toLocaleString()} / ₹{budget.amount.toLocaleString()}
                              </div>
                              <div className={`text-xs ${isOverBudget ? 'text-red-600' : 'text-muted-foreground'}`}>
                                {percentUsed}% used
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="space-y-3">
                            <div className={`w-full h-3 rounded-full overflow-hidden ${isOverBudget ? 'bg-red-100' : 'bg-gray-100'}`}>
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isOverBudget 
                                    ? 'bg-red-500' 
                                    : percentUsed > 80 
                                      ? 'bg-yellow-500' 
                                      : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(percentUsed, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {remaining > 0
                                  ? `₹${remaining.toLocaleString()} remaining`
                                  : `₹${Math.abs(remaining).toLocaleString()} over budget`}
                              </span>
                              <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                                {isOverBudget ? 'Over Budget' : 'On Track'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 