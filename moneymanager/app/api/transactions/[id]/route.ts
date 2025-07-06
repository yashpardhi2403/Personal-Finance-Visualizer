import { NextResponse } from 'next/server';
import '@/lib/db';
import Transaction from '@/lib/models/Transaction';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const txn = await Transaction.findById(params.id).lean();
    if (!txn) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(txn);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error fetching transaction' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updated = await Transaction.findByIdAndUpdate(params.id, data, { new: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error updating transaction' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await Transaction.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error deleting transaction' }, { status: 500 });
  }
}
