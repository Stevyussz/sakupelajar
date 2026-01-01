import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateDailyQuests } from "@/lib/quests";

// GET: Fetch Quests (Generate if new day)
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastReset = user.lastQuestReset ? new Date(user.lastQuestReset) : new Date(0);
    lastReset.setHours(0, 0, 0, 0);

    // If it's a new day, reset quests
    if (today > lastReset || user.quests.length === 0) {
        const newQuests = generateDailyQuests();
        user.quests = newQuests;
        user.lastQuestReset = new Date();
        await user.save();
    }

    return NextResponse.json({ quests: user.quests });
}

// POST: Claim Quest Reward
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { questId } = await req.json();

    await dbConnect();
    const user = await User.findById(session.user.id);

    const questIndex = user.quests.findIndex((q: any) => q.id === questId);
    if (questIndex === -1) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

    const quest = user.quests[questIndex];

    if (quest.claimed) return NextResponse.json({ error: "Already claimed" }, { status: 400 });

    // Simple verification (in a real app, verify logic again here)
    if (quest.progress < quest.target) return NextResponse.json({ error: "Quest not completed" }, { status: 400 });

    // Grant Reward
    user.quests[questIndex].claimed = true;
    user.experience += quest.reward;

    // Level Up Logic (Simplified: Every 1000 XP = 1 Level)
    const newLevel = Math.floor(user.experience / 1000) + 1;
    // You could map level names here if you want

    await user.save();

    return NextResponse.json({ success: true, experience: user.experience, quest: user.quests[questIndex] });
}
