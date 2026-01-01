export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { ExpenseChart } from "@/components/Charts/ExpenseChart";
import { SpendingDNA } from "@/components/Dashboard/SpendingDNA";
import { DateRangeFilter } from "@/components/Analytics/DateRangeFilter";
import Link from "next/link";
import { ArrowLeft, TrendingDown, TrendingUp, DollarSign, Calendar, FileText } from "lucide-react";

import User from "@/models/User";
import { CategoryChart } from "@/components/Charts/CategoryChart";
import { BudgetProgress } from "@/components/Analytics/BudgetProgress";

export default async function AnalyticsPage(props: { searchParams: Promise<{ month?: string, year?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    await dbConnect();

    // Default to current date if params missing
    const now = new Date();
    const currentMonth = searchParams.month !== undefined ? parseInt(searchParams.month) : now.getMonth();
    const currentYear = searchParams.year !== undefined ? parseInt(searchParams.year) : now.getFullYear();

    // Calculate start/end dates for filtering
    const startDate = new Date(currentYear, currentMonth, 1);
    // Use start of NEXT month for the upper bound to ensure we catch all times in the current month
    const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);

    console.log(`[Analytics] Fetching for range: ${startDate.toISOString()} to ${nextMonthStart.toISOString()}`);

    // Fetch Transactions for specific month/year
    const transactions = await Transaction.find({
        userId: session.user.id,
        tanggal: {
            $gte: startDate,
            $lt: nextMonthStart // strictly less than 1st of next month
        }
    }).sort({ tanggal: -1 });

    console.log(`[Analytics] Found ${transactions.length} transactions`);

    // Fetch User Budget for Comparison
    const user = await User.findById(session.user.id).select('budgets').lean();
    const budgets = user?.budgets || [];
    const totalBudgetLimit = budgets.reduce((acc: number, curr: any) => acc + curr.limit, 0);

    // --- METRICS CALCULATION ---
    const totalIncome = transactions.filter(t => t.jumlah > 0).reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalExpense = transactions.filter(t => t.jumlah < 0).reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);
    const transactionCount = transactions.length;

    // Daily Average (Prevent division by zero)
    const currentDay = now.getMonth() === currentMonth && now.getFullYear() === currentYear ? now.getDate() : new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyAverage = totalExpense / (currentDay || 1);

    // Top Expense
    const expenses = transactions.filter(t => t.jumlah < 0);
    const topTransaction = expenses.length > 0 ? expenses.reduce((prev, current) => (Math.abs(prev.jumlah) > Math.abs(current.jumlah)) ? prev : current) : null;

    // --- COMPARISON DATA (PREVIOUS MONTH) ---
    // Calculate dates for previous month
    const prevMonthDate = new Date(startDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);

    // Start of previous month
    const prevMonthStart = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), 1);
    // Start of current month (end of previous month range)
    const prevMonthEnd = new Date(startDate);

    const prevTransactions = await Transaction.find({
        userId: session.user.id,
        tanggal: {
            $gte: prevMonthStart,
            $lt: prevMonthEnd
        }
    });

    const prevTotalExpense = prevTransactions.filter(t => t.jumlah < 0).reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);

    // Calculate Trend
    let trendPercentage = 0;
    let trendLabel = "vs last month";
    let trendGood = true; // Less spending is generally good

    if (prevTotalExpense > 0) {
        trendPercentage = Math.round(((totalExpense - prevTotalExpense) / prevTotalExpense) * 100);
    } else if (totalExpense > 0) {
        trendPercentage = 100; // 100% increase if prev was 0
    }

    // Interpret Trend
    if (trendPercentage > 0) {
        trendLabel = `${trendPercentage}% more than last month`;
        trendGood = false;
    } else if (trendPercentage < 0) {
        trendLabel = `${Math.abs(trendPercentage)}% less than last month`;
        trendGood = true;
    } else {
        trendLabel = "Same as last month";
    }

    // Category Data for Chart
    const categories: { [key: string]: number } = {};
    expenses.forEach(t => {
        categories[t.kategori] = (categories[t.kategori] || 0) + Math.abs(t.jumlah);
    });

    // Define colors for categories
    const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b'];
    const categoryData = Object.keys(categories).map((key, index) => ({
        name: key,
        value: categories[key],
        color: COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value); // Sort highest first

    // Prepare Chart Data (Daily)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const chartData = Array.from({ length: daysInMonth }).map((_, i) => {
        const d = new Date(currentYear, currentMonth, i + 1);
        const dayName = d.toLocaleDateString('en-US', { day: 'numeric' });

        const dailyTrans = transactions.filter(t =>
            new Date(t.tanggal).toDateString() === d.toDateString()
        );

        return {
            name: dayName,
            income: dailyTrans.filter(t => t.jumlah > 0).reduce((acc, curr) => acc + curr.jumlah, 0),
            expense: dailyTrans.filter(t => t.jumlah < 0).reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0)
        };
    });

    const safeTransactions = JSON.parse(JSON.stringify(transactions));

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-24 md:pb-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-2 transition">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Financial Analytics 📊</h1>
                    <p className="text-slate-500 text-sm">Deep dive into your spending habits.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/report" className="hidden md:flex items-center bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm">
                        <FileText className="w-4 h-4 mr-2" /> Laporan
                    </Link>
                    <DateRangeFilter currentMonth={currentMonth} currentYear={currentYear} />
                </div>
            </header>

            {transactions.length === 0 ? (
                <div className="max-w-md mx-auto mt-20">
                    <div className="bg-white p-8 rounded-3xl shadow-sm text-center border dashed border-2 border-slate-200">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Data for this Month</h3>
                        <p className="text-slate-400 mb-6">You haven't recorded any transactions for {startDate.toLocaleString('default', { month: 'long', year: 'numeric' })} yet.</p>
                        <Link href="/add" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                            Start Recording
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 max-w-6xl mx-auto">
                    {/* 1. Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <BudgetProgress totalBudget={totalBudgetLimit} totalSpent={totalExpense} />

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                                <Calendar className="w-16 h-16 text-purple-600" />
                            </div>
                            <div className="flex items-center gap-3 text-purple-600 mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg"><Calendar className="w-4 h-4" /></div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Average</h4>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">Rp {Math.round(dailyAverage).toLocaleString('id-ID')}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className={`text-xs font-bold ${trendGood ? 'text-green-500' : 'text-red-500'}`}>
                                    {trendGood ? <TrendingDown className="w-3 h-3 inline" /> : <TrendingUp className="w-3 h-3 inline" />}
                                    {trendLabel}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 text-rose-600 mb-2">
                                <div className="p-2 bg-rose-100 rounded-lg"><TrendingDown className="w-4 h-4" /></div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Expense</h4>
                            </div>
                            <p className="text-lg font-bold text-slate-800 truncate">{topTransaction ? topTransaction.keterangan : '-'}</p>
                            <p className="text-sm font-bold text-rose-600 mt-1">
                                {topTransaction ? `-Rp ${Math.abs(topTransaction.jumlah).toLocaleString('id-ID')}` : 'No expenses'}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                <div className="p-2 bg-emerald-100 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Savings Rate</h4>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">
                                {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
                            </p>
                            <p className="text-xs text-slate-400 mt-1">of income saved</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <ExpenseChart data={chartData} />

                            {/* Spending DNA (Moved here for more width) */}
                            <SpendingDNA transactions={safeTransactions} />
                        </div>

                        {/* Right Column: Key Metrics & Categories */}
                        <div className="space-y-6">
                            {/* Category Breakdown (Vertical Bar Chart fits sidebar well) */}
                            {categoryData.length > 0 && <CategoryChart data={categoryData} />}

                            {/* Top Transactions List */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" /> Top Expenses
                                </h3>
                                <div className="space-y-4">
                                    {expenses.sort((a, b) => a.jumlah - b.jumlah).slice(0, 5).map((t, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                            <div className="flex-1 truncate pr-4">
                                                <p className="font-bold text-slate-700 truncate">{t.keterangan}</p>
                                                <p className="text-xs text-slate-400">{new Date(t.tanggal).toLocaleDateString()}</p>
                                            </div>
                                            <span className="font-bold text-rose-600 whitespace-nowrap">
                                                -Rp {Math.abs(t.jumlah).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                    {expenses.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No expenses recorded.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
