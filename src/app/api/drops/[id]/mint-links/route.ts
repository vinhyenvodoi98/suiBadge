import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import connectToDatabase from '@/lib/mongodb';
import { Drop } from '@/models/Drop';
import { MintLink } from '@/models/MintLink';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { userAddress, locationSettings } = await request.json();

    // Verify drop exists and user is authorized
    const drop = await Drop.findOne({ _id: params.id });
    if (!drop) {
      return NextResponse.json(
        { error: 'Drop not found' },
        { status: 404 }
      );
    }

    if (drop.userAddress !== userAddress) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate unique ID for the mint link
    const uniqueId = nanoid(12);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Link expires in 7 days

    // Create mint link with location settings if enabled
    const mintLink = await MintLink.create({
      dropId: params.id,
      uniqueId,
      expiresAt,
      locationSettings: locationSettings || { enabled: false },
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Find all mint links for the given drop ID using the Mongoose model
    const mintLinks = await MintLink.find({ dropId: params.id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    return NextResponse.json(mintLinks);
  } catch (error) {
    console.error('Error fetching mint links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mint links' },
      { status: 500 }
    );
  }
} 