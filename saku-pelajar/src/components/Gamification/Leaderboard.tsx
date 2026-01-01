'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, User as UserIcon } from 'lucide-react';

interface LeaderboardUser {
    id: string;
    name: string;
    level: string;
    experience: number;
    avatarId: string;
    streak: number;
}

export function Leaderboard({ currentUserId }: { currentUserId: string }) {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/gamification/leaderboard');
                const data = await res.json();
                if (data.leaderboard) setUsers(data.leaderboard);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getLeague = (xp: number) => {
        if (xp >= 10000) return { name: 'Diamond', color: 'bg-cyan-500', icon: '💎' };
        if (xp >= 5000) return { name: 'Platinum', color: 'bg-indigo-500', icon: '💠' };
        if (xp >= 2000) return { name: 'Gold', color: 'bg-yellow-500', icon: '🥇' };
        if (xp >= 500) return { name: 'Silver', color: 'bg-slate-400', icon: '🥈' };
        return { name: 'Bronze', color: 'bg-orange-700', icon: '🥉' };
    };

    const LeagueBadge = ({ xp }: { xp: number }) => {
        const league = getLeague(xp);
        return (
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${league.color} flex items-center gap-1 shadow-sm`}>
                {league.icon} {league.name}
            </span>
        );
    };

    const AVATARS: Record<string, string> = {
        lion: '🦁', cat: '😼', robot: '🤖', unicorn: '🦄',
        rocket: '🚀', crown: '👑', detective: '🕵️', ninja: '🥷'
    };

    if (loading) return <div className="h-64 bg-white rounded-3xl animate-pulse"></div>;

    const top3 = users.slice(0, 3);
    const rest = users.slice(3, 10);
    const currentUserRank = users.findIndex(u => u.id === currentUserId) + 1;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 pb-2 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800">Global Ranking</h3>
                </div>
                {currentUserRank > 0 && (
                    <div className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                        Your Rank: #{currentUserRank}
                    </div>
                )}
            </div>

            {/* Podium for Top 3 */}
            <div className="flex justify-center items-end gap-2 md:gap-4 p-6 pt-8 pb-8 bg-gradient-to-b from-white to-slate-50">
                {/* 2nd Place */}
                {top3[1] && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-300 shadow-xl bg-white flex items-center justify-center text-3xl md:text-4xl relative z-10">
                            {AVATARS[top3[1].avatarId]}
                            <div className="absolute -bottom-3 bg-slate-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                #2
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="font-bold text-slate-700 text-sm md:text-base leading-tight truncate w-20 md:w-24">{top3[1].name}</p>
                            <p className="text-xs text-slate-400 font-medium">{top3[1].experience} XP</p>
                        </div>
                        <div className="h-16 w-12 md:w-16 bg-slate-200 mt-2 rounded-t-lg opacity-50"></div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className="flex flex-col items-center -mt-6">
                        <div className="absolute -mt-16 animate-bounce">
                            <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 fill-current drop-shadow-lg" />
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 shadow-2xl bg-white flex items-center justify-center text-4xl md:text-5xl relative z-20">
                            {AVATARS[top3[0].avatarId]}
                            <div className="absolute -bottom-3 bg-yellow-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-md">
                                #1
                            </div>
                        </div>
                        <div className="mt-4 text-center relative z-20 flex flex-col items-center">
                            <p className="font-bold text-slate-800 text-base md:text-lg leading-tight truncate w-24 md:w-32">{top3[0].name}</p>
                            <div className="flex gap-1 mt-1">
                                <p className="text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full inline-block">{top3[0].experience} XP</p>
                                <LeagueBadge xp={top3[0].experience} />
                            </div>
                        </div>
                        <div className="h-24 w-16 md:w-20 bg-gradient-to-t from-yellow-200 to-yellow-100 mt-2 rounded-t-lg shadow-inner"></div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-orange-300 shadow-xl bg-white flex items-center justify-center text-3xl md:text-4xl relative z-10">
                            {AVATARS[top3[2].avatarId]}
                            <div className="absolute -bottom-3 bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                #3
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="font-bold text-slate-700 text-sm md:text-base leading-tight truncate w-20 md:w-24">{top3[2].name}</p>
                            <p className="text-xs text-slate-400 font-medium">{top3[2].experience} XP</p>
                        </div>
                        <div className="h-10 w-12 md:w-16 bg-orange-100 mt-2 rounded-t-lg opacity-50"></div>
                    </div>
                )}
            </div>

            {/* List for Rank 4-10 */}
            <div className="p-4 space-y-2 bg-white relative z-30">
                {rest.map((user, index) => {
                    const rank = index + 4;
                    const isMe = user.id === currentUserId;

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={user.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] ${isMe ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
                        >
                            <span className={`font-bold w-6 text-center ${isMe ? 'text-indigo-600' : 'text-slate-400'}`}>{rank}</span>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">
                                {AVATARS[user.avatarId]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold truncate ${isMe ? 'text-indigo-900' : 'text-slate-700'}`}>
                                    {user.name} {isMe && '(You)'}
                                </p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                                    {user.level}
                                    <span className="md:hidden"> • <LeagueBadge xp={user.experience} /></span>
                                </p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                <span className="hidden md:inline-block"><LeagueBadge xp={user.experience} /></span>
                                <p className={`font-bold text-sm ${isMe ? 'text-indigo-600' : 'text-slate-600'}`}>{user.experience} XP</p>
                                {user.streak > 0 && (
                                    <p className="text-[10px] text-orange-500 font-medium flex items-center justify-end gap-0.5">
                                        🔥 {user.streak}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {users.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No players yet via Leaderboard
                    </div>
                )}
            </div>
        </div>
    );
}
