import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Drop } from '@/models/Drop';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    let query = {};
    if (userAddress) {
      query = { userAddress };
    }

    const drops = await Drop.find(query).sort({ createdAt: -1 });
    return NextResponse.json(drops);
  } catch (error) {
    console.error('Error fetching drops:', error);
    return NextResponse.json({ error: 'Failed to fetch drops' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const drop = await Drop.create(body);
    return NextResponse.json(drop, { status: 201 });
  } catch (error) {
    console.error('Error creating drop:', error);
    return NextResponse.json({ error: 'Failed to create drop' }, { status: 500 });
  }
} 