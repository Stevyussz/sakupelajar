'use client';

import { useState } from "react";
import { GlassCard } from "@/components/UI/GlassCard";
import { useToast } from "@/components/UI/Toast";
import { useRouter } from "next/navigation";

interface Props {
    user: {
        name: string;
        email: string;
        level: string;
    }
}

export function UserProfileForm({ user }: Props) {
    const [name, setName] = useState(user.name);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/profile/update', {
            method: 'PUT',
            body: JSON.stringify({ name })
        });

        if (res.ok) {
            addToast("Profile updated successfully!", "success");
            router.refresh();
        } else {
            addToast("Failed to update profile.", "error");
        }
        setLoading(false);
    }

    return (
        <GlassCard className="p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email (Read Only)</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
                    <div>
                        <span className="text-xs font-bold uppercase text-slate-400">Current Level</span>
                        <p className="font-bold text-purple-600">{user.level}</p>
                    </div>
                    <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </GlassCard>
    );
}
