'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface KakeiboStatsProps {
    transactions: any[];
}

export function KakeiboStats({ transactions }: KakeiboStatsProps) {
    // Filter expenses (negative numbers)
    const expenses = transactions.filter(t => t.jumlah < 0);
    const totalExpense = expenses.reduce((acc, t) => acc + Math.abs(t.jumlah), 0);

    // Calculate Pillars
    const pillars = {
        survival: 0,
        optional: 0,
        culture: 0,
        extra: 0
    };

    expenses.forEach(t => {
        // Use kakeiboPillar if exists, or auto-categorize fallback
        let pillar = t.kakeiboPillar;
        if (!pillar) {
            const cat = t.kategori?.toLowerCase() || '';
            if (['makanan', 'transport', 'kost', 'tagihan', 'kesehatan'].some(c => cat.includes(c))) pillar = 'survival';
            else if (['edukasi', 'buku', 'kursus', 'donasi'].some(c => cat.includes(c))) pillar = 'culture';
            else if (['hiburan', 'jajan', 'game', 'hobi', 'belanja'].some(c => cat.includes(c))) pillar = 'optional';
            else pillar = 'extra';
        }

        if (pillars[pillar as keyof typeof pillars] !== undefined) {
            pillars[pillar as keyof typeof pillars] += Math.abs(t.jumlah);
        } else {
            pillars['extra'] += Math.abs(t.jumlah); // Fallback
        }
    });

    const data = [
        { name: 'Survival', value: pillars.survival, color: '#3b82f6', icon: '🏠', desc: 'Pokok' },
        { name: 'Optional', value: pillars.optional, color: '#f43f5e', icon: '🍦', desc: 'Jajan' },
        { name: 'Culture', value: pillars.culture, color: '#8b5cf6', icon: '📚', desc: 'Edukasi' },
        { name: 'Extra', value: pillars.extra, color: '#f59e0b', icon: '💊', desc: 'Darurat' },
    ];

    // Tips logic
    const optionalRatio = totalExpense > 0 ? (pillars.optional / totalExpense) : 0;
    const cultureRatio = totalExpense > 0 ? (pillars.culture / totalExpense) : 0;

    let tip = "Pola keuanganmu seimbang! Pertahankan.";
    if (optionalRatio > 0.3) tip = "⚠️ Wah, 'Optional' (Jajan) kamu agak tinggi nih (>30%). Kurangi dikit yuk!";
    if (cultureRatio > 0.1) tip = "✨ Mantap! Kamu investasi banyak di 'Culture' (Edukasi).";
    if (totalExpense === 0) tip = "Belum ada pengeluaran. Hemat pangkal kaya!";

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        🇯🇵 Kakeibo Stats
                    </h3>
                    <p className="text-xs text-slate-500">Filosofi Hemat Jepang</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-xs font-bold">
                    Bulanan
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Chart */}
                <div className="w-32 h-32 shrink-0 relative">
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
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-2xl">👺</span>
                    </div>
                </div>

                {/* Legend & Stats */}
                <div className="flex-1 w-full space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-medium text-slate-600">{item.icon} {item.name}</span>
                                </div>
                                <span className="text-xs font-bold">
                                    {totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Smart Tip */}
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-800 font-medium">
                            💡 {tip}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
