import { NextResponse } from 'next/server';
import '@/lib/db';
import Budget from '@/lib/models/Budget';
import { generateDummyBudgets } from '@/lib/dummy-data';

export async function GET(req: Request) {
  try {
    // Optional: filter by month query parameter
    const url = new URL(req.url);
    const month = url.searchParams.get('month');
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter).sort({ month: -1 }).lean();
    
    // If no budgets exist, return dummy data
    if (budgets.length === 0) {
      const dummyBudgets = generateDummyBudgets();
      // Filter dummy budgets by month if specified
      if (month) {
        const filteredDummyBudgets = dummyBudgets.filter(b => b.month === month);
        return NextResponse.json(filteredDummyBudgets);
      }
      return NextResponse.json(dummyBudgets);
    }
    
    return NextResponse.json(budgets);
  } catch (err) {
    console.error(err);
    // Return dummy data on error as fallback
    const dummyBudgets = generateDummyBudgets();
    const url = new URL(req.url);
    const month = url.searchParams.get('month');
    if (month) {
      const filteredDummyBudgets = dummyBudgets.filter(b => b.month === month);
      return NextResponse.json(filteredDummyBudgets);
    }
    return NextResponse.json(dummyBudgets);
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Handle sample data creation
    if (action === 'sample') {
      const sampleData = await createSampleBudgets();
      return NextResponse.json(sampleData, { status: 201 });
    }

    // Regular budget creation
    const data = await req.json();
    const budget = await Budget.create(data);
    return NextResponse.json(budget, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}

async function createSampleBudgets() {
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7); // YYYY-MM format
  
  // Calculate previous month
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthStr = prevMonth.toISOString().slice(0, 7);

  const sampleBudgets = [
    // Current month budgets
    {
      category: 'Food',
      amount: 600,
      spent: 450,
      month: currentMonth
    },
    {
      category: 'Transport',
      amount: 200,
      spent: 180,
      month: currentMonth
    },
    {
      category: 'Shopping',
      amount: 300,
      spent: 250,
      month: currentMonth
    },
    {
      category: 'Health',
      amount: 150,
      spent: 120,
      month: currentMonth
    },
    {
      category: 'Utilities',
      amount: 250,
      spent: 250,
      month: currentMonth
    },
    {
      category: 'Entertainment',
      amount: 200,
      spent: 150,
      month: currentMonth
    },
    {
      category: 'Rent',
      amount: 1200,
      spent: 1200,
      month: currentMonth
    },
    {
      category: 'Salary',
      amount: 4000,
      spent: 0,
      month: currentMonth
    },
    // Previous month budgets
    {
      category: 'Food',
      amount: 550,
      spent: 520,
      month: prevMonthStr
    },
    {
      category: 'Transport',
      amount: 180,
      spent: 175,
      month: prevMonthStr
    },
    {
      category: 'Shopping',
      amount: 250,
      spent: 280,
      month: prevMonthStr
    },
    {
      category: 'Health',
      amount: 120,
      spent: 95,
      month: prevMonthStr
    },
    {
      category: 'Utilities',
      amount: 230,
      spent: 230,
      month: prevMonthStr
    },
    {
      category: 'Entertainment',
      amount: 180,
      spent: 200,
      month: prevMonthStr
    },
    {
      category: 'Rent',
      amount: 1200,
      spent: 1200,
      month: prevMonthStr
    },
    {
      category: 'Salary',
      amount: 4000,
      spent: 0,
      month: prevMonthStr
    }
  ];

  // Clear existing budgets for these months first
  await Budget.deleteMany({ month: { $in: [currentMonth, prevMonthStr] } });
  
  // Create new sample budgets
  const createdBudgets = await Budget.insertMany(sampleBudgets);
  
  return {
    message: 'Sample budgets created successfully',
    count: createdBudgets.length,
    budgets: createdBudgets
  };
}
