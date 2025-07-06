import { NextResponse } from 'next/server';
import '@/lib/db';
import Budget from '@/lib/models/Budget';

export async function GET(req: Request) {
  try {
    // Optional: filter by month query parameter
    const url = new URL(req.url);
    const month = url.searchParams.get('month');
    const filter = month ? { month } : {};
    const budgets = await Budget.find(filter).sort({ month: -1 }).lean();
    return NextResponse.json(budgets);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const budget = await Budget.create(data);
    return NextResponse.json(budget, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
