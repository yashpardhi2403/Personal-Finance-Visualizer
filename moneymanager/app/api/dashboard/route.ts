import { NextResponse } from 'next/server';
import '@/lib/db';
import Transaction from '@/lib/models/Transaction';

export async function GET() {
  try {
    // Get latest 100 transactions and sort by date
    const transactions = await Transaction.find().sort({ date: -1 }).limit(100).lean();

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const recentTransactions = transactions.slice(0, 5);

    const categoryMap = transactions.reduce<Record<string, number>>((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});

    const categoryBreakdown = Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total,
    }));

    return NextResponse.json({
      totalIncome,
      totalExpense,
      recentTransactions,
      categoryBreakdown,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
