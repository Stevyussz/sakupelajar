'use client';

import { motion } from 'framer-motion';
import { Award, Lock, Zap, TrendingUp, PiggyBank, Wallet } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    condition: (stats: UserStats) => boolean;
}

interface UserStats {
    level: string; // "Novice Saver", etc. can be mapped to number if needed, or check string
    totalXP: number;
    streakBest: number;
    totalSavings: number;
    transactionCount: number;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'newbie',
        title: 'Newbie Saver',
        description: 'Reach 100 XP',
        icon: User, // Will replace with Lucide icon in map
        color: 'text-blue-500 bg-blue-100',
        condition: (s) => s.totalXP >= 100
    },
    {
        id: 'streak_7',
        title: 'On Fire!',
        description: 'Achieve a 7-day login streak',
        icon: Zap,
        color: 'text-orange-500 bg-orange-100',
        condition: (s) => s.streakBest >= 7
    },
    {
        id: 'saver_100k',
        title: 'Pocket Money',
        description: 'Save a total of Rp 100.000',
        icon: PiggyBank,
        color: 'text-green-500 bg-green-100',
        condition: (s) => s.totalSavings >= 100000
    },
    {
        id: 'active_user',
        title: 'Financial Analyst',
        description: 'Record 50 Transactions',
        icon: TrendingUp,
        color: 'text-purple-500 bg-purple-100',
        condition: (s) => s.transactionCount >= 50
    },
    {
        id: 'millionaire',
        title: 'The Millionaire',
        description: 'Save a total of Rp 1.000.000',
        icon: Wallet,
        color: 'text-yellow-600 bg-yellow-100',
        condition: (s) => s.totalSavings >= 1000000
    },
    {
        id: 'pro_streak',
        title: 'Consistency King',
        description: 'Achieve a 30-day login streak',
        icon: Award,
        color: 'text-red-500 bg-red-100',
        condition: (s) => s.streakBest >= 30
    }
];

import { User } from 'lucide-react'; // Fix local import

export function AchievementsWidget({ stats }: { stats: UserStats }) {
    // Calculate progress
    const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(stats)).length;
    const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Achievements</h3>
                        <p className="text-xs text-slate-500">{unlockedCount} / {ACHIEVEMENTS.length} Unlocked</p>
                    </div>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = achievement.condition(stats);
                    const Icon = achievement.icon;

                    return (
                        <div
                            key={achievement.id}
                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${isUnlocked
                                    ? 'bg-white border-slate-100 shadow-sm'
                                    : 'bg-slate-50 border-transparent opacity-60 grayscale'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isUnlocked ? achievement.color : 'bg-slate-200 text-slate-400'
                                }`}>
                                {isUnlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {achievement.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    {achievement.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
