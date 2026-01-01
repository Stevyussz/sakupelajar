
export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
    minSavings: number;
}

export const LEVELS: Badge[] = [
    { id: '1', name: 'Novice Saver', icon: '🌱', description: 'Just starting the journey', color: 'text-green-500', minSavings: 0 },
    { id: '2', name: 'Smart Spender', icon: '🧠', description: 'Making wise choices', color: 'text-blue-500', minSavings: 100000 },
    { id: '3', name: 'Budget Rookie', icon: '🛡️', description: 'Building a financial shield', color: 'text-indigo-500', minSavings: 500000 },
    { id: '4', name: 'Savings Squire', icon: '⚔️', description: 'Defending the wallet', color: 'text-purple-500', minSavings: 1000000 },
    { id: '5', name: 'Cash Captain', icon: '⚓', description: 'Steering the ship', color: 'text-cyan-500', minSavings: 2500000 },
    { id: '6', name: 'Gold Guardian', icon: '🏆', description: 'Protector of the treasure', color: 'text-yellow-500', minSavings: 5000000 },
    { id: '7', name: 'Wealth Wizard', icon: '🧙‍♂️', description: 'Magic with money', color: 'text-pink-500', minSavings: 10000000 },
    { id: '8', name: 'Crypto King', icon: '👑', description: 'Ruler of assets', color: 'text-amber-500', minSavings: 25000000 },
    { id: '9', name: 'Financial Emperor', icon: '🏰', description: 'Building an empire', color: 'text-red-600', minSavings: 50000000 },
    { id: '10', name: 'Money God', icon: '♾️', description: 'Limitless potential', color: 'text-emerald-500', minSavings: 100000000 },
];

export function calculateLevel(totalSavings: number): Badge {
    // Find the highest level where totalSavings >= minSavings
    const reversed = [...LEVELS].reverse();
    const level = reversed.find(l => totalSavings >= l.minSavings);
    return level || LEVELS[0];
}

export function getNextLevelProgress(totalSavings: number) {
    const current = calculateLevel(totalSavings);
    const currentIndex = LEVELS.findIndex(l => l.id === current.id);
    const next = LEVELS[currentIndex + 1];

    if (!next) return { progress: 100, needed: 0, nextLevel: null };

    const needed = next.minSavings - totalSavings;
    const range = next.minSavings - current.minSavings;
    const currentProgress = totalSavings - current.minSavings;
    const percentage = Math.min(100, Math.max(0, (currentProgress / range) * 100));

    return { progress: percentage, needed, nextLevel: next };
}
