'use client';
import { GlassCard } from "@/components/UI/GlassCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, ThumbsUp } from "lucide-react";

interface SpendingDNAProps {
    transactions: any[];
}

export function SpendingDNA({ transactions }: SpendingDNAProps) {
    const expenses = transactions.filter(t => t.jumlah < 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);

    const needs = expenses.filter(t => t.type === 'need').reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);
    const wants = expenses.filter(t => t.type === 'want').reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);

    // Default to handling old data (assume 'need' if undefined)
    const uncategorized = totalExpense - needs - wants;
    // If older data exists, we treat it as 'need' for now or 'uncategorized'
    const adjustedNeeds = needs + uncategorized;

    const needPercent = totalExpense > 0 ? Math.round((adjustedNeeds / totalExpense) * 100) : 0;
    const wantPercent = totalExpense > 0 ? Math.round((wants / totalExpense) * 100) : 0;

    const data = [
        { name: 'Need (Butuh)', value: adjustedNeeds, color: '#22c55e' }, // Green
        { name: 'Want (Ingin)', value: wants, color: '#a855f7' }, // Purple
    ];

    let message = "You haven't spent anything yet!";
    let color = "text-slate-500";
    let icon = ThumbsUp;

    if (totalExpense > 0) {
        if (wantPercent > 50) {
            message = "Warning! You spent more on WANTS than NEEDS. Try to cut back on snacks or games.";
            color = "text-red-500";
            icon = AlertCircle;
        } else if (wantPercent > 30) {
            message = "Good balance, but be careful with 'wants'.";
            color = "text-yellow-600";
            icon = AlertCircle;
        } else {
            message = "Excellent! You are prioritizing your needs correctly.";
            color = "text-green-600";
            icon = ThumbsUp;
        }
    }

    return (
        <GlassCard className="p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">🧬 Spending ANAL</h3>

            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-40 h-40 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 space-y-4 w-full">
                    {/* Analysis Box */}
                    <div className={`p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 ${color} bg-opacity-10`}>
                        <div className="shrink-0 mt-1">
                            {/* Icon Render */}
                            {wantPercent > 50 ? <AlertCircle className="w-5 h-5 text-red-500" /> : <ThumbsUp className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{message}</p>
                    </div>

                    {/* Legend */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                Needs (Wajib)
                            </span>
                            <span className="font-bold">{needPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${needPercent}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="flex items-center gap-2 text-slate-600">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                Wants (Ingin)
                            </span>
                            <span className="font-bold">{wantPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${wantPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
