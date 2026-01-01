import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";
import { LandingPage } from "@/components/LandingPage";
import { BudgetManager } from "@/components/Budget/BudgetManager";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function BudgetPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <LandingPage />;
    }

    await dbConnect();

    // Calculate spent amount dynamically based on period
    // Reuse logic from /api/budget/route.ts but with direct DB access
    // This ensures Server Components render fast
    const transactions = await Transaction.find({ userId: session.user.id });
    const user = await User.findById(session.user.id).select('budgets').lean();
    const budgets = user?.budgets || [];

    const budgetStats = budgets.map((b: any) => {
        const now = new Date();
        const period = b.period || 'monthly';

        const spent = transactions
            .filter(t => {
                // Must match category
                if (t.kategori !== b.category || t.jumlah >= 0) return false;

                const tDate = new Date(t.tanggal);
                if (period === 'daily') {
                    // Match exact date
                    return tDate.toDateString() === now.toDateString();
                } else if (period === 'weekly') {
                    // Simple week check: same ISO week? 
                    // For MVP, lets just check last 7 days? Or fixed week?
                    // Let's stick to "This week" (Monday-Sunday)
                    const day = now.getDay() || 7;
                    const weekStart = new Date(now);
                    weekStart.setHours(0, 0, 0, 0);
                    weekStart.setDate(now.getDate() - day + 1);
                    return tDate >= weekStart;
                } else {
                    // Match Month/Year
                    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
                }
            })
            .reduce((acc: number, curr: any) => acc + Math.abs(curr.jumlah), 0);

        return {
            ...b,
            _id: b._id.toString(),
            spent,
            period
        };
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="max-w-md mx-auto relative">

                {/* Header */}
                <div className="bg-indigo-600 p-8 pb-16 rounded-b-[3rem] shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="text-9xl">✉️</span>
                    </div>

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <Link href="/" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-bold">Amplop Budget</h1>
                    </div>

                    <div className="relative z-10">
                        <p className="text-indigo-200 text-sm mb-1">Total Anggaran Bulanan</p>
                        <h2 className="text-4xl font-extrabold">
                            Rp {budgetStats.reduce((acc: number, b: any) => acc + (b.period === 'daily' ? b.limit * 30 : b.limit), 0).toLocaleString('id-ID')}
                        </h2>
                        <p className="text-xs text-indigo-300 mt-2">*Termasuk estimasi harian x 30</p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 -mt-10 relative z-20">
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <span className="text-xl">📊</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Manajemen Amplop</h3>
                                <p className="text-xs text-slate-500">Atur batas pengeluaranmu disini.</p>
                            </div>
                        </div>

                        {/* Reuse the BudgetManager component which we upgraded */}
                        <BudgetManager budgets={budgetStats} />
                    </div>

                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">💡 Tips Hemat</h3>
                        <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
                            <li>Gunakan mode <b>Daily</b> untuk pengeluaran rutin seperti Jajan & Kopi.</li>
                            <li>Gunakan mode <b>Monthly</b> untuk tagihan tetap seperti Listrik & Internet.</li>
                            <li>Jika budget merah, saatnya puasa jajan! 🤐</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
