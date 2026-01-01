'use client';

import { motion } from 'framer-motion';
import { Flame, Calendar as CalendarIcon } from 'lucide-react';

export function StreakCalendar({ streak, lastLogin }: { streak: number, lastLogin: Date | string | null }) {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Calculate active days based on streak (approximate if no full history)
    // We assume the streak ends today or yesterday.
    const activeDays = new Set<number>();

    // Normalize lastLogin
    const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
    let isStreakActiveToday = false;

    if (lastLoginDate) {
        const isSameDay = today.toDateString() === lastLoginDate.toDateString();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = yesterday.toDateString() === lastLoginDate.toDateString();

        if (isSameDay || isYesterday) {
            // Streak is alive. Backfill days.
            for (let i = 0; i < streak; i++) {
                const date = new Date(lastLoginDate);
                date.setDate(date.getDate() - i);
                // Only if in current month
                if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
                    activeDays.add(date.getDate());
                }
            }
        }
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Flame className="w-32 h-32" />
            </div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Streak Calendar</h3>
                    <p className="text-slate-500 text-xs">Keep the fire burning!</p>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-3xl font-black text-orange-500 flex items-center justify-end gap-1">
                        <Flame className="w-6 h-6 fill-current animate-bounce" /> {streak}
                    </div>
                    <span className="text-xs font-bold text-slate-400">Days Streak</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>

            <div className="grid grid-cols-7 gap-2 relative z-10">
                {days.map(day => {
                    const date = new Date(today.getFullYear(), today.getMonth(), day);
                    const isActive = activeDays.has(day);
                    const isToday = day === today.getDate();

                    return (
                        <div key={day} className="flex flex-col items-center">
                            <motion.div
                                initial={isActive ? { scale: 0 } : { scale: 1 }}
                                animate={isActive ? { scale: 1 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: day * 0.02 }}
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center relative
                                    ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-300'}
                                    ${isToday && !isActive ? 'border-2 border-orange-500 text-orange-500' : ''}
                                `}
                            >
                                {isActive ? <Flame className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : day}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
