import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { personName, amount, description, dueDate } = await request.json();

    await dbConnect();
    console.log("Saving debt for user:", session.user.id);
    const user = await User.findById(session.user.id);
    if (!user) {
        console.error("User not found");
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.debts) user.debts = [];
    console.log("Pushing debt:", { personName, amount, description, dueDate });
    user.debts.push({ personName, amount, description, dueDate });

    const savedUser = await user.save();
    console.log("Saved user debts:", savedUser.debts);

    return NextResponse.json({ success: true, data: savedUser.debts });
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { debtId, isPaid } = await request.json();

    await dbConnect();
    const user = await User.findOneAndUpdate(
        { _id: session.user.id, "debts._id": debtId },
        { $set: { "debts.$.isPaid": isPaid } },
        { new: true }
    );

    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, {
        $pull: { debts: { _id: id } }
    });

    return NextResponse.json({ success: true });
}
