import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { WishlistCard } from "@/components/Gamification/WishlistCard";
import { AddWishlistForm } from "./AddWishlistForm";

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    await dbConnect();
    const user = await User.findById(session.user.id).lean();

    // --- SMART FORECAST LOGIC ---
    // 1. Get date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // 2. Fetch transactions
    const transactions = await Transaction.find({
        userId: session.user.id,
        tanggal: { $gte: threeMonthsAgo }
    });

    // 3. Calculate Surplus
    const totalIncome = transactions.filter(t => t.jumlah > 0).reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalExpense = transactions.filter(t => t.jumlah < 0).reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);
    const netSavings = totalIncome - totalExpense;

    // Average over 3 months (safeguard against negative surplus in UI later)
    const monthlySurplus = Math.round(netSavings / 3);

    const wishlist = user.wishlist.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
    }));

    return (
        <div className="p-6 md:p-8 space-y-8">
            <header>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Wishlist 🚀</h1>
                        <p className="text-slate-500">Set goals and make them happen!</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-400 font-bold uppercase">Avg. Monthly Surplus</p>
                        <p className={`text-xl font-bold ${monthlySurplus > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                            Rp {monthlySurplus.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </header>

            {/* Add New Wishlist Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AddWishlistForm />

                {wishlist.map((item: any) => (
                    <WishlistCard key={item._id} item={item} monthlySurplus={monthlySurplus} />
                ))}
            </div>
        </div>
    );
}
