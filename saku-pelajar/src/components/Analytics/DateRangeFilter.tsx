'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
    currentMonth: number;
    currentYear: number;
}

export function DateRangeFilter({ currentMonth, currentYear }: DateRangeFilterProps) {
    const router = useRouter();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = e.target.value;
        router.push(`/analytics?month=${month}&year=${currentYear}`);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        router.push(`/analytics?month=${currentMonth}&year=${year}`);
    };

    return (
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                <Calendar className="w-4 h-4" />
            </div>

            <select
                value={currentMonth}
                onChange={handleMonthChange}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-50 p-1 rounded"
            >
                {months.map((m, idx) => (
                    <option key={idx} value={idx}>{m}</option>
                ))}
            </select>

            <div className="w-px h-6 bg-slate-200" />

            <select
                value={currentYear}
                onChange={handleYearChange}
                className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-50 p-1 rounded"
            >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
            </select>
        </div>
    );
}
