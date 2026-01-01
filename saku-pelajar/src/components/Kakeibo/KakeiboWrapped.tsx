'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, ChevronRight, Save, Loader2, Sparkles, X, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/UI/GlassCard';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface KakeiboWrappedProps {
    transactions: any[];
    initialReflections: any[];
    initialDate: string;
}

const PILLARS = {
    survival: { color: '#3b82f6', icon: '🏠', label: 'Survival', desc: 'Wajib Hidup' },
    optional: { color: '#f43f5e', icon: '🍦', label: 'Optional', desc: 'Kenangan' },
    culture: { color: '#8b5cf6', icon: '📚', label: 'Culture', desc: 'Investasi Diri' },
    extra: { color: '#f59e0b', icon: '💊', label: 'Extra', desc: 'Darurat' },
};

function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
}

export function KakeiboWrapped({ transactions, initialReflections, initialDate }: KakeiboWrappedProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date(initialDate));
    const [activeJournal, setActiveJournal] = useState('');
    const [saving, setSaving] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

    // Calculate Week ID: "2024-W01"
    const currentWeekInfo = useMemo(() => {
        const weekNum = getWeekNumber(currentDate);
        return {
            id: `${currentDate.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`,
            label: `Minggu ke-${weekNum}`,
            fullLabel: `Minggu ke-${weekNum}, ${currentDate.getFullYear()}`,
            range: `${new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${new Date(currentDate.setDate(currentDate.getDate() + 6)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
        };
    }, [currentDate]);

    // Load existing reflection
    useMemo(() => {
        const ref = initialReflections.find(r => r.period === currentWeekInfo.id);
        setActiveJournal(ref?.content || '');
    }, [currentWeekInfo.id, initialReflections]);

    // Filter Weekly Transactions
    const weeklyData = useMemo(() => {
        const targetWeek = getWeekNumber(currentDate);
        const targetYear = currentDate.getFullYear();
        return transactions.filter(t => {
            const d = new Date(t.tanggal);
            return getWeekNumber(d) === targetWeek && d.getFullYear() === targetYear;
        });
    }, [transactions, currentDate]);

    // Advanced Stats Calculation
    const stats = useMemo(() => {
        const p = { survival: 0, optional: 0, culture: 0, extra: 0 };
        let income = 0;
        let expense = 0;
        const categoryMap: Record<string, number> = {};
        const dayMap: Record<string, number> = {};

        weeklyData.forEach(t => {
            const d = new Date(t.tanggal).toLocaleDateString('id-ID', { weekday: 'long' });

            if (t.type === 'income') {
                income += t.jumlah;
            } else {
                const amt = Math.abs(t.jumlah);
                expense += amt;

                // Pillar
                let pillar = t.kakeiboPillar as keyof typeof PILLARS;
                // Auto-categorize fallback
                if (!pillar) {
                    const cat = t.kategori?.toLowerCase() || '';
                    if (['makanan', 'transport', 'kost'].some(c => cat.includes(c))) pillar = 'survival';
                    else if (['edukasi', 'buku'].some(c => cat.includes(c))) pillar = 'culture';
                    else if (['hiburan', 'jajan'].some(c => cat.includes(c))) pillar = 'optional';
                    else pillar = 'extra';
                }
                if (p[pillar] !== undefined) p[pillar] += amt;
                else p['extra'] += amt;

                // Category Top
                categoryMap[t.kategori] = (categoryMap[t.kategori] || 0) + amt;

                // Day Top
                dayMap[d] = (dayMap[d] || 0) + amt;
            }
        });

        // Top Category
        const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

        // Busiest Day
        const busyDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

        // Persona Logic
        let persona = { name: 'The Balancer ⚖️', desc: 'Keuanganmus seimbang.' };
        if (expense === 0) persona = { name: 'The Monk 🧘', desc: 'Nol banget pengeluaranmu!' };
        else if (p.optional / expense > 0.5) persona = { name: 'The Sultan 👑', desc: 'Hedon detected! >50% buat senang-senang.' };
        else if (p.survival / expense > 0.8) persona = { name: 'The Survivor 🛡️', desc: 'Full survival mode.' };
        else if (p.culture / expense > 0.3) persona = { name: 'The Scholar 🎓', desc: 'Investasi otak!' };

        const maxPillar = Object.keys(p).reduce((a, b) => p[a as keyof typeof p] > p[b as keyof typeof p] ? a : b) as keyof typeof p;

        return { pillars: p, income, expense, maxPillar, persona, topCategory, busyDay };
    }, [weeklyData]);

    const chartData = Object.entries(stats.pillars).map(([key, value]) => ({
        name: PILLARS[key as keyof typeof PILLARS].label,
        value,
        color: PILLARS[key as keyof typeof PILLARS].color,
        icon: PILLARS[key as keyof typeof PILLARS].icon
    }));

    const handleSaveReflection = async () => {
        setSaving(true);
        try {
            await fetch('/api/kakeibo/reflection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    period: currentWeekInfo.id,
                    content: activeJournal
                })
            });

            // Sync & Celebrate
            router.refresh();
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

            // Move to Outro Slide
            setSlideIndex(slides.length - 1);
        } catch (e) {
            alert('Gagal menyimpan.');
        } finally {
            setSaving(false);
        }
    };

    const changeWeek = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (delta * 7));
        setCurrentDate(newDate);
        setSlideIndex(0);
    };

    // --- SLIDES DEFINITION ---
    const slides = [
        // 0. Cover
        <div key="cover" className="flex flex-col items-center justify-center h-full text-center space-y-6 bg-gradient-to-br from-indigo-600 to-violet-800 text-white p-8 rounded-3xl">
            <div className="text-sm font-bold tracking-[0.3em] opacity-70 uppercase animate-pulse">Weekly Wrapped</div>
            <h1 className="text-5xl font-extrabold leading-tight">
                {currentWeekInfo.label}
            </h1>
            <p className="text-indigo-200">{currentWeekInfo.range}</p>
            <div className="mt-8 bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <span className="text-4xl">🎁</span>
            </div>
            <p className="text-sm opacity-80 mt-4">Tap 'Next' untuk membuka cerita keuanganmu.</p>
        </div>,

        // 1. Money Moves (Income vs Expense)
        <div key="moves" className="flex flex-col items-center justify-center h-full text-center space-y-4 p-4">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Arus Kas</h3>

            <div className="w-full bg-green-50 p-6 rounded-3xl border border-green-100">
                <p className="text-green-600 font-bold text-sm mb-1">Uang Masuk</p>
                <div className="text-3xl font-extrabold text-green-700">Rp {stats.income.toLocaleString()}</div>
            </div>

            <div className="text-2xl text-slate-300">vs</div>

            <div className="w-full bg-red-50 p-6 rounded-3xl border border-red-100">
                <p className="text-red-600 font-bold text-sm mb-1">Uang Keluar</p>
                <div className="text-3xl font-extrabold text-red-700">Rp {stats.expense.toLocaleString()}</div>
            </div>

            <div className="mt-4 text-sm text-slate-500 font-medium">
                {stats.income > stats.expense ? "✨ Surplus! Aman sentosa." : "💸 Defisit! Awas boncos."}
            </div>
        </div>,

        // 2. The Villain (Top Expense)
        <div key="villain" className="flex flex-col items-center justify-center h-full text-center space-y-6 bg-slate-900 text-white p-8 rounded-3xl">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs">Pengeluaran Terbesar</h3>

            {stats.expense > 0 ? (
                <>
                    <div className="text-6xl animate-bounce mb-4">😈</div>
                    <div>
                        <div className="text-4xl font-extrabold text-red-400 mb-2">{stats.topCategory[0]}</div>
                        <div className="text-xl text-slate-300">Rp {stats.topCategory[1].toLocaleString()}</div>
                    </div>
                    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                        Ini adalah "Villain" minggu ini. Sektor <span className="text-white font-bold">{stats.topCategory[0]}</span> memakan porsi terbesar dompetmu.
                    </p>
                </>
            ) : (
                <>
                    <div className="text-6xl animate-pulse mb-4">😇</div>
                    <div>
                        <div className="text-4xl font-extrabold text-blue-400 mb-2">Belum Ada!</div>
                        <div className="text-xl text-slate-300">Rp 0</div>
                    </div>
                    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                        Minggu ini dompetmu aman dari serangan Villain pengeluaran. Pertahankan!
                    </p>
                </>
            )}
        </div>,

        // 3. The Breakdown + Persona
        <div key="breakdown" className="flex flex-col h-full py-4 px-2">
            <div className="text-center mb-4">
                <div className="text-xs text-slate-400 font-bold uppercase">Persona Minggu Ini</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-1">
                    {stats.persona.name}
                </div>
                <p className="text-xs text-slate-500">{stats.persona.desc}</p>
            </div>

            <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString()}`} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl">{PILLARS[stats.maxPillar].icon}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                {chartData.map((item) => (
                    <div key={item.name} className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">{item.name}</div>
                            <div className="text-sm font-bold text-slate-700">Rp {(item.value / 1000).toFixed(0)}k</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>,

        // 4. Oracle (Prediction)
        <div key="prediction" className="flex flex-col items-center justify-center h-full text-center space-y-6 py-6 border-4 border-double border-purple-100 rounded-3xl bg-purple-50/50">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-6xl">🔮</span>
            </div>
            <h3 className="font-bold text-xl text-purple-900">Ramalan Keuangan</h3>

            <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-xs">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Estimasi Minggu Depan</p>
                <div className="text-3xl font-extrabold text-slate-800">
                    Rp {Math.round(stats.expense * 1.1).toLocaleString()}
                </div>
                <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 inline-block px-2 py-1 rounded-lg">
                    📈 Trending Naik 10%
                </p>
            </div>

            <p className="text-sm text-purple-700 max-w-xs px-4">
                "Kaca benggala melihat hari terborosmu adalah <span className="font-bold">{stats.busyDay[0]}</span>. Hati-hati di hari itu minggu depan!"
            </p>
        </div>,

        // 5. Hansei (Input)
        <div key="hansei" className="flex flex-col h-full py-2">
            <div className="flex items-center gap-3 mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <span className="text-2xl">✍️</span>
                <div>
                    <h3 className="font-bold text-slate-800">Saatnya Hansei</h3>
                    <p className="text-xs text-slate-500">Jujurlah pada dirimu sendiri.</p>
                </div>
            </div>
            <textarea
                className="flex-1 w-full bg-white p-6 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 outline-none resize-none font-handwriting text-slate-700 leading-loose text-xl shadow-inner"
                placeholder="Minggu ini aku boros di kopi karena..."
                value={activeJournal}
                onChange={(e) => setActiveJournal(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
            />
            <button
                onClick={handleSaveReflection}
                disabled={saving || !activeJournal.trim()}
                className="mt-4 w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
                {saving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                Simpan & Selesai
            </button>
        </div>,

        // 6. Outro (Success)
        <div key="outro" className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-6xl animate-bounce">
                ✅
            </div>
            <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Evaluasi Tercatat!</h2>
                <p className="text-slate-500 mt-2">Datarimu sudah tersimpan aman.</p>
            </div>

            <div className="w-full space-y-3">
                <button
                    onClick={() => router.push('/kakeibo')}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                    Kembali ke Dashboard <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-slate-400">
                    Kamu bisa melihat riwayat evaluasi ini di halaman utama Kakeibo.
                </p>
            </div>
        </div>
    ];

    return (
        <div className="w-full max-w-md mx-auto h-[600px]">
            {/* Slide Container */}
            <GlassCard className="h-full flex flex-col relative overflow-hidden shadow-2xl border-0 ring-1 ring-white/20">
                {/* Progress Bar (Hide on Cover and Outro) */}
                {slideIndex > 0 && slideIndex < slides.length - 1 && (
                    <div className="absolute top-0 left-0 right-0 flex h-1.5 bg-slate-100 z-20">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 transition-all duration-300 border-r border-white/20 ${i <= slideIndex ? 'bg-indigo-500' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>
                )}

                <div className="flex-1 p-6 relative overflow-y-auto overflow-x-hidden hide-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slideIndex}
                            initial={{ x: 50, opacity: 0, scale: 0.95 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -50, opacity: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-full"
                        >
                            {slides[slideIndex]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls (Hide on Outro) */}
                {slideIndex < slides.length - 1 && (
                    <div className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-md absolute bottom-0 w-full z-20 border-t border-slate-100">
                        <button
                            onClick={() => setSlideIndex(Math.max(0, slideIndex - 1))}
                            disabled={slideIndex === 0}
                            className="p-3 rounded-full hover:bg-slate-200 transition disabled:opacity-0"
                        >
                            <ChevronLeft className="w-6 h-6 text-slate-700" />
                        </button>

                        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                            {slideIndex === 0 ? 'START' : `${slideIndex} / ${slides.length - 2}`}
                        </span>

                        <button
                            onClick={() => setSlideIndex(Math.min(slides.length - 1, slideIndex + 1))}
                            className="p-3 rounded-full bg-slate-900 text-white shadow-lg hover:scale-110 transition active:scale-95"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
