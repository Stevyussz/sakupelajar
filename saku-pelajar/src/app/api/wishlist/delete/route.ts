import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
        return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
        session.user.id,
        { $pull: { wishlist: { _id: itemId } } },
        { new: true }
    );

    return NextResponse.json({ success: true, data: user.wishlist });
}
