import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// POST: Add new debt
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await dbConnect();
        const { personName, amount, description, dueDate } = await req.json();

        // MongoDB $push operation
        await User.findByIdAndUpdate(session.user.id, {
            $push: {
                debts: {
                    personName,
                    amount,
                    description,
                    dueDate,
                    isPaid: false
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add debt" }, { status: 500 });
    }
}

// PATCH: Mark as Paid
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    try {
        await dbConnect();
        const body = await req.json();

        await User.updateOne(
            { _id: session.user.id, "debts._id": id },
            {
                $set: { "debts.$.isPaid": body.isPaid }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update debt" }, { status: 500 });
    }
}

// DELETE: Remove debt
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        await dbConnect();
        await User.findByIdAndUpdate(session.user.id, {
            $pull: { debts: { _id: id } }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete debt" }, { status: 500 });
    }
}
