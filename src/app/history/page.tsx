import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { HistoryList } from "@/components/History/HistoryList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);
    if (!session) return <p>Unauthorized</p>;

    await dbConnect();

    // Fetch all transactions (limit to 100 or so for performance, but user asked for search so lets fetch most recent 200)
    const transactions = await Transaction.find({ userId: session.user.id })
        .sort({ tanggal: -1 })
        .limit(200)
        .lean();

    // Serialize for Client Component
    const serializedTransactions = transactions.map((t: any) => ({
        ...t,
        _id: t._id.toString(),
        userId: t.userId.toString(),
        tanggal: t.tanggal.toISOString()
    }));

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-24">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-2 transition">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Riwayat Transaksi 📜</h1>
                    <p className="text-slate-500">Cari, filter, dan kelola semua transaksimu.</p>
                </header>

                <HistoryList initialTransactions={serializedTransactions} />
            </div>
        </div>
    );
}
