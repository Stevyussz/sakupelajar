'use client';

import { useState } from 'react';
import { ShoppingBag, Lock, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/UI/Toast";

interface StoreItem {
    id: string;
    name: string;
    icon: string;
    price: number;
    description: string;
}

const STORE_ITEMS: StoreItem[] = [
    { id: 'lion', name: 'Original Lion', icon: '🦁', price: 0, description: 'The classic SakuPelajar mascot.' },
    { id: 'cat', name: 'Smug Cat', icon: '😼', price: 500, description: 'Cool and calculated.' },
    { id: 'robot', name: 'Robo-Advisor', icon: '🤖', price: 1000, description: 'Precision finance.' },
    { id: 'rocket', name: 'Moon Rocket', icon: '🚀', price: 1500, description: 'To the moon!' },
    { id: 'ninja', name: 'Shadow Saver', icon: '🥷', price: 2000, description: 'Silent but wealthy.' },
    { id: 'detective', name: 'Fraud Hunter', icon: '🕵️', price: 2500, description: 'Watching every penny.' },
    { id: 'unicorn', name: 'Rare Gem', icon: '🦄', price: 5000, description: 'Magical savings.' },
    { id: 'crown', name: 'Money King', icon: '👑', price: 10000, description: 'Rule your finances.' },
];

export function XPStore({ unlockedAvatars, currentAvatar, userXP }: { unlockedAvatars: string[], currentAvatar: string, userXP: number }) {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (item: StoreItem) => {
        const isOwned = unlockedAvatars.includes(item.id);
        const action = isOwned ? 'equip' : 'buy';

        if (action === 'buy' && userXP < item.price) {
            addToast("Not enough XP!", "error");
            return;
        }

        setLoading(item.id);

        try {
            const res = await fetch('/api/gamification/shop', {
                method: 'POST',
                body: JSON.stringify({ action, itemId: item.id, cost: item.price }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (res.ok) {
                if (action === 'buy') addToast(`Bought ${item.name}!`, "success");
                if (action === 'equip') addToast(`Equipped ${item.name}!`, "success");
                router.refresh();
            } else {
                addToast(data.error || "Failed", "error");
            }
        } catch (error) {
            console.error(error);
            addToast("Something went wrong", "error");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">XP Store</h3>
                    <p className="text-xs text-slate-500">Spend XP to unlock avatars</p>
                </div>
                <div className="ml-auto bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                    Balance: {userXP} XP
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STORE_ITEMS.map((item) => {
                    const isOwned = unlockedAvatars.includes(item.id);
                    const isEquipped = currentAvatar === item.id;
                    const canAfford = userXP >= item.price;
                    const isLoading = loading === item.id;

                    return (
                        <div key={item.id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${isEquipped ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-100 bg-white hover:border-indigo-200'}`}>
                            <div className="text-4xl mb-2">{item.icon}</div>
                            <h4 className="font-bold text-slate-700 text-sm">{item.name}</h4>
                            <p className="text-[10px] text-slate-400 mb-3 line-clamp-1">{item.description}</p>

                            {isOwned ? (
                                <button
                                    onClick={() => handleAction(item)}
                                    disabled={isEquipped || isLoading}
                                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${isEquipped
                                            ? 'bg-indigo-600 text-white cursor-default'
                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                        }`}
                                >
                                    {isLoading ? '...' : isEquipped ? <><Check className="w-3 h-3" /> Equipped</> : 'Equip'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAction(item)}
                                    disabled={!canAfford || isLoading}
                                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${canAfford
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isLoading ? '...' : canAfford ? `${item.price} XP` : <><Lock className="w-3 h-3" /> {item.price}</>}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
