import { NextResponse } from 'next/server';
import { Drop } from '@/models/Drop';
import connectDB from '@/lib/mongodb';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { mintConfig, userAddress } = body;

    const drop = await Drop.findById(params.id);
    if (!drop) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    if (drop.userAddress !== userAddress) {
      return NextResponse.json(
        { error: 'Unauthorized to update this drop' },
        { status: 403 }
      );
    }

    // Validate mint config
    if (mintConfig.type === 'link' && !mintConfig.mintLink) {
      return NextResponse.json(
        { error: 'Mint link is required' },
        { status: 400 }
      );
    }

    if (mintConfig.type === 'whitelist' && (!mintConfig.whitelist || mintConfig.whitelist.length === 0)) {
      return NextResponse.json(
        { error: 'Whitelist is required' },
        { status: 400 }
      );
    }

    drop.mintConfig = mintConfig;
    await drop.save();

    return NextResponse.json(drop);
  } catch (error) {
    console.error('Error updating mint configuration:', error);
    return NextResponse.json(
      { error: 'Failed to update mint configuration' },
      { status: 500 }
    );
  }
} 