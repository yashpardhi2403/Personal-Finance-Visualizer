import { NextResponse } from 'next/server';
import '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import { generateDummyTransactions } from '@/lib/dummy-data';

export async function GET() {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).lean();
    
    // If no transactions exist, return dummy data
    if (transactions.length === 0) {
      const dummyTransactions = generateDummyTransactions();
      return NextResponse.json(dummyTransactions);
    }
    
    return NextResponse.json(transactions);
  } catch (err) {
    console.error(err);
    // Return dummy data on error as fallback
    const dummyTransactions = generateDummyTransactions();
    return NextResponse.json(dummyTransactions);
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const transaction = await Transaction.create(data);
    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
