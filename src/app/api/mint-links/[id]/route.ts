import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { MintLink } from '@/models/MintLink';
import { Drop } from '@/models/Drop';
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const mintLink = await MintLink.findOne({ uniqueId: params.id });
    if (!mintLink) {
      return NextResponse.json(
        { error: 'Mint link not found' },
        { status: 404 }
      );
    }

    const drop = await Drop.findById(mintLink.dropId);
    if (!drop) {
      return NextResponse.json(
        { error: 'Drop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...mintLink.toObject(),
      drop: drop.toObject(),
    });
  } catch (error) {
    console.error('Error validating mint link:', error);
    return NextResponse.json(
      { error: 'Failed to validate mint link' },
      { status: 500 }
    );
  }
} 