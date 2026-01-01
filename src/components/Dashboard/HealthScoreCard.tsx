'use client';
import { GlassCard } from "@/components/UI/GlassCard";
import { Activity, Trophy, TrendingUp, AlertTriangle } from "lucide-react";

interface HealthScoreProps {
    score: number;
    grade: string;
    metrics: {
        savingsRate: number;
        wantRatio: number;
        debtRatio: number;
    };
}

export function HealthScoreCard({ score, grade, metrics }: HealthScoreProps) {
    let color = "text-slate-500";
    let message = "Keep going!";
    let bgGradient = "from-slate-100 to-slate-200";

    if (grade === 'A' || grade === 'A+') {
        color = "text-emerald-600";
        bgGradient = "from-emerald-100 to-teal-50";
        message = "Perfect! You are a financial wizard. 🧙‍♂️";
    } else if (grade === 'B') {
        color = "text-blue-600";
        bgGradient = "from-blue-100 to-indigo-50";
        message = "Great job! Very healthy finances. 🚀";
    } else if (grade === 'C') {
        color = "text-yellow-600";
        bgGradient = "from-yellow-100 to-orange-50";
        message = "Good start, but watch your 'Wants'. ⚠️";
    } else {
        color = "text-red-600";
        bgGradient = "from-red-100 to-pink-50";
        message = "Critical! You need to save more. 🚨";
    }

    return (
        <GlassCard className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        Financial Health
                    </h3>
                    <p className="text-sm text-slate-500">Your financial report card</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl bg-gradient-to-br ${bgGradient} border border-white/50 shadow-sm`}>
                    <span className={`text-4xl font-black ${color}`}>{grade}</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 font-bold text-slate-600">
                    <span>Score</span>
                    <span>{score}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${score > 80 ? 'bg-emerald-500' : score > 60 ? 'bg-blue-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="mb-1">Savings</p>
                    <p className={`font-bold ${metrics.savingsRate >= 20 ? 'text-green-600' : 'text-red-500'}`}>{metrics.savingsRate.toFixed(0)}%</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="mb-1">Wants</p>
                    <p className={`font-bold ${metrics.wantRatio <= 30 ? 'text-green-600' : 'text-yellow-600'}`}>{metrics.wantRatio.toFixed(0)}%</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                    <p className="mb-1">Debt</p>
                    <p className={`font-bold ${metrics.debtRatio === 0 ? 'text-green-600' : 'text-red-500'}`}>{metrics.debtRatio.toFixed(0)}%</p>
                </div>
            </div>

            <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 ${score > 60 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-yellow-50 border-yellow-100 text-yellow-700'
                }`}>
                {score > 60 ? <Trophy className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <p className="text-sm font-medium">{message}</p>
            </div>
        </GlassCard>
    );
}
