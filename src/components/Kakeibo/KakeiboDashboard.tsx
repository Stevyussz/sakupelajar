'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Wallet, Target, PiggyBank } from 'lucide-react';
import { GlassCard } from '@/components/UI/GlassCard';
import { KakeiboStats } from './KakeiboStats';

interface KakeiboDashboardProps {
    transactions: any[];
    budgets: any[]; // Assuming we pass budgets/envelopes
    initialReflections: any[];
}

export function KakeiboDashboard({ transactions, budgets, initialReflections }: KakeiboDashboardProps) {
    const router = useRouter();

    // Get Latest Reflection
    const latestHansei = [...initialReflections].sort((a, b) => b.period.localeCompare(a.period))[0];

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* 1. Wrapped Banner (Surprise!) */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01] hover:shadow-2xl"
                onClick={() => router.push('/kakeibo/wrapped')}>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-3 border border-white/10">
                            <Sparkles className="w-3 h-3" /> Weekly Recap Available
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2">Your Weekly Wrapped is Ready! 🎁</h2>
                        <p className="text-indigo-100 max-w-lg">
                            Lihat bagaimana performa keuanganmu minggu ini. Kami sudah menyiapkan prediksi dan persona unik buatmu!
                        </p>
                    </div>
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg flex items-center gap-2 group-hover:gap-3">
                        Buka Wrapped <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                {/* Decor */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition duration-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Main Stats (Kakeibo Breakdown) */}
                <div className="lg:col-span-2 space-y-8">
                    <KakeiboStats transactions={transactions} />

                    {/* Latest Hansei Preview */}
                    <GlassCard className="p-6 relative overflow-hidden">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                            📖 Latest Hansei ({latestHansei?.period || 'Belum ada'})
                        </h3>
                        {latestHansei ? (
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-slate-700 italic font-handwriting relative z-10 text-lg leading-relaxed shadow-sm">
                                "{latestHansei.content}"
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm mb-4 relative z-10">
                                Refleksi mingguan membantumu menyadari "Muda" (Pemborosan). Buka Wrapped untuk mengisi jurnal lengkap.
                            </p>
                        )}

                        {/* Quote */}
                        <div className="mt-4 text-xs text-slate-400 font-bold uppercase tracking-widest relative z-10">
                            Zen Financial Wisdom
                        </div>

                        <div className="absolute right-0 bottom-0 opacity-5 text-9xl transform translate-x-10 translate-y-10">
                            🧘
                        </div>
                    </GlassCard>
                </div>

                {/* 3. Envelopes (Using Budgets) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-indigo-500" /> Amplop (Budgets)
                        </h3>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700" onClick={() => router.push('/budget')}>
                            Atur
                        </button>
                    </div>

                    <div className="space-y-4">
                        {budgets.length > 0 ? budgets.map((b: any, i: number) => {
                            const percent = Math.min(100, Math.round((b.spent / b.limit) * 100));
                            const isDanger = percent > 80;

                            return (
                                <GlassCard key={i} className="p-4 relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-2 z-10 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-lg">{b.icon || '💰'}</div>
                                            <div>
                                                <p className="font-bold text-slate-700">{b.category}</p>
                                                <p className="text-xs text-slate-400">Limit: Rp {b.limit.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${isDanger ? 'text-red-600' : 'text-slate-700'}`}>
                                            {percent}%
                                        </div>
                                    </div>
                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden z-10 relative">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isDanger ? 'bg-red-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </GlassCard>
                            );
                        }) : (
                            <GlassCard className="p-6 text-center">
                                <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
                                    <Target className="w-6 h-6" />
                                </div>
                                <p className="text-slate-500 text-sm font-bold">Belum ada amplop.</p>
                                <p className="text-xs text-slate-400 mb-3">Buat budget agar pengeluaran terkontrol.</p>
                                <button onClick={() => router.push('/budget')} className="text-xs bg-slate-900 text-white px-3 py-2 rounded-lg font-bold">
                                    + Buat Amplop
                                </button>
                            </GlassCard>
                        )}
                    </div>

                    <GlassCard className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <PiggyBank className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-orange-800">Tips Hemat</h4>
                        </div>
                        <p className="text-xs text-orange-700 leading-relaxed">
                            Coba metode "72 Jam Rule". Sebelum beli barang *Optional*, tunggu 72 jam. Kalau masih pengen, baru beli!
                        </p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
