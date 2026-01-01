'use client';
import { useState } from "react";
import { GlassCard } from "@/components/UI/GlassCard";
import { useToast } from "@/components/UI/Toast";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const AVATARS = [
    { id: 'lion', emoji: '🦁', name: 'Lion Leader' },
    { id: 'cat', emoji: '😼', name: 'Cool Cat' },
    { id: 'robot', emoji: '🤖', name: 'Robo Saver' },
    { id: 'unicorn', emoji: '🦄', name: 'Magic Uni' },
    { id: 'rocket', emoji: '🚀', name: 'To The Moon' },
    { id: 'crown', emoji: '👑', name: 'Wealth King' },
    { id: 'detective', emoji: '🕵️', name: 'Money Spy' },
    { id: 'ninja', emoji: '🥷', name: 'Budget Ninja' },
];

export function AvatarSelector({ currentAvatar }: { currentAvatar: string }) {
    const [selected, setSelected] = useState(currentAvatar || 'lion');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();

    async function handleSave() {
        setLoading(true);
        const res = await fetch('/api/profile/update', {
            method: 'PUT',
            body: JSON.stringify({ avatarId: selected })
        });

        if (res.ok) {
            addToast("Avatar updated! Looking fresh.", "success");
            router.refresh();
        } else {
            addToast("Failed to update avatar.", "error");
        }
        setLoading(false);
    }

    return (
        <GlassCard className="p-6">
            <h3 className="font-bold text-slate-700 mb-4">Choose Your Persona</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
                {AVATARS.map((av) => (
                    <button
                        key={av.id}
                        onClick={() => setSelected(av.id)}
                        className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all relative ${selected === av.id
                                ? 'bg-blue-100 border-2 border-blue-500 scale-110 shadow-lg'
                                : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'
                            }`}
                        title={av.name}
                    >
                        {av.emoji}
                        {selected === av.id && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {selected !== currentAvatar && (
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl font-bold transition text-sm"
                    >
                        {loading ? 'Saving...' : 'Update Avatar'}
                    </button>
                </div>
            )}
        </GlassCard>
    );
}
