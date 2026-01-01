'use client';
import { useState } from "react";
import { Modal } from "@/components/UI/Modal";
import { CurrencyInput } from "@/components/UI/CurrencyInput";
import { Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/UI/Toast";

export function AddDebtForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [personName, setPersonName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'owed' | 'owe'>('owed'); // Default: They owe me
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const nominal = Number(amount.replace(/\D/g, ''));
        // If I Owe (Liabilities), store as negative. If They Owe (Asset), store as positive.
        const finalAmount = type === 'owe' ? -nominal : nominal;

        const res = await fetch('/api/debts', {
            method: 'POST',
            body: JSON.stringify({ personName, amount: finalAmount, description })
        });

        if (res.ok) {
            addToast("Record added successfully!", "success");
            setIsOpen(false);
            setAmount('');
            setPersonName('');
            setDescription('');
            router.refresh();
        } else {
            addToast("Failed to save.", "error");
        }
        setLoading(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition text-sm md:text-base"
            >
                <Plus className="w-5 h-5" /> Add New Record
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Debt Record">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Type Selector */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setType('owed')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${type === 'owed' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-400'
                                }`}
                        >
                            <ArrowLeft className="w-6 h-6" />
                            <span className="font-bold text-sm">They Owe Me</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('owe')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${type === 'owe' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 text-slate-400'
                                }`}
                        >
                            <ArrowRight className="w-6 h-6" />
                            <span className="font-bold text-sm">I Owe Them</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Person Name</label>
                        <input
                            type="text"
                            required
                            value={personName}
                            onChange={e => setPersonName(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Amount</label>
                        <CurrencyInput
                            value={amount}
                            onChange={setAmount}
                            placeholder="Rp 0"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Items / Note (Optional)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Lunch money"
                        />
                    </div>

                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition shadow-lg mt-4">
                        {loading ? 'Saving...' : 'Save Record'}
                    </button>
                </form>
            </Modal>
        </>
    );
}
