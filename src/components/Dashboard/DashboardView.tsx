'use client';

import { calculateLevel } from '@/lib/gamification';

import { useState } from 'react';
import { SmartAdvisor } from '@/components/Dashboard/SmartAdvisor';
import { ExportButton } from '@/components/Dashboard/ExportButton';
import { LogOut, Plus, User as UserIcon, LayoutDashboard, PieChart, History, Share2 } from 'lucide-react';
import { TransactionList } from '@/components/Dashboard/TransactionList';
import { LevelBadge } from '@/components/Gamification/LevelBadge';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ExpenseChart } from '@/components/Charts/ExpenseChart';
import { SpendingDNA } from '@/components/Dashboard/SpendingDNA';
import { HealthScoreCard } from '@/components/Dashboard/HealthScoreCard';
import { KakeiboStats } from '@/components/Kakeibo/KakeiboStats';
import Link from "next/link";
import { StreakBadge } from "@/components/Gamification/StreakBadge";
import { ShareableStats } from "@/components/Gamification/ShareableStats";
import { OnboardingTour } from "@/components/Onboarding/OnboardingTour";

interface DashboardViewProps {
    session: any;
    totalBalance: number;
    netWorth: number;
    incomeThisMonth: number;
    expenseThisMonth: number;
    chartData: any[];
    transactions: any[];
    receivables: number;
    debtAmount: number;
    totalScore: number;
    grade: string;
    metrics: any;
    budgets: any[];
    hasSeenOnboarding: boolean;
}

import { BudgetManager } from '@/components/Budget/BudgetManager';

export function DashboardView({
    session, totalBalance, netWorth, incomeThisMonth, expenseThisMonth,
    chartData, transactions, receivables, debtAmount, totalScore, grade, metrics, budgets, hasSeenOnboarding
}: DashboardViewProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'history'>('overview');

    // Tab Button Component
    const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all ${activeTab === id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-400 hover:bg-slate-50'
                }`}
        >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">{label}</span>
        </button>
    );

    // Use type assertion to access 'streak' which we added in auth options
    const streak = (session.user as any)?.streak || 0;
    const avatarId = (session.user as any)?.avatarId || 'lion';
    const [showShare, setShowShare] = useState(false);

    const AVATARS: Record<string, string> = {
        lion: '🦁', cat: '😼', robot: '🤖', unicorn: '🦄',
        rocket: '🚀', crown: '👑', detective: '🕵️', ninja: '🥷'
    };

    const userAvatar = AVATARS[avatarId] || '🦁';

    return (
        <div className="p-6 md:p-8 space-y-8 pb-24 md:pb-8">
            <OnboardingTour hasSeenOnboarding={hasSeenOnboarding} />
            <ShareableStats
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                user={{
                    name: session.user.name,
                    avatarId: avatarId,
                    level: calculateLevel(totalBalance).name,
                    streak: streak,
                    totalSavings: totalBalance
                }}
            />

            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border border-slate-100 relative group cursor-pointer" onClick={() => setShowShare(true)}>
                        {userAvatar}
                        <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                            <Share2 className="w-3 h-3" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Hello, {session.user.name?.split(' ')[0] || 'Friend'}! 👋
                        </h1>
                        <p className="text-slate-500 text-sm">Welcome back to your financial dashboard.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StreakBadge streak={streak} />
                    <Link href="/profile" className="bg-white text-slate-700 border border-slate-200 p-3 rounded-full hover:bg-slate-50 transition shadow-sm">
                        <UserIcon className="w-5 h-5" />
                    </Link>
                </div>
            </header>





            {/* Content Area */}
            <div className="space-y-6">

                {/* Stats Grid - Always visible and full width */}
                <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatsCard title="Total Savings" amount={totalBalance} type="balance" />
                    <StatsCard title="Net Worth (Real)" amount={netWorth} type="net-worth" trend="+Stable" />
                    <StatsCard title="Income (Month)" amount={incomeThisMonth} type="income" trend="+12%" />
                    <StatsCard title="Expense (Month)" amount={expenseThisMonth} type="expense" trend="-5%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Level Progress - Full Width */}
                        <div id="level-badge">
                            <LevelBadge totalSavings={totalBalance} />
                        </div>

                        {/* Main Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <HealthScoreCard score={totalScore} grade={grade} metrics={metrics} />
                            <div id="smart-advisor">
                                <SmartAdvisor
                                    income={incomeThisMonth}
                                    expense={expenseThisMonth}
                                    balance={totalBalance}
                                    receivables={receivables}
                                    debt={debtAmount}
                                    budgetLimit={budgets.reduce((acc, b) => acc + b.limit, 0)}
                                />
                            </div>
                        </div>

                        {/* Kakeibo Analysis (Full Width) */}
                        <KakeiboStats transactions={transactions} />

                        {/* DESKTOP ONLY: Analytics Section (Chart + DNA) */}
                        <div className="hidden md:block space-y-4">
                            <ExpenseChart data={chartData} />
                            <SpendingDNA transactions={transactions} />
                        </div>

                        {/* MOBILE ONLY: Transaction History (Instead of Analytics) */}
                        <div className="md:hidden space-y-4">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
                                    <Link href="/history" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                        View All
                                    </Link>
                                </div>
                                <TransactionList transactions={transactions} />
                                <div className="h-20" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Persistent Sidebar (Desktop Only) */}
                    <div className="hidden lg:flex flex-col gap-6 h-fit sticky top-4">
                        <BudgetManager budgets={budgets} />
                        <Link id="add-transaction-btn" href="/add" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center transition transform hover:-translate-y-1 block">
                            <Plus className="w-5 h-5 mr-2" /> Add Transaction
                        </Link>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1 min-h-[400px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
                                <Link href="/history" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                    View All
                                </Link>
                            </div>
                            <TransactionList transactions={transactions} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
