'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChevronLeft, ChevronRight, Save, Loader2, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/UI/GlassCard';

interface HanseiProps {
    transactions: any[];
    initialReflections: any[];
}

export function KakeiboHanseiView({ transactions, initialReflections }: HanseiProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [journal, setJournal] = useState('');
    const [saving, setSaving] = useState(false);

    // Format YYYY-MM
    const currentMonthStr = currentDate.toISOString().slice(0, 7);

    // Filter transactions for current month
    const monthlyTransactions = transactions.filter(t => t.tanggal.startsWith(currentMonthStr));

    // Find existing reflection
    const currentReflection = initialReflections.find(r => r.month === currentMonthStr);
    const [activeJournal, setActiveJournal] = useState(currentReflection?.content || '');

    // Calculate Pillars
    const pillars = {
        survival: 0,
        optional: 0,
        culture: 0,
        extra: 0
    };

    let totalExpense = 0;
    let totalIncome = 0;

    monthlyTransactions.forEach(t => {
        if (t.type === 'income') {
            totalIncome += t.jumlah;
        } else {
            const amount = Math.abs(t.jumlah);
            totalExpense += amount;

            let pillar = t.kakeiboPillar;
            if (!pillar) {
                // Auto-categorize fallback (simulated same as backend)
                const cat = t.kategori?.toLowerCase() || '';
                if (['makanan', 'transport', 'kost', 'tagihan'].some(c => cat.includes(c))) pillar = 'survival';
                else if (['edukasi', 'buku'].some(c => cat.includes(c))) pillar = 'culture';
                else if (['hiburan', 'jajan', 'game'].some(c => cat.includes(c))) pillar = 'optional';
                else pillar = 'extra';
            }
            if (pillars[pillar as keyof typeof pillars] !== undefined) {
                pillars[pillar as keyof typeof pillars] += amount;
            } else {
                pillars['extra'] += amount;
            }
        }
    });

    const chartData = [
        { name: 'Survival', value: pillars.survival, color: '#3b82f6', icon: '🏠' },
        { name: 'Optional', value: pillars.optional, color: '#f43f5e', icon: '🍦' },
        { name: 'Culture', value: pillars.culture, color: '#8b5cf6', icon: '📚' },
        { name: 'Extra', value: pillars.extra, color: '#f59e0b', icon: '💊' },
    ];

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);

        // Reset journal input for new month
        const newMonthStr = newDate.toISOString().slice(0, 7);
        const ref = initialReflections.find(r => r.month === newMonthStr);
        setActiveJournal(ref?.content || '');
    };

    const handleSaveReflection = async () => {
        setSaving(true);
        try {
            await fetch('/api/kakeibo/reflection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    month: currentMonthStr,
                    content: activeJournal
                })
            });
            alert('Jurnal tersimpan! 💾');
        } catch (e) {
            alert('Gagal menyimpan.');
        } finally {
            setSaving(false);
        }
    };

    const remaining = totalIncome - totalExpense;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header / Month Navigator */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full transition">
                    <ChevronLeft />
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hansei (Evaluasi)</p>
                </div>
                <button onClick={() => changeMonth(1)} disabled={new Date() < new Date(currentDate.setMonth(currentDate.getMonth() + 1))} className="p-2 hover:bg-slate-100 rounded-full transition disabled:opacity-30">
                    <ChevronRight />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Analysis */}
                <GlassCard className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-indigo-500" /> Komposisi Pengeluaran
                    </h3>

                    <div className="flex items-center justify-center h-64">
                        {totalExpense > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-slate-400 text-center">Belum ada data bulan ini.</div>
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 p-3 rounded-xl">
                            <p className="text-xs text-green-600 font-bold">Pemasukan</p>
                            <p className="font-bold text-green-700">Rp {totalIncome.toLocaleString()}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl">
                            <p className="text-xs text-red-600 font-bold">Pengeluaran</p>
                            <p className="font-bold text-red-700">Rp {totalExpense.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-slate-500">Sisa Uang (Saving Potential)</p>
                        <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                            Rp {remaining.toLocaleString()}
                        </p>
                    </div>
                </GlassCard>

                {/* Journal Entry */}
                <div className="space-y-4">
                    <GlassCard className="p-6 h-full flex flex-col">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                            <BookOpen className="w-5 h-5 text-indigo-500" /> Jurnal Refleksi
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Tulis evaluasimu untuk bulan ini. Apa yang sudah baik? Apa yang boros ("Muda-zukai")? Bagaimana plan bulan depan?
                        </p>

                        <textarea
                            className="flex-1 w-full bg-yellow-50/50 p-4 rounded-xl border border-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none resize-none font-handwriting text-slate-700 leading-relaxed"
                            placeholder="Contoh: Bulan ini kebanyakan beli kopi (Optional). Bulan depan mau bawa bekal biar Survival cost naik tapi Optional turun..."
                            value={activeJournal}
                            onChange={(e) => setActiveJournal(e.target.value)}
                            style={{ minHeight: '200px' }}
                        />

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSaveReflection}
                                disabled={saving}
                                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-slate-500/20"
                            >
                                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                Simpan Jurnal
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Kakeibo Wisdom */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-xl mb-2">💡 Filosofi Kakeibo</h3>
                    <p className="opacity-90 max-w-2xl">
                        "Uang bukan cuma angka, tapi cerminan gaya hidupmu. Dengan menyadari (mindfulness) kemana uangmu pergi, kamu bisa mengontrol masa depanmu."
                    </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 text-9xl transform translate-x-10 translate-y-10">
                    ⛩️
                </div>
            </div>
        </div>
    );
}
