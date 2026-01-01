'use client';

interface BudgetCardProps {
    category: string;
    limit: number;
    spent: number;
    period?: 'daily' | 'weekly' | 'monthly';
    onEdit?: () => void;
    onDelete?: () => void;
}

import { Trash2, CalendarClock } from "lucide-react";

export function BudgetCard({ category, limit, spent, period = 'monthly', onEdit, onDelete }: BudgetCardProps) {
    const percentage = Math.min((spent / limit) * 100, 100);

    let colorClass = "bg-green-500";
    let textColorClass = "text-green-600";

    if (percentage >= 100) {
        colorClass = "bg-red-500";
        textColorClass = "text-red-600";
    } else if (percentage > 75) {
        colorClass = "bg-yellow-500";
        textColorClass = "text-yellow-600";
    }

    return (
        <div className="p-4 bg-white border border-slate-100 rounded-xl relative overflow-hidden group">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-700">{category}</h4>
                        {period === 'daily' && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <CalendarClock className="w-3 h-3" /> Daily
                            </span>
                        )}
                        {period === 'weekly' && (
                            <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">
                                Weekly
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400">Limit: Rp {limit.toLocaleString('id-ID')} / {period === 'daily' ? 'hari' : 'bulan'}</p>
                </div>
                <div className="text-right">
                    <p className={`font-bold ${textColorClass}`}>Rp {spent.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-slate-400">{Math.round(percentage)}% of budget</p>
                </div>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {onEdit && (
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                        onClick={onEdit}
                        className="text-xs bg-white py-1 px-3 rounded-full shadow-sm font-bold text-slate-600 hover:text-blue-600 transition"
                    >
                        Edit
                    </button>
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="text-xs bg-white p-1 px-3 rounded-full shadow-sm font-bold text-slate-600 hover:text-red-600 transition flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
