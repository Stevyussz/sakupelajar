import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { category } = await request.json();

    if (!category) {
        return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });
    }

    try {
        const user = await User.findById(session.user.id);

        // Remove budget for category
        user.budgets = user.budgets.filter((b: any) => b.category !== category);

        await user.save();

        return NextResponse.json({ success: true, data: user.budgets });
    } catch (error) {
        console.error('Error deleting budget:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete budget' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { category, limit, period = 'monthly' } = await request.json();

    if (!category || !limit) {
        return NextResponse.json({ success: false, error: 'Category and limit are required' }, { status: 400 });
    }

    try {
        const user = await User.findById(session.user.id);
        // If user is not found, the subsequent access to user.budgets will throw an error,
        // which will be caught by the catch block.

        // Check if budget for category exists
        const existingBudgetIndex = user.budgets.findIndex((b: any) => b.category === category);

        if (existingBudgetIndex > -1) {
            // Update existing
            user.budgets[existingBudgetIndex].limit = limit;
            user.budgets[existingBudgetIndex].period = period;
        } else {
            // Add new
            if (!user.budgets) user.budgets = [];
            user.budgets.push({ category, limit, period, spent: 0 });
        }

        await user.save();

        return NextResponse.json({ success: true, data: user.budgets });
    } catch (error) {
        console.error('Error updating budget:', error);
        return NextResponse.json({ success: false, error: 'Failed to update budget' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    try {
        const user = await User.findById(session.user.id).lean();
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        // Calculate spent amount dynamically based on period
        const budgetWithStats = await Promise.all(user.budgets.map(async (b: any) => {
            const now = new Date();
            let startDate = new Date();

            if (b.period === 'daily') {
                startDate.setHours(0, 0, 0, 0); // Start of today
            } else if (b.period === 'weekly') {
                const day = startDate.getDay() || 7;
                if (day !== 1) startDate.setHours(-24 * (day - 1));
                startDate.setHours(0, 0, 0, 0); // Start of week (rough approx for now)
            } else {
                startDate.setDate(1); // Start of month
                startDate.setHours(0, 0, 0, 0);
            }

            const result = await Transaction.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(session.user.id),
                        kategori: b.category,
                        jumlah: { $lt: 0 },
                        tanggal: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSpent: { $sum: { $abs: "$jumlah" } }
                    }
                }
            ]);

            return {
                ...b,
                spent: result[0]?.totalSpent || 0
            };
        }));

        return NextResponse.json({ success: true, data: budgetWithStats });
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch budgets' }, { status: 500 });
    }
