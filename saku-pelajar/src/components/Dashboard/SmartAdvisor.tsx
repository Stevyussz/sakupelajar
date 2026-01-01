'use client';
import { GlassCard } from "@/components/UI/GlassCard";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Calculator, Wallet } from "lucide-react";

interface SmartAdvisorProps {
    income: number;
    expense: number;
    balance: number;
    receivables: number;
    debt: number;
    budgetLimit?: number;
}

export function SmartAdvisor({ income, expense, balance, receivables, debt, budgetLimit = 0 }: SmartAdvisorProps) {
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate();

    // --- DAILY SAFE SPEND CALCULATION ---
    let dailySafeSpend = 0;
    let safeSpendMessage = "";
    let safeSpendColor = "text-slate-500";

    if (budgetLimit > 0) {
        const remainingBudget = budgetLimit - expense;
        if (remainingBudget > 0 && daysRemaining > 0) {
            dailySafeSpend = remainingBudget / daysRemaining;
            safeSpendMessage = `You can safely spend Rp ${Math.round(dailySafeSpend).toLocaleString('id-ID')} per day for the rest of the month.`;
            safeSpendColor = "text-emerald-600";
        } else if (remainingBudget <= 0) {
            safeSpendMessage = "Oops! You've exceeded your budget. Time to fast! 🛑";
            safeSpendColor = "text-red-500";
        }
    }

    // --- MAIN ADVICE LOGIC ---
    let advice = {
        icon: Lightbulb,
        color: "text-blue-600 bg-blue-100",
        title: "Smart Insight",
        message: "Keep tracking for better insights.",
        score: "Neutral",
        action: ""
    };

    if (debt > balance * 0.5) {
        advice = {
            icon: AlertTriangle,
            color: "text-red-600 bg-red-50",
            title: "Crushing Debt",
            message: `Debt consumes ${Math.round((debt / balance) * 100)}% of your cash.`,
            score: "Critical",
            action: `Pay off Rp ${debt.toLocaleString('id-ID')}`
        };
    } else if (budgetLimit > 0 && dailySafeSpend > 0) {
        // Budget Insight takes priority if active
        advice = {
            icon: Wallet,
            color: "text-indigo-600 bg-indigo-50",
            title: "Daily Safe Spend",
            message: `Safe limit: Rp ${Math.round(dailySafeSpend).toLocaleString('id-ID')} / day`,
            score: "Actionable",
            action: `${daysRemaining} Days Left`
        };
    } else if (receivables > 0) {
        advice = {
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-50",
            title: "Collect Money",
            message: `Collect Rp ${receivables.toLocaleString('id-ID')} to boost balance.`,
            score: "Opportunity",
            action: "Send Reminders"
        };
    } else if (expense > income && income > 0) {
        advice = {
            icon: AlertTriangle,
            color: "text-red-600 bg-red-50",
            title: "Deficit Alert",
            message: `You spent ${Math.round((expense / income) * 100)}% of income.`,
            score: "Warning",
            action: "Cut Expenses"
        };
    } else {
        advice = {
            icon: CheckCircle,
            color: "text-blue-600 bg-blue-50",
            title: "Healthy Flow",
            message: "You are consistent! Keep it up.",
            score: "Good",
            action: "Save More"
        };
    }

    return (
        <GlassCard className="p-0 relative overflow-hidden h-full flex flex-col">
            {/* Header / Main Stat */}
            <div className="p-5 flex-1 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-xl ${advice.color} w-fit`}>
                        <advice.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                        {advice.score}
                    </span>
                </div>

                <h3 className="font-bold text-slate-800 text-lg mb-1">{advice.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-snug">{advice.message}</p>

                {budgetLimit > 0 && dailySafeSpend > 0 && advice.title !== "Daily Safe Spend" && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
                        <Calculator className="w-3 h-3 text-indigo-500" />
                        <span className="text-slate-400">Safe Daily: <span className="text-indigo-600 font-bold">Rp {Math.round(dailySafeSpend).toLocaleString('id-ID')}</span></span>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase">Recommendation</span>
                <span className="text-xs font-bold text-blue-600">{advice.action}</span>
            </div>

            {/* Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <advice.icon className="w-24 h-24 transform rotate-12" />
            </div>
        </GlassCard>
    );
}
