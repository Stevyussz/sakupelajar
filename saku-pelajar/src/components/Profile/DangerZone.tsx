'use client';

import { useState } from "react";
import { useToast } from "@/components/UI/Toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/UI/Modal";

export function DangerZone({ userId }: { userId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const router = useRouter();

    async function handleResetData() {
        if (confirmText !== 'DELETE') return;
        setLoading(true);

        const res = await fetch('/api/profile/reset', {
            method: 'POST'
        });

        if (res.ok) {
            addToast("All data has been wiped. A fresh start! 🌱", "success");
            setIsOpen(false);
            router.refresh();
            router.push('/');
        } else {
            addToast("Failed to reset data.", "error");
        }
        setLoading(false);
    }

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="font-bold text-slate-800">Reset All Data</h3>
                    <p className="text-sm text-slate-500">This will delete all your transactions, budgets, wishlists, and debts. Your account itself will remain.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-200 transition flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" /> Reset Data
                </button>
            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Are you absolutely sure?">
                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 text-sm">
                        <p className="font-bold mb-1">Warning: This action cannot be undone.</p>
                        <p>All your financial history, budgets, and savings goals will be permanently deleted.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Type "DELETE" to confirm</label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full p-3 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500"
                            placeholder="DELETE"
                        />
                    </div>

                    <button
                        onClick={handleResetData}
                        disabled={confirmText !== 'DELETE' || loading}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition"
                    >
                        {loading ? 'Deleting...' : 'Confirm Reset'}
                    </button>
                </div>
            </Modal>
        </>
    );
}
