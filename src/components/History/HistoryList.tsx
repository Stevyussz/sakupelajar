'use client';

import { useState } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, Edit, Trash2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/UI/GlassCard';

interface Transaction {
    _id: string;
    judul: string;
    jumlah: number;
    kategori: string;
    tanggal: string;
    deskripsi?: string;
    type: string;
}

export function HistoryList({ initialTransactions }: { initialTransactions: Transaction[] }) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
    const router = useRouter();

    const filtered = transactions
        .filter(t => {
            const matchSearch = t.judul.toLowerCase().includes(search.toLowerCase()) ||
                (t.deskripsi && t.deskripsi.toLowerCase().includes(search.toLowerCase())) ||
                t.kategori.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType === 'all'
                ? true
                : filterType === 'income' ? t.jumlah > 0 : t.jumlah < 0;
            return matchSearch && matchType;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case 'newest': return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
                case 'oldest': return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
                case 'highest': return Math.abs(b.jumlah) - Math.abs(a.jumlah);
                case 'lowest': return Math.abs(a.jumlah) - Math.abs(b.jumlah);
                default: return 0;
            }
        });

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus transaksi ini?')) return;
        await fetch(`/api/transaksi/delete?id=${id}`, { method: 'DELETE' });
        setTransactions(prev => prev.filter(t => t._id !== id));
        router.refresh(); // Refresh server data
    };

    return (
        <div className="space-y-6">
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value as any)}
                        className="p-3 rounded-xl border border-slate-200 bg-white outline-none"
                    >
                        <option value="all">Semua</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value as any)}
                        className="p-3 rounded-xl border border-slate-200 bg-white outline-none"
                    >
                        <option value="newest">Terbaru</option>
                        <option value="oldest">Terlama</option>
                        <option value="highest">Terbesar</option>
                        <option value="lowest">Terkecil</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Filter className="w-10 h-10 mx-auto mb-2 opacity-20" />
                        <p>Tidak ada transaksi ditemukan</p>
                    </div>
                ) : (
                    filtered.map(t => (
                        <div key={t._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.jumlah > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {t.jumlah > 0 ? <ArrowDown className="w-5 h-5 rotate-180" /> : <ArrowUp className="w-5 h-5 rotate-180" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{t.judul}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded uppercase font-bold tracking-wider text-[10px]">{t.kategori}</span>
                                        <span>•</span>
                                        {/* Use consistent date formatting for hydration */}
                                        <span>{new Date(t.tanggal).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    {t.deskripsi && <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">{t.deskripsi}</p>}
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`font-bold ${t.jumlah > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.jumlah > 0 ? '+' : ''} Rp {Math.abs(t.jumlah).toLocaleString('id-ID')}
                                </p>
                                <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => router.push(`/edit/${t._id}`)}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t._id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
