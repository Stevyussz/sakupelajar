import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { GlassCard } from "@/components/UI/GlassCard";

interface StatsCardProps {
    title: string;
    amount: number;
    type: "balance" | "income" | "expense" | "net-worth";
    trend?: string;
}

export function StatsCard({ title, amount, type, trend }: StatsCardProps) {
    const isPositive = type === "income";
    const isBalance = type === "balance";
    const isNetWorth = type === "net-worth";

    return (
        <GlassCard className={`p-6 ${isBalance ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-none" : isNetWorth ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-none" : ""}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className={`text-sm font-medium ${isBalance || isNetWorth ? "text-blue-100" : "text-slate-500"}`}>{title}</p>
                    <h3 className="text-2xl font-bold mt-1">Rp {amount.toLocaleString("id-ID")}</h3>
                </div>
                <div className={`p-2 rounded-lg ${isBalance || isNetWorth ? "bg-white/20" : "bg-slate-100"}`}>
                    <Wallet className={`w-5 h-5 ${isBalance || isNetWorth ? "text-white" : "text-slate-600"}`} />
                </div>
            </div>
            {trend && !isBalance && (
                <div className="flex items-center text-xs">
                    <span className={`flex items-center font-medium ${isPositive ? "text-green-600" : "text-red-500"}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trend}
                    </span>
                    <span className="text-slate-400 ml-1">vs last month</span>
                </div>
            )}
        </GlassCard>
    );
}
