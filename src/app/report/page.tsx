'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
    _id: string;
    judul: string;
    jumlah: number;
    kategori: string;
    tanggal: string;
    deskripsi?: string;
    type: string;
}

export default function ReportPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setLoading(true);
        // Reuse analytics logic via params or just fetch all and filter client side for simplicity?
        // Let's rely on analytics API logic or similar. 
        // Actually, just fetching all for that month is best.
        // We can reuse URL params logic on the API side if we had one.
        // Let's just fetch all and filter client side to be safe and fast.

        fetch('/api/transaksi')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const filtered = data.data.filter((t: Transaction) => {
                        const d = new Date(t.tanggal);
                        return d.getMonth() === month && d.getFullYear() === year;
                    });
                    setTransactions(filtered.sort((a: Transaction, b: Transaction) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()));
                }
                setLoading(false);
            });
    }, [month, year]);

    const totalIncome = transactions.filter(t => t.jumlah > 0).reduce((acc, t) => acc + t.jumlah, 0);
    const totalExpense = transactions.filter(t => t.jumlah < 0).reduce((acc, t) => acc + Math.abs(t.jumlah), 0);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-8 print:p-0">
            {/* No-Print Header */}
            <div className="max-w-4xl mx-auto mb-8 print:hidden flex justify-between items-center">
                <Link href="/" className="flex items-center text-slate-500 hover:text-blue-600">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to App
                </Link>
                <div className="flex gap-4 items-center">
                    <select
                        value={month}
                        onChange={e => setMonth(parseInt(e.target.value))}
                        className="p-2 border rounded-lg"
                    >
                        {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>{new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select
                        value={year}
                        onChange={e => setYear(parseInt(e.target.value))}
                        className="p-2 border rounded-lg"
                    >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                    <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700">
                        <Printer className="w-5 h-5 mr-2" /> Print / Save PDF
                    </button>
                </div>
            </div>

            {/* Printable Content */}
            <div className="max-w-4xl mx-auto bg-white print:w-full">
                <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Laporan Keuangan</h1>
                    <p className="text-slate-500">SakuPelajar Monthly Report</p>
                    <p className="font-bold mt-2 text-xl">{new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 print:bg-white print:border-slate-800">
                        <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Total Pemasukan</p>
                        <p className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 print:bg-white print:border-slate-800">
                        <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Total Pengeluaran</p>
                        <p className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-800">
                            <th className="py-3 font-bold uppercase text-xs tracking-wider">Tanggal</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider">Keterangan</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider">Kategori</th>
                            <th className="py-3 font-bold uppercase text-xs tracking-wider text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="py-8 text-center text-slate-400">Loading data...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan={4} className="py-8 text-center text-slate-400">Tidak ada transaksi.</td></tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t._id} className="border-b border-slate-100 last:border-0 print:border-slate-300">
                                    <td className="py-3 text-slate-500">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                                    <td className="py-3 font-medium text-slate-800">
                                        {t.judul}
                                        {t.deskripsi && <div className="text-xs text-slate-400 italic mt-0.5">{t.deskripsi}</div>}
                                    </td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 rounded bg-slate-100 text-xs font-bold uppercase tracking-wider print:bg-transparent print:border print:border-slate-300">
                                            {t.kategori}
                                        </span>
                                    </td>
                                    <td className={`py-3 text-right font-bold ${t.jumlah > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.jumlah > 0 ? '+' : ''} Rp {Math.abs(t.jumlah).toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-slate-800">
                            <td colSpan={3} className="py-4 font-bold text-right uppercase tracking-wider pr-4">Saldo Akhir Bulan</td>
                            <td className={`py-4 font-bold text-right text-lg ${(totalIncome - totalExpense) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                Rp {(totalIncome - totalExpense).toLocaleString('id-ID')}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 print:mt-24">
                    <p>Generated by SakuPelajar App on {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
