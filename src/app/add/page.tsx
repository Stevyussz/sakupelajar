'use client';
import { CurrencyInput } from '@/components/UI/CurrencyInput';
import { CategorySelector } from "@/components/UI/CategorySelector";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from "@/components/UI/GlassCard";
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { ReceiptScanner } from '@/components/Transaction/ReceiptScanner';

export default function AddTransactionPage() {
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [tipe, setTipe] = useState<'masuk' | 'keluar'>('keluar');
    const [kategori, setKategori] = useState('Lainnya');
    const [customCategory, setCustomCategory] = useState('');
    const [savedCustomCategories, setSavedCustomCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Kakeibo State
    const [kakeiboPillar, setKakeiboPillar] = useState('survival');

    // Derived Type Logic
    const getTypeFromPillar = (p: string) => {
        if (p === 'survival' || p === 'culture') return 'need';
        return 'want';
    };

    useEffect(() => {
        // Fetch custom categories
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                console.log("[AddPage] Fetched categories:", data);
                if (data.success) {
                    setSavedCustomCategories(data.data || []);
                }
            })
            .catch(err => console.error("Failed to fetch categories", err));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const nominal = tipe === 'keluar' ? -Math.abs(Number(jumlah.replace(/\D/g, ''))) : Math.abs(Number(jumlah.replace(/\D/g, '')));

        const transactionType = tipe === 'masuk' ? 'income' : getTypeFromPillar(kakeiboPillar);
        const finalCategory = kategori === 'Lainnya' && customCategory ? customCategory : kategori;

        const res = await fetch('/api/transaksi', {
            method: 'POST',
            body: JSON.stringify({
                judul,
                deskripsi,
                jumlah: nominal,
                kategori: finalCategory,
                type: transactionType,
                kakeiboPillar // Send new field
            }),
        });

        if (res.ok) {
            router.push('/');
            router.refresh();
        } else {
            setLoading(false);
            alert('Gagal menyimpan!');
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center font-sans pb-20">
            <div className="w-full max-w-md">
                <Link href="/" className="flex items-center text-slate-500 mb-6 hover:text-blue-600 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Dashboard
                </Link>

                <GlassCard className="p-8">
                    <h1 className="text-2xl font-bold mb-6 text-slate-800">Tambah Transaksi</h1>

                    {/* AI Scanner */}
                    <ReceiptScanner onScanComplete={(amount, text) => {
                        setJumlah(amount.toString());
                        setJudul(text.substring(0, 30)); // Take first 30 chars as default title
                        setDeskripsi(text); // Put full text in description
                    }} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tipe Selector */}
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                            <button type="button" onClick={() => setTipe('masuk')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${tipe === 'masuk' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}>Pemasukan</button>
                            <button type="button" onClick={() => setTipe('keluar')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${tipe === 'keluar' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}>Pengeluaran</button>
                        </div>

                        {/* Category Selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                            <CategorySelector
                                selected={kategori}
                                onSelect={setKategori}
                                customCategories={savedCustomCategories}
                            />

                            {/* Custom Category Input */}
                            {kategori === 'Lainnya' && (
                                <div className="mt-3 animate-fade-in">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Nama Kategori Custom</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Skincare, Gacha"
                                        value={customCategory}
                                        onChange={e => setCustomCategory(e.target.value)}
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Kakeibo Pillar Selection (Only for Expense) */}
                        {tipe === 'keluar' && (
                            <div className="space-y-3 animate-fade-in">
                                <label className="text-sm font-bold text-slate-700">Kategori Kakeibo 🇯🇵</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { id: 'survival', label: 'Survival', icon: '🏠', desc: 'Pokok/Wajib' },
                                        { id: 'optional', label: 'Optional', icon: '🍦', desc: 'Jajan/Hiburan' },
                                        { id: 'culture', label: 'Culture', icon: '📚', desc: 'Edukasi/Skill' },
                                        { id: 'extra', label: 'Extra', icon: '💊', desc: 'Darurat/Lain' }
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setKakeiboPillar(p.id)}
                                            className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${kakeiboPillar === p.id
                                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200'
                                                : 'bg-white border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span className="text-2xl mb-1">{p.icon}</span>
                                            <span className="font-bold text-xs text-slate-700">{p.label}</span>
                                            <span className="text-[10px] text-slate-400">{p.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Transaksi</label>
                                <input type="text" placeholder="Contoh: Uang Saku, Beli Kuota" value={judul} onChange={e => setJudul(e.target.value)} className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi (Opsional)</label>
                                <textarea
                                    placeholder="Contoh: Makan bareng teman di kantin..."
                                    value={deskripsi}
                                    onChange={e => setDeskripsi(e.target.value)}
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-24 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nominal</label>
                                <CurrencyInput
                                    placeholder="0"
                                    value={jumlah}
                                    onChange={setJumlah}
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-lg font-semibold"
                                    required
                                />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-500/30 flex justify-center items-center text-lg">
                            {loading ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Simpan</>}
                        </button>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}
