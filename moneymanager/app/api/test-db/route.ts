import { NextResponse } from 'next/server';
import mongoose from '@/lib/db';

export async function GET() {
  try {
    const status = mongoose.connection.readyState;
    const message = status === 1 ? '✅ Connected to MongoDB Atlas' : '❌ Not connected';

    return NextResponse.json({
      connectionState: status, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      message,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect' }, { status: 500 });
  }
}
