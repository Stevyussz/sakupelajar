import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { XPStore } from "@/components/Gamification/XPStore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function ShopPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) redirect('/login');

    return (
        <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto space-y-6">
            <Link href="/quest" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition mb-4">
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Quests
            </Link>

            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-5xl font-black text-slate-800 mb-2">XP Store</h1>
                <p className="text-slate-500">Spend your hard-earned XP on exclusive avatars!</p>
            </div>

            <XPStore
                unlockedAvatars={user.unlockedAvatars || ['lion']}
                currentAvatar={user.avatarId || 'lion'}
                userXP={user.experience || 0}
            />
        </div>
    );
}
