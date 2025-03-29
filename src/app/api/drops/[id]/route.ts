import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Drop } from '@/models/Drop';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const drop = await Drop.findById(params.id);

    if (!drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    return NextResponse.json(drop);
  } catch (error) {
    console.error('Error fetching drop:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drop' },
      { status: 500 }
    );
  }
} 