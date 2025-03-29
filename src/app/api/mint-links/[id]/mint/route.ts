import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { MintLink } from '@/models/MintLink';
import { Drop } from '@/models/Drop';
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { userAddress } = await request.json();
    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const mintLink = await MintLink.findOne({ uniqueId: params.id });
    if (!mintLink) {
      return NextResponse.json(
        { error: 'Mint link not found' },
        { status: 404 }
      );
    }

    if (mintLink.isUsed) {
      return NextResponse.json(
        { error: 'Mint link has already been used' },
        { status: 400 }
      );
    }

    if (new Date(mintLink.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Mint link has expired' },
        { status: 400 }
      );
    }

    const drop = await Drop.findById(mintLink.dropId);
    if (!drop) {
      return NextResponse.json(
        { error: 'Drop not found' },
        { status: 404 }
      );
    }

    // Update mint link status
    mintLink.isUsed = true;
    mintLink.usedBy = userAddress;
    mintLink.usedAt = new Date().toISOString();
    await mintLink.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error updating mint link status:', error);
    return NextResponse.json(
      { error: 'Failed to update mint link status' },
      { status: 500 }
    );
  }
} 