import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();

        // Fetch top 50 users (to be safe, display top 10 on UI)
        // Sort by Experience (Desc), then Streak (Desc) as tiebreaker
        // Fetch top 50 users (to be safe, display top 10 on UI)
        // Sort by Experience (Desc), then Streak (Desc) as tiebreaker
        const users = await User.find({})
            .select('name level experience avatarId streak')
            .sort({ experience: -1, 'streak.current': -1 })
            .limit(50)
            .lean();

        console.log(`Leaderboard: Found ${users.length} users`);

        // Normalize data for frontend
        const leaderboard = users.map((user: any) => ({
            id: user._id.toString(),
            name: user.name || 'Anonymous',
            level: user.level || 'Novice Saver',
            experience: user.experience || 0,
            avatarId: user.avatarId || 'lion',
            streak: user.streak?.current || 0
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
