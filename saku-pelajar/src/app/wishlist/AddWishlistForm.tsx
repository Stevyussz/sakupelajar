'use client';
import { GlassCard } from "@/components/UI/GlassCard";
import { CurrencyInput } from "@/components/UI/CurrencyInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Loader2, Sparkles } from "lucide-react";
import { Modal } from "@/components/UI/Modal";
import { useToast } from "@/components/UI/Toast";

export function AddWishlistForm() {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const targetAmount = Number(target.replace(/\D/g, ''));

        const res = await fetch('/api/wishlist', {
            method: 'POST',
            body: JSON.stringify({ itemName: name, targetAmount }),
        });

        if (res.ok) {
            addToast("Keinginan baru ditambahkan! Semangat! 🌟", "success");
            setName('');
            setTarget('');
            setIsOpen(false);
            router.refresh();
        } else {
            addToast("Gagal menambahkan.", "error");
        }
        setLoading(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full h-full min-h-[200px] border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
            >
                <div className="bg-slate-100 group-hover:bg-blue-100 p-4 rounded-full mb-3 transition-colors">
                    <Plus className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">Tambah Keinginan Baru</span>
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Buat Target Baru 🎯">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-xl flex items-start gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                        <p className="text-sm text-purple-700">"Setiap langkah kecil membawamu lebih dekat ke impianmu."</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Barang / Tujuan</label>
                        <input
                            type="text"
                            placeholder="Contoh: Sepatu Baru, Laptop"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Harga</label>
                        <CurrencyInput
                            value={target}
                            onChange={setTarget}
                            placeholder="Rp 0"
                            className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition font-semibold"
                            required
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold flex justify-center items-center transition">
                        {loading ? <Loader2 className="animate-spin" /> : 'Mulai Menabung'}
                    </button>
                </form>
            </Modal>
        </>
    );
}
