import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { DebtList } from "@/components/Debt/DebtList";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { AddDebtForm } from "@/components/Debt/AddDebtForm";

export default async function DebtsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    await dbConnect();
    const user = await User.findById(session.user.id).lean();

    const debts = user.debts || [];

    // Filter by type
    // Debts I Owe = Negative amount (Money leaving me)
    const myDebts = debts.filter((d: any) => d.amount < 0).map((d: any) => ({ ...d, _id: d._id.toString() }));

    // Debts Others Owe Me = Positive amount (Money coming to me)
    const owedToMe = debts.filter((d: any) => d.amount > 0).map((d: any) => ({ ...d, _id: d._id.toString() }));

    const totalOwedAmount = owedToMe.filter((d: any) => !d.isPaid).reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const totalMyDebtAmount = Math.abs(myDebts.filter((d: any) => !d.isPaid).reduce((acc: number, curr: any) => acc + curr.amount, 0));

    return (
        <div className="p-6 md:p-8 space-y-8 pb-24">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        Debt Manager <BookOpen className="w-6 h-6 text-blue-500" />
                    </h1>
                    <p className="text-slate-500">Track loans and repayments easily.</p>
                </div>
                <AddDebtForm />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column 1: People who owe ME (Assets) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="font-bold text-lg text-slate-700">People Who Owe Me</h3>
                        <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                            Total: Rp {totalOwedAmount.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <DebtList debts={owedToMe} type="owed" />
                </div>

                {/* Column 2: Debts I owe others (Liabilities) */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <h3 className="font-bold text-lg text-slate-700">My Debts</h3>
                        <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">
                            Total: Rp {totalMyDebtAmount.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <DebtList debts={myDebts} type="owe" />
                </div>
            </div>
        </div>
    );
}
