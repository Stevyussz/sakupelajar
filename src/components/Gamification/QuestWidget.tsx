'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle, Lock, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Quest {
    id: string;
    description: string;
    target: number;
    progress: number;
    reward: number;
    claimed: boolean;
}

export function QuestWidget({ isMobile = false }: { isMobile?: boolean }) {
    const router = useRouter();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState('');
    const [isExpanded, setIsExpanded] = useState(!isMobile); // Default collapsed on mobile

    const fetchQuests = async () => {
        try {
            const res = await fetch('/api/gamification/quests');
            const data = await res.json();
            if (data.quests) setQuests(data.quests);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuests();

        // Countdown Logic
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const claimReward = async (questId: string, reward: number) => {
        const res = await fetch('/api/gamification/quests', {
            method: 'POST',
            body: JSON.stringify({ questId }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            fetchQuests();
            router.refresh(); // Sync server components (Header, Sidebar, Page Stats)
        }
    };

    if (loading) return <div className="p-6 bg-white rounded-3xl animate-pulse h-48 border border-slate-100"></div>;

    const completedCount = quests.filter(q => q.progress >= q.target).length;

    return (
        <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 transition-all overflow-hidden ${isExpanded ? 'p-6' : 'p-4'}`}>
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => isMobile && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-xl text-orange-600 relative">
                        <Target className="w-5 h-5" />
                        {completedCount > 0 && !quests.every(q => q.claimed) && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">Misi Harian</h3>
                        {!isExpanded && <p className="text-xs text-slate-500">{completedCount}/{quests.length} Selesai</p>}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isExpanded && countdown && (
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <Clock className="w-3 h-3" />
                            <span className="tabular-nums">{countdown}</span>
                        </div>
                    )}
                    {isMobile && (
                        <button className="text-slate-400">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 pt-4 border-t border-slate-50 mt-4"
                    >
                        {quests.map((quest) => {
                            const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
                            const isCompleted = quest.progress >= quest.target;

                            return (
                                <div key={quest.id} className="relative group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-slate-700">{quest.description}</span>
                                        <span className="text-xs font-bold text-slate-500">{quest.progress}/{quest.target}</span>
                                    </div>

                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">+{quest.reward} XP</span>
                                        {isCompleted && !quest.claimed ? (
                                            <button
                                                onClick={() => claimReward(quest.id, quest.reward)}
                                                className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-1 animate-bounce"
                                            >
                                                <CheckCircle className="w-3 h-3" /> Klaim
                                            </button>
                                        ) : quest.claimed ? (
                                            <span className="text-xs font-bold text-green-600 flex items-center gap-1 opacity-50">
                                                <CheckCircle className="w-3 h-3" /> Selesai
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Locked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
