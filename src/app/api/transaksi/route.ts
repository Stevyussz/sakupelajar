import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const transactions = await Transaction.find({ userId: session.user.id }).sort({ tanggal: -1 });
    return NextResponse.json({ success: true, data: transactions });
}

import User from '@/models/User';

const STANDARD_CATEGORIES = ['Makanan', 'Transport', 'Belanja', 'Edukasi', 'Hiburan', 'Lainnya'];

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();

    if (!body.judul || !body.jumlah) {
        return NextResponse.json({ success: false, error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Save custom category if applicable
    const category = body.kategori;
    if (category && !STANDARD_CATEGORIES.includes(category)) {
        console.log(`[Transaction API] Detected custom category: ${category}. Fetching User to update...`);
        try {
            const user = await User.findById(session.user.id);
            if (user) {
                if (!user.customCategories.includes(category)) {
                    user.customCategories.push(category);
                    await user.save();
                    console.log(`[Transaction API] Custom category '${category}' saved successfully.`);
                } else {
                    console.log(`[Transaction API] Category '${category}' already exists.`);
                }
            } else {
                console.error(`[Transaction API] User not found with ID: ${session.user.id}`);
            }
        } catch (error) {
            console.error(`[Transaction API] Error saving category:`, error);
        }
    }

    // Auto-map Kakeibo Pillar if not provided
    if (!body.kakeiboPillar) {
        const cat = body.kategori?.toLowerCase() || '';
        const title = body.judul?.toLowerCase() || '';
        const combined = cat + ' ' + title;

        if (['makanan', 'transport', 'kost', 'tagihan', 'kesehatan', 'listrik', 'air', 'kuota'].some(c => combined.includes(c))) body.kakeiboPillar = 'survival';
        else if (['edukasi', 'buku', 'kursus', 'donasi', 'belajar', 'les'].some(c => combined.includes(c))) body.kakeiboPillar = 'culture';
        else if (['hiburan', 'jajan', 'game', 'hobi', 'belanja', 'jalan', 'nonton'].some(c => combined.includes(c))) body.kakeiboPillar = 'optional';
        else body.kakeiboPillar = 'extra';
    }

    // Create transaction linked to user
    const transaction = await Transaction.create({ ...body, userId: session.user.id });

    // CHECK QUESTS & GAMIFICATION
    try {
        const user = await User.findById(session.user.id);
        if (user && user.quests) {
            let questUpdated = false;
            const isInc = body.jumlah > 0;
            const amount = Math.abs(body.jumlah);

            user.quests.forEach((q: any) => {
                if (!q.claimed) {
                    // 1. Transaction Count Quest
                    if (q.type === 'add_transaction') {
                        q.progress += 1;
                        questUpdated = true;
                    }
                    // 2. Savings Quest (Target: Accumulate X amount of income)
                    else if (q.type === 'save_money' && isInc) {
                        q.progress += amount;
                        questUpdated = true;
                    }
                    // 3. Spending Quest (Target: Spend X amount) - usually for "Spending Challenges"
                    else if (q.type === 'spend_money' && !isInc) {
                        q.progress += amount;
                        questUpdated = true;
                    }
                }
            });

            if (questUpdated) {
                await user.save();
            }
        }
    } catch (error) {
        console.error("Quest update error:", error);
    }

    return NextResponse.json({ success: true, data: transaction });
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
        return NextResponse.json({ success: false, error: 'Transaction ID required' }, { status: 400 });
    }

    // Ensure user owns the transaction
    const transaction = await Transaction.findOne({ _id, userId: session.user.id });
    if (!transaction) {
        return NextResponse.json({ success: false, error: 'Transaction not found or unauthorized' }, { status: 404 });
    }

    // Save custom category if applicable (Reuse logic)
    const category = updateData.kategori;
    if (category && !STANDARD_CATEGORIES.includes(category)) {
        try {
            const user = await User.findById(session.user.id);
            if (user && !user.customCategories.includes(category)) {
                user.customCategories.push(category);
                await user.save();
            }
        } catch (e) {
            console.error("Failed to save custom category on update", e);
        }
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedTransaction });
}