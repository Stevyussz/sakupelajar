'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from "@/components/UI/GlassCard";
import { Plus, Target, X } from "lucide-react";
import { BudgetCard } from "./BudgetCard";
import { CategorySelector } from "@/components/UI/CategorySelector";
import { CurrencyInput } from "@/components/UI/CurrencyInput";
import { useRouter } from 'next/navigation';

interface BudgetManagerProps {
    budgets: any[];
}

export function BudgetManager({ budgets }: BudgetManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [category, setCategory] = useState("Makan & Minum");
    const [limit, setLimit] = useState("");
    const [period, setPeriod] = useState("monthly");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Optimistic State
    const [optimisticBudgets, setOptimisticBudgets] = useState(budgets);

    // Sync optimistic state when props change (server catch-up)
    // Use effect to only trigger when server data actually changes
    useEffect(() => {
        setOptimisticBudgets(budgets);
    }, [budgets]);

    async function handleDelete(categoryToDelete: string) {
        if (!confirm(`Are you sure you want to delete the budget for ${categoryToDelete}?`)) return;

        // 1. Optimistic Update
        setOptimisticBudgets(prev => prev.filter(b => b.category !== categoryToDelete));

        // 2. Server Update
        await fetch('/api/budget', {
            method: 'DELETE',
            body: JSON.stringify({ category: categoryToDelete }),
        });

        // 3. Background Refresh
        router.refresh();
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const limitValue = Number(limit.replace(/\D/g, ''));

        // 1. Optimistic Update (Immediate Feedback)
        setOptimisticBudgets(prev => {
            const index = prev.findIndex(b => b.category === category);
            if (index > -1) {
                const newBudgets = [...prev];
                newBudgets[index] = { ...newBudgets[index], limit: limitValue, period };
                return newBudgets;
            } else {
                return [...prev, { category, limit: limitValue, period, spent: 0 }];
            }
        });

        // 2. Server Update
        await fetch('/api/budget', {
            method: 'POST',
            body: JSON.stringify({ category, limit: limitValue, period }),
        });

        setIsAdding(false);
        setLimit("");
        setLoading(false);

        // 3. Background Refresh (Eventual Consistency)
        router.refresh();
    }

    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Amplop Saya</h3>
                        <p className="text-[10px] text-slate-400">Target & Limit</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push('/budget')}
                        className="text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition"
                    >
                        Detail
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-xs bg-purple-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Tambah
                    </button>
                </div>
            </div>

            {
                isAdding && (
                    <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100 animate-slide-up">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-purple-800 text-sm">New Budget Rule</h4>
                            <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-purple-400" /></button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-3">
                            <CategorySelector selected={category} onSelect={setCategory} />

                            <div className="flex gap-2 bg-purple-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setPeriod('daily')}
                                    className={`flex-1 text-xs py-1.5 rounded-md font-bold transition ${period === 'daily' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-400 hover:text-purple-600'}`}
                                >
                                    Daily
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPeriod('monthly')}
                                    className={`flex-1 text-xs py-1.5 rounded-md font-bold transition ${period === 'monthly' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-400 hover:text-purple-600'}`}
                                >
                                    Monthly
                                </button>
                            </div>

                            <CurrencyInput
                                value={limit}
                                onChange={setLimit}
                                placeholder="Max limit (e.g. 50.000)"
                                className="w-full p-3 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                            <button disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-bold">
                                {loading ? "Saving..." : "Save Budget"}
                            </button>
                        </form>
                    </div>
                )
            }

            <div className="space-y-3">
                {optimisticBudgets.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">No budgets set yet.</p>
                        <p className="text-xs mt-1">Plan your spending to save more!</p>
                    </div>
                ) : (
                    optimisticBudgets.map((budget, idx) => (
                        <BudgetCard
                            key={idx}
                            category={budget.category}
                            limit={budget.limit}
                            spent={budget.spent}
                            period={budget.period}
                            onEdit={() => {
                                setCategory(budget.category);
                                setLimit(budget.limit.toString());
                                setPeriod(budget.period || 'monthly');
                                setIsAdding(true);
                            }}
                            onDelete={() => handleDelete(budget.category)}
                        />
                    ))
                )}
            </div>
        </GlassCard >
    );
}
