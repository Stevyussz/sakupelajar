'use client';
import { GlassCard } from "@/components/UI/GlassCard";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface BudgetProgressProps {
    totalBudget: number;
    totalSpent: number;
}

export function BudgetProgress({ totalBudget, totalSpent }: BudgetProgressProps) {
    const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
    const isOverBudget = totalSpent > totalBudget;

    let statusColor = "bg-blue-600";
    let statusText = "On Track";
    let StatusIcon = CheckCircle;

    if (percentage >= 100) {
        statusColor = "bg-red-600";
        statusText = "Over Budget";
        StatusIcon = AlertTriangle;
    } else if (percentage > 80) {
        statusColor = "bg-yellow-500";
        statusText = "Near Limit";
        StatusIcon = AlertTriangle;
    }

    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase">Monthly Budget Goal</h3>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                        Rp {totalSpent.toLocaleString('id-ID')}
                        <span className="text-sm font-normal text-slate-400"> / {totalBudget.toLocaleString('id-ID')}</span>
                    </p>
                </div>
                <div className={`p-2 rounded-lg ${percentage >= 100 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    <StatusIcon className="w-5 h-5" />
                </div>
            </div>

            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full ${statusColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="flex justify-between items-center mt-3 text-sm">
                <span className={`font-bold ${percentage >= 100 ? 'text-red-600' : 'text-slate-600'}`}>
                    {Math.round(percentage)}% Used
                </span>
                <span className="text-slate-400">
                    {totalBudget > totalSpent
                        ? `Rp ${(totalBudget - totalSpent).toLocaleString('id-ID')} remaining`
                        : `Over by Rp ${(totalSpent - totalBudget).toLocaleString('id-ID')}`
                    }
                </span>
            </div>
        </GlassCard>
    );
}
