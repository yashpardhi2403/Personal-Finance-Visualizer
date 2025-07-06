import { NextResponse } from 'next/server';
import '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Budget from '@/lib/models/Budget';
import { generateConsistentDummyData } from '@/lib/dummy-data';

export async function POST() {
  try {
    // Clear existing data
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    
    // Generate consistent dummy data from a single financial profile
    const dummyData = generateConsistentDummyData();
    
    // Insert transactions (remove _id field as MongoDB will generate it)
    const transactionsToInsert = dummyData.transactions.map(t => ({
      amount: t.amount,
      description: t.description,
      category: t.category,
      date: t.date,
      type: t.type,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));
    
    const insertedTransactions = await Transaction.insertMany(transactionsToInsert);
    
    // Insert budgets (remove _id field as MongoDB will generate it)
    const budgetsToInsert = dummyData.budgets.map(b => ({
      category: b.category,
      amount: b.amount,
      spent: b.spent,
      month: b.month
    }));
    
    const insertedBudgets = await Budget.insertMany(budgetsToInsert);
    
    return NextResponse.json({
      message: 'Dummy data populated successfully',
      transactions: {
        count: insertedTransactions.length,
        sample: insertedTransactions.slice(0, 3)
      },
      budgets: {
        count: insertedBudgets.length,
        sample: insertedBudgets.slice(0, 3)
      }
    }, { status: 201 });
    
  } catch (err) {
    console.error('Error populating dummy data:', err);
    return NextResponse.json({ 
      error: 'Failed to populate dummy data',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const transactionCount = await Transaction.countDocuments();
    const budgetCount = await Budget.countDocuments();
    
    return NextResponse.json({
      message: 'Database status',
      transactions: {
        count: transactionCount,
        hasData: transactionCount > 0
      },
      budgets: {
        count: budgetCount,
        hasData: budgetCount > 0
      }
    });
    
  } catch (err) {
    console.error('Error checking database status:', err);
    return NextResponse.json({ 
      error: 'Failed to check database status',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
