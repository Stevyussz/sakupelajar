import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, itemId, cost } = await req.json(); // action: 'buy' | 'equip'

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (action === 'buy') {
        if (user.unlockedAvatars.includes(itemId)) {
            return NextResponse.json({ error: "Already owned" }, { status: 400 });
        }
        if (user.experience < cost) {
            return NextResponse.json({ error: "Not enough XP" }, { status: 400 });
        }

        user.experience -= cost;
        user.unlockedAvatars.push(itemId);
        await user.save();

        return NextResponse.json({ success: true, experience: user.experience, unlockedAvatars: user.unlockedAvatars });
    }

    if (action === 'equip') {
        if (!user.unlockedAvatars.includes(itemId)) {
            return NextResponse.json({ error: "Item not owned" }, { status: 400 });
        }

        user.avatarId = itemId;
        await user.save();
        return NextResponse.json({ success: true, avatarId: user.avatarId });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
