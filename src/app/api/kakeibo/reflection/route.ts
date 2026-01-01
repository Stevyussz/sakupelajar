
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { period, content } = await req.json();

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Check if reflection for this period exists
    const existingIndex = user.reflections.findIndex((r: any) => r.period === period);

    if (existingIndex >= 0) {
        user.reflections[existingIndex].content = content;
        user.reflections[existingIndex].createdAt = new Date();
    } else {
        user.reflections.push({ period, content });
    }

    await user.save();

    return NextResponse.json({ success: true, reflections: user.reflections });
}
