import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { itemName, targetAmount } = await request.json();

    if (!itemName || !targetAmount) {
        return NextResponse.json({ error: 'Data incomplete' }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    user.wishlist.push({ itemName, targetAmount, savedAmount: 0 });
    await user.save();

    return NextResponse.json({ success: true, data: user.wishlist });
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id, amount } = await request.json();

    const user = await User.findOneAndUpdate(
        { _id: session.user.id, "wishlist._id": id },
        { $inc: { "wishlist.$.savedAmount": amount } },
        { new: true }
    );

    return NextResponse.json({ success: true, data: user.wishlist });
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id);
    return NextResponse.json({ success: true, data: user.wishlist });
}
