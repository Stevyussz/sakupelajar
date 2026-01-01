import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();

        // 1. Delete all transactions
        await Transaction.deleteMany({ userId: session.user.id });

        // 2. Reset User Fields (Budgets, Wishlist, Debts, Exp)
        await User.findByIdAndUpdate(session.user.id, {
            $set: {
                budgets: [],
                wishlist: [],
                debts: [],
                experience: 0,
                level: 'Novice Saver'
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to reset data" }, { status: 500 });
    }
}
