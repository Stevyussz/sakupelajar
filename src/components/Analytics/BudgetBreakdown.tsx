'use client';

import { GlassCard } from "@/components/UI/GlassCard";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

interface BudgetBreakdownProps {
    budgets: { category: string; limit: number; spent?: number }[];
    transactions: any[];
}

export function BudgetBreakdown({ budgets, transactions }: BudgetBreakdownProps) {
    // Merge live transaction data into budgets if 'spent' isn't pre-calculated
    const mergedBudgets = budgets.map(b => {
        const spent = transactions
            .filter(t => t.kategori === b.category && t.jumlah < 0)
            .reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);
        return { ...b, spent };
    });

    if (mergedBudgets.length === 0) {
        return (
            <GlassCard className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Budget Breakdown</h3>
                <div className="text-center py-8 text-slate-400">
                    <p>No budgets set yet.</p>
                    <p className="text-xs mt-1">Go to Dashboard to set your first budget!</p>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Budget Performance
            </h3>

            <div className="space-y-6">
                {mergedBudgets.map((budget, idx) => {
                    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                    const isOver = budget.spent > budget.limit;
                    const color = isOver ? "bg-red-500" : (percentage > 80 ? "bg-yellow-500" : "bg-green-500");
                    const textColor = isOver ? "text-red-500" : (percentage > 80 ? "text-yellow-600" : "text-green-600");

                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-700">{budget.category}</h4>
                                    <p className="text-xs text-slate-400">
                                        Rp {budget.spent.toLocaleString('id-ID')} <span className="text-slate-300">/ {budget.limit.toLocaleString('id-ID')}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${textColor}`}>
                                        {Math.round(percentage)}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Status Message */}
                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span className="text-slate-400">
                                    {isOver
                                        ? `Exceeded by Rp ${(budget.spent - budget.limit).toLocaleString('id-ID')}`
                                        : `Rp ${(budget.limit - budget.spent).toLocaleString('id-ID')} left`}
                                </span>
                                {isOver && <AlertCircle className="w-3 h-3 text-red-500" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
