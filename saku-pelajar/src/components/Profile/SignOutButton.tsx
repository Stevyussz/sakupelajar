'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, Loader2 } from 'lucide-react';
import { Modal } from '@/components/UI/Modal';

export function SignOutButton() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        await signOut({ callbackUrl: '/login' });
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 p-4 rounded-xl font-bold transition flex items-center justify-center gap-2 group"
            >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition" />
                Keluar Akun
            </button>

            <Modal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Konfirmasi Keluar"
                type="danger"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                        👋
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">Yakin mau udahan?</p>
                        <p className="text-sm text-slate-500">Kamu harus login lagi nanti untuk melihat tabunganmu.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSignOut}
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ya, Keluar'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
