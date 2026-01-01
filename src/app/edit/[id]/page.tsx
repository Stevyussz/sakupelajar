'use client';

import { CurrencyInput } from '@/components/UI/CurrencyInput';
import { CategorySelector } from "@/components/UI/CategorySelector";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GlassCard } from "@/components/UI/GlassCard";
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditTransactionPage() {
    const params = useParams();
    // Unwrap the ID safely
    const id = params?.id as string;

    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [tipe, setTipe] = useState<'masuk' | 'keluar'>('keluar');
    const [kategori, setKategori] = useState('Lainnya');
    const [customCategory, setCustomCategory] = useState('');
    const [savedCustomCategories, setSavedCustomCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const [necessity, setNecessity] = useState<'need' | 'want'>('need');

    useEffect(() => {
        if (!id) return;

        // Fetch custom categories
        fetch('/api/categories').then(res => res.json()).then(data => {
            if (data.success) setSavedCustomCategories(data.data || []);
        });

        // Fetch transaction details
        fetch(`/api/transaksi/detail?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const t = data.data;
                    setJudul(t.judul);
                    setDeskripsi(t.deskripsi || '');
                    setJumlah(Math.abs(t.jumlah).toString());
                    setTipe(t.jumlah > 0 ? 'masuk' : 'keluar');
                    setKategori(t.kategori);
                    setNecessity(t.type === 'want' ? 'want' : 'need');
                } else {
                    alert("Transaksi tidak ditemukan");
                    router.push('/history');
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const nominal = tipe === 'keluar' ? -Math.abs(Number(jumlah.replace(/\D/g, ''))) : Math.abs(Number(jumlah.replace(/\D/g, '')));

        const transactionType = tipe === 'masuk' ? 'income' : necessity;
        const finalCategory = kategori === 'Lainnya' && customCategory ? customCategory : kategori;

        const res = await fetch('/api/transaksi', {
            method: 'PUT',
            body: JSON.stringify({
                _id: id,
                judul,
                deskripsi,
                jumlah: nominal,
                kategori: finalCategory,
                type: transactionType
            }),
        });

        if (res.ok) {
            router.push('/history');
            router.refresh();
        } else {
            setSaving(false);
            alert('Gagal mengupdate!');
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center font-sans pb-20">
            <div className="w-full max-w-md">
                <Link href="/history" className="flex items-center text-slate-500 mb-6 hover:text-blue-600 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Batal Edit
                </Link>

                <GlassCard className="p-8">
                    <h1 className="text-2xl font-bold mb-6 text-slate-800">Edit Transaksi</h1>

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
                                    />
                                </div>
                            )}
                        </div>

                        {/* Necessity Selector (Only for Expense) */}
                        {tipe === 'keluar' && (
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 animate-fade-in">
                                <label className="block text-sm font-bold text-yellow-800 mb-2">Apakah ini Kebutuhan atau Keinginan?</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNecessity('need')}
                                        className={`flex-1 p-3 rounded-lg border-2 transition flex flex-col items-center gap-1 ${necessity === 'need' ? 'border-green-500 bg-green-50 text-green-700' : 'border-transparent bg-white text-slate-400'}`}
                                    >
                                        <span className="text-xl">🍞</span>
                                        <span className="font-bold text-sm">Butuh (Need)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNecessity('want')}
                                        className={`flex-1 p-3 rounded-lg border-2 transition flex flex-col items-center gap-1 ${necessity === 'want' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-transparent bg-white text-slate-400'}`}
                                    >
                                        <span className="text-xl">🎮</span>
                                        <span className="font-bold text-sm">Ingin (Want)</span>
                                    </button>
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

                        <button disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-500/30 flex justify-center items-center text-lg">
                            {saving ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Update Transaksi</>}
                        </button>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}
