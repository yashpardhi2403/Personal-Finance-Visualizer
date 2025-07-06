import { NextResponse } from 'next/server';
import '@/lib/db';
import Transaction from '@/lib/models/Transaction';

export async function GET() {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).lean();
    return NextResponse.json(transactions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
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
