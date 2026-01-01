'use client';
import { GlassCard } from "@/components/UI/GlassCard";
import { CurrencyInput } from "@/components/UI/CurrencyInput";
import { Check, Plus, Trash2, Rocket, Star, Calendar } from "lucide-react";
import { triggerSideCannons } from "@/lib/confetti";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/UI/Modal";
import { useToast } from "@/components/UI/Toast";

interface WishlistProps {
    item: any;
    monthlySurplus?: number;
}

export function WishlistCard({ item, monthlySurplus = 0 }: WishlistProps) {
    const [amount, setAmount] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    const progress = Math.min((item.savedAmount / item.targetAmount) * 100, 100);
    const remaining = item.targetAmount - item.savedAmount;

    // --- FORECAST CALCULATION ---
    let forecastMessage = "Keep saving!";
    let forecastColor = "text-slate-500";
    let monthsToGo = 0;

    if (remaining > 0 && monthlySurplus > 0) {
        monthsToGo = Math.ceil(remaining / monthlySurplus);
        const projectedDate = new Date();
        projectedDate.setMonth(projectedDate.getMonth() + monthsToGo);

        // Format date: "March 2024"
        const dateString = projectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        if (monthsToGo <= 1) {
            forecastMessage = `You could finish this month! 🚀`;
            forecastColor = "text-green-600";
        } else {
            forecastMessage = `Estimated finish: ${dateString}`;
            forecastColor = "text-blue-600";
        }
    } else if (monthlySurplus <= 0 && remaining > 0) {
        forecastMessage = "Increase your monthly surplus to reach this goal.";
        forecastColor = "text-orange-500";
    }

    // Dynamic Color based on progress
    const getProgressColor = () => {
        if (progress < 25) return 'from-red-400 to-orange-400';
        if (progress < 50) return 'from-orange-400 to-yellow-400';
        if (progress < 75) return 'from-yellow-400 to-green-400';
        return 'from-green-400 to-emerald-500';
    };

    async function handleAddSavings(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const nominal = Number(amount.replace(/\D/g, ''));
        if (!nominal || nominal <= 0) {
            addToast("Masukkan nominal valid!", "error");
            setLoading(false);
            return;
        }

        const res = await fetch('/api/wishlist', {
            method: 'PUT',
            body: JSON.stringify({ id: item._id, amount: nominal }),
        });

        // ... inside handleAddSavings

        // ... inside handleAddSavings
        if (res.ok) {
            const newSavedAmount = item.savedAmount + nominal;
            if (newSavedAmount >= item.targetAmount) {
                triggerSideCannons();
                addToast("CONGRATULATIONS! Goal Reached! 🎉", "success");
            } else {
                addToast("Yeay! Tabungan bertambah! 🚀", "success");
            }
            setAmount('');
            setIsModalOpen(false);
            router.refresh();
        } else {
            addToast("Gagal menyimpan.", "error");
        }
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Hapus keinginan ini?")) return;

        await fetch(`/api/wishlist/delete?id=${item._id}`, { method: 'DELETE' });
        addToast("Wishlist dihapus.", "info");
        router.refresh();
    }

    return (
        <>
            <GlassCard className="p-6 flex flex-col justify-between h-full relative group hover:scale-[1.02] transition-transform duration-300 border-t-4 border-t-transparent hover:border-t-blue-500 shadow-lg hover:shadow-xl">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-2xl">
                            <Rocket className="w-6 h-6 text-indigo-600" />
                        </div>
                        <button onClick={handleDelete} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition duration-200">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-xl text-slate-800 mb-2 truncate">{item.itemName}</h3>
                        <div className="flex justify-between text-sm mb-3 items-end">
                            <span className="text-slate-500 font-medium">Terkumpul</span>
                            <span className="font-bold text-2xl text-blue-600">Rp {item.savedAmount.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                            <div
                                className={`bg-gradient-to-r ${getProgressColor()} h-full rounded-full transition-all duration-1000 ease-out relative`}
                                style={{ width: `${progress}%` }}
                            >
                                {/* Shimmer Effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-4">
                            <span>{progress.toFixed(0)}%</span>
                            <span>Target: Rp {item.targetAmount.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Smart Forecast Section */}
                        <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700 text-sm mb-1">
                                        {monthlySurplus > 0 ? "Forecast & Insight" : "Needs Attention"}
                                    </h4>

                                    {remaining <= 0 ? (
                                        <p className="text-xs text-green-600 font-bold">Target reached! You are amazing! 🎉</p>
                                    ) : monthlySurplus > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-500">
                                                With your current surplus of <span className="font-bold text-slate-700">Rp {monthlySurplus.toLocaleString('id-ID')}/mo</span>:
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs text-slate-400">Estimated Finish:</span>
                                                <span className="font-bold text-blue-600 text-sm">
                                                    {new Date(new Date().setMonth(new Date().getMonth() + Math.ceil(remaining / monthlySurplus))).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 italic">
                                                ~{Math.ceil(remaining / monthlySurplus)} bulan lagi.
                                            </p>

                                            <div className="mt-2 pt-2 border-t border-slate-200">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">💡 Smart Tip</p>
                                                <p className="text-xs text-slate-600">
                                                    Save <span className="font-bold text-emerald-600">Rp {Math.ceil(remaining / 90).toLocaleString('id-ID')}/day</span> to finish in 3 months!
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-orange-500">
                                            We can't predict a date yet because your monthly cash flow is low or negative. Try to reduce expenses to boost your surplus!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={item.savedAmount >= item.targetAmount}
                    className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center shadow-lg transform active:scale-95 ${item.savedAmount >= item.targetAmount
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-blue-600 text-white shadow-blue-500/20'
                        }`}
                >
                    {item.savedAmount >= item.targetAmount ? (
                        <><Check className="w-5 h-5 mr-2" /> Tercapai!</>
                    ) : (
                        <><Plus className="w-5 h-5 mr-2" /> Tambah Tabungan</>
                    )}
                </button>
            </GlassCard>

            {/* Add Savings Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Nabung untuk ${item.itemName}`}
            >
                <form onSubmit={handleAddSavings}>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <p className="text-sm text-yellow-700 font-medium">Konsisten adalah kunci!</p>
                        </div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nominal Tabungan</label>
                        <CurrencyInput
                            value={amount}
                            onChange={setAmount}
                            placeholder="Rp 0"
                            className="w-full p-4 border-2 border-slate-100 rounded-xl text-3xl font-bold focus:border-blue-500 focus:ring-0 outline-none text-slate-800 placeholder:text-slate-300 transition-colors"
                            required
                        />
                    </div>
                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition shadow-xl shadow-blue-500/30">
                        {loading ? 'Menyimpan...' : 'Simpan Tabungan'}
                    </button>
                </form>
            </Modal>
        </>
    );
}
