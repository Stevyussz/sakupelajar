'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlassCard } from "@/components/UI/GlassCard";

interface CategoryChartProps {
    data: { name: string; value: number; color: string }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
    return (
        <GlassCard className="p-6 h-[400px] w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Expense by Category</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9', radius: 8 }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number | undefined) => `Rp ${(value || 0).toLocaleString('id-ID')}`}
                        />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1000}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
