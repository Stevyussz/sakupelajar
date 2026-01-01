'use client';

import { Check, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/UI/GlassCard";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/UI/Toast";

interface DebtItem {
    _id: string;
    personName: string;
    amount: number;
    description?: string;
    dueDate?: string;
    isPaid: boolean;
}

interface DebtListProps {
    debts: DebtItem[];
    type: 'owe' | 'owed'; // 'owe' = I owe them (Negative), 'owed' = They owe me (Positive)
}

export function DebtList({ debts, type }: DebtListProps) {
    const router = useRouter();
    const { addToast } = useToast();

    async function handleMarkPaid(id: string) {
        const res = await fetch(`/api/debts?id=${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ isPaid: true })
        });
        if (res.ok) {
            addToast("Marked as paid! ✅", "success");
            router.refresh();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Remove this debt record?")) return;
        const res = await fetch(`/api/debts?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            addToast("Record deleted.", "info");
            router.refresh();
        }
    }

    if (debts.length === 0) {
        return (
            <div className="text-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">No active debts here. You're clean! ✨</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {debts.map((debt) => (
                <GlassCard key={debt._id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 group">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className={`p-3 rounded-xl ${type === 'owed' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {type === 'owed' ? (
                                <ArrowLeft className="w-5 h-5 text-green-600" />
                            ) : (
                                <ArrowRight className="w-5 h-5 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">{debt.personName}</h4>
                            <p className="text-sm text-slate-500">{debt.description || "No description"}</p>
                            {debt.dueDate && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Due: {new Date(debt.dueDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                            <p className={`font-bold text-lg ${type === 'owed' ? 'text-green-600' : 'text-red-600'}`}>
                                {type === 'owed' ? '+' : '-'} Rp {Math.abs(debt.amount).toLocaleString('id-ID')}
                            </p>
                            {debt.isPaid && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">PAID</span>}
                        </div>

                        {!debt.isPaid && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleMarkPaid(debt._id)}
                                    className="p-2 bg-slate-100 hover:bg-green-100 text-slate-400 hover:text-green-600 rounded-lg transition"
                                    title="Mark as Paid"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(debt._id)}
                                    className="p-2 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {debt.isPaid && (
                            <button
                                onClick={() => handleDelete(debt._id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
