import { calculateLevel, getNextLevelProgress } from '@/lib/gamification';
import { Trophy, Sprout, Medal, Crown, Star, Sparkles, Zap } from 'lucide-react';
import { triggerFireworks } from '@/lib/confetti';

export function LevelBadge({ totalSavings }: { totalSavings: number }) {
    const current = calculateLevel(totalSavings);
    const { nextLevel: next, progress } = getNextLevelProgress(totalSavings);

    // Convert text color to bg color for backgrounds
    const bgColor = current.color.replace('text-', 'bg-');

    // Icon Mapping based on Level Name or general tiers
    const getLevelIcon = () => {
        const name = current.name.toLowerCase();
        if (name.includes('novice')) return <Sprout className={`w-8 h-8 ${current.color}`} />;
        if (name.includes('apprentice')) return <Star className={`w-8 h-8 ${current.color}`} />;
        if (name.includes('expert')) return <Medal className={`w-8 h-8 ${current.color}`} />;
        if (name.includes('master')) return <Crown className={`w-8 h-8 ${current.color}`} />;
        if (name.includes('grandmaster')) return <Trophy className={`w-8 h-8 ${current.color}`} />;
        if (name.includes('legend')) return <Zap className={`w-8 h-8 ${current.color}`} />;
        return <Sparkles className={`w-8 h-8 ${current.color}`} />;
    };

    return (
        <div
            onClick={triggerFireworks}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 cursor-pointer hover:scale-[1.01] active:scale-95 transition-transform w-full"
        >
            <div className={`p-4 rounded-full ${bgColor} bg-opacity-10 shadow-inner`}>
                {getLevelIcon()}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-end mb-1">
                    <h3 className="font-bold text-slate-800">{current.name}</h3>
                    <span className="text-xs text-slate-500">{Math.round(progress)}% to next rank</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${bgColor} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                </div>
                {next && <p className="text-xs text-slate-400 mt-1">Reach Rp {next.minSavings.toLocaleString('id-ID')} to upgrade!</p>}
            </div>
        </div>
    );
}
