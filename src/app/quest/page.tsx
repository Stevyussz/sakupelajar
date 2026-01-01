import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { QuestWidget } from "@/components/Gamification/QuestWidget";
import { StreakCalendar } from "@/components/Gamification/StreakCalendar";
import { Leaderboard } from "@/components/Gamification/Leaderboard";
import { AchievementsWidget } from "@/components/Gamification/AchievementsWidget";
import { Trophy, Star, Gamepad2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function QuestPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) redirect('/login');

    // Fetch Stats for Achievements
    const transactions = await Transaction.find({ userId: session.user.id });
    const transactionCount = transactions.length;
    const totalSavings = transactions.reduce((acc, t) => acc + t.jumlah, 0);

    const streak = user.streak?.current || 0;
    const lastLogin = user.streak?.lastLogin || null;

    return (
        <div className="p-6 md:p-8 pb-24 md:pb-8 space-y-8 max-w-5xl mx-auto">

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white overflow-hidden shadow-xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                    <Gamepad2 className="w-64 h-64 -mr-10 -mt-10" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                            Game Center
                        </span>
                        <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-current" /> Premium Member
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-2">Daily Quests</h1>
                    <p className="text-indigo-100 max-w-lg">
                        Complete missions, earn XP, and level up your financial journey. Keep your streak alive to unlock exclusive rewards!
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Streaks & XP */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
                            <Trophy className="w-24 h-24" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Total XP Earned</h3>
                        <p className="text-4xl font-black">{user.experience || 0} XP</p>
                        <p className="text-xs font-medium opacity-80 mt-2">Level: {user.level}</p>
                    </div>

                    <StreakCalendar streak={streak} lastLogin={lastLogin} />
                </div>

                {/* Right Column: Quests, Leaderboard, Achievements */}
                <div className="md:col-span-2 space-y-6">
                    {/* XP Store Banner */}
                    <Link href="/quest/shop" className="block relative group overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-900/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90 group-hover:opacity-100 transition duration-300" />
                        <div className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full blur-2xl" />

                        <div className="relative p-6 flex items-center justify-between text-white">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded text-uppercase tracking-wider">NEW</span>
                                    <h3 className="font-bold text-lg">XP Store</h3>
                                </div>
                                <p className="text-indigo-100 text-sm max-w-[200px]">Spend your XP on exclusive avatars and rewards!</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:scale-110 transition duration-300">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-1">
                        <QuestWidget />
                    </div>

                    <Leaderboard currentUserId={session.user.id} />

                    <AchievementsWidget
                        stats={{
                            level: user.level,
                            totalXP: user.experience || 0,
                            streakBest: user.streak?.best || 0,
                            totalSavings,
                            transactionCount
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
