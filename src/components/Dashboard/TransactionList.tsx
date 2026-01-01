'use client';
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TransactionList({ transactions }: { transactions: any[] }) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus transaksi ini?")) return;
        setLoadingId(id);
        await fetch(`/api/transaksi/delete?id=${id}`, { method: 'DELETE' });
        router.refresh();
        setLoadingId(null);
    };

    if (transactions.length === 0) {
        return <p className="text-slate-400 text-center py-10">Belum ada transaksi.</p>;
    }

    return (
        <div className="space-y-4">
            {transactions.map((t: any) => (
                <div key={t._id} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-none last:pb-0 group">
                    <div>
                        <p className="font-medium text-slate-800">{t.judul}</p>
                        {t.deskripsi && (
                            <p className="text-xs text-slate-500 italic mb-1 line-clamp-1">{t.deskripsi}</p>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{t.kategori || 'Umum'}</span>
                            <p className="text-xs text-slate-500">{new Date(t.tanggal).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`font-bold ${t.jumlah > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {t.jumlah > 0 ? '+' : ''} Rp {Math.abs(t.jumlah).toLocaleString('id-ID')}
                        </span>
                        <button
                            onClick={() => handleDelete(t._id)}
                            disabled={loadingId === t._id}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
