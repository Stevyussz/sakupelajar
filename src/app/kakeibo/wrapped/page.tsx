import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { KakeiboWrapped } from '@/components/Kakeibo/KakeiboWrapped';
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function KakeiboWrappedPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    await dbConnect();

    // Fetch transactions
    const transactions = await Transaction.find({ userId: session.user.id })
        .sort({ tanggal: -1 })
        .lean();

    // Fetch reflections
    const user = await User.findById(session.user.id).select('reflections').lean();

    // Serialize
    const serializedTransactions = transactions.map((t: any) => ({
        ...t,
        _id: t._id.toString(),
        userId: t.userId.toString(),
        tanggal: t.tanggal.toISOString()
    }));

    const serializedReflections = user?.reflections?.map((r: any) => ({
        period: r.period || r.month,
        content: r.content,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
    })) || [];

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="fixed top-4 left-4 z-50">
                <Link href="/kakeibo" className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm font-bold text-slate-600 hover:bg-white transition hover:text-slate-900 border border-slate-200">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Kakeibo
                </Link>
            </div>

            <div className="flex items-center justify-center min-h-screen p-4 py-20">
                <KakeiboWrapped
                    transactions={serializedTransactions}
                    initialReflections={serializedReflections}
                    initialDate={new Date().toISOString()}
                />
            </div>
        </div>
    );
}
