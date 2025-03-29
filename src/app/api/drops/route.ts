import { NextResponse } from 'next/server';
import { Drop } from '@/types/drop';

// TODO: Replace with actual database implementation
let drops: Drop[] = [];

export async function GET() {
  return NextResponse.json(drops);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.description || !data.imageUrl || !data.totalSupply) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new drop
    const newDrop: Drop = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      totalSupply: data.totalSupply,
      claimedCount: 0,
      createdAt: new Date().toISOString(),
      chain: 'sui',
      creator: data.creator,
      startDate: data.startDate,
      endDate: data.endDate,
      requirements: data.requirements || [],
    };

    drops.push(newDrop);

    return NextResponse.json(newDrop, { status: 201 });
  } catch (error) {
    console.error('Error creating drop:', error);
    return NextResponse.json(
      { error: 'Failed to create drop' },
      { status: 500 }
    );
  }
} 