import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { KakeiboDashboard } from '@/components/Kakeibo/KakeiboDashboard';
import { redirect } from "next/navigation";

export default async function KakeiboPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect('/login');

    await dbConnect();

    // Fetch transactions
    const transactions = await Transaction.find({ userId: session.user.id })
        .sort({ tanggal: -1 })
        .lean();

    // Fetch user data (reflections + budgets)
    const user = await User.findById(session.user.id).select('reflections budgets').lean();

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

    // Calculate budgets usage (Quick logic for MVP)
    // In real app, calculate actual spent vs limit per category
    const budgets = user?.budgets?.map((b: any) => {
        // Find spent for this category (simplistic matching)
        // Ideally we filter by current month too
        const spent = serializedTransactions
            .filter((t: any) => t.kategori === b.category && t.type === 'expense')
            .reduce((acc: number, t: any) => acc + Math.abs(t.jumlah), 0);

        return {
            category: b.category,
            limit: b.limit,
            icon: b.icon,
            spent: spent || 0 // Mock actual spent or calc properly
        };
    }) || [];

    return (
        <div className="p-4 md:p-8 space-y-8 pb-24 md:pb-8">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
                        Kakeibo Center
                    </span>
                    <span className="text-2xl">🇯🇵</span>
                </h1>
                <p className="text-slate-500">Pusat evaluasi dan perencanaan keuanganmu.</p>
            </header>

            <KakeiboDashboard
                transactions={serializedTransactions}
                initialReflections={serializedReflections}
                budgets={budgets} // Pass calculated budgets
            />
        </div>
    );
}
