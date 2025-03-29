import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import connectDB from '@/lib/mongodb';
import { Drop } from '@/models/Drop';
import { MintLink } from '@/models/MintLink';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { userAddress } = body;

    // Verify drop exists and user owns it
    const drop = await Drop.findById(params.id);
    if (!drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    if (drop.userAddress !== userAddress) {
      return NextResponse.json(
        { error: 'Unauthorized to generate mint links for this drop' },
        { status: 403 }
      );
    }

    // Generate unique ID and set expiration (7 days from now)
    const uniqueId = nanoid(12);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create mint link
    const mintLink = await MintLink.create({
      dropId: params.id,
      uniqueId,
      expiresAt,
    });

    return NextResponse.json(mintLink);
  } catch (error) {
    console.error('Error generating mint link:', error);
    return NextResponse.json(
      { error: 'Failed to generate mint link' },
      { status: 500 }
    );
  }
} 