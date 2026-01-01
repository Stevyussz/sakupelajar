'use client';
import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
    // Determine intensity based on streak
    let fireColor = "text-orange-400";
    let bgPulse = "bg-orange-100";
    let intensity = "scale-100";

    if (streak >= 3) {
        fireColor = "text-orange-500";
        bgPulse = "bg-orange-200 animate-pulse";
        intensity = "scale-105";
    }
    if (streak >= 7) {
        fireColor = "text-red-500";
        bgPulse = "bg-red-200 animate-pulse";
        intensity = "scale-110";
    }
    if (streak >= 30) {
        fireColor = "text-purple-600";
        bgPulse = "bg-purple-200 animate-pulse border-2 border-purple-400";
        intensity = "scale-125";
    }

    return (
        <div className="relative group cursor-help">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bgPulse} transition-all duration-300 transform ${intensity}`}>
                <Flame className={`w-4 h-4 ${fireColor} fill-current animate-bounce`} />
                <span className={`text-xs font-bold ${fireColor}`}>{streak} Day Streak</span>
            </div>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-900/90 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
                <p>Log in daily to keep the fire burning! 🔥</p>
                {streak < 7 && <p className="text-slate-400 mt-1">Reach 7 days for Red Fire!</p>}
            </div>
        </div>
    );
}
