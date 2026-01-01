'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/UI/GlassCard';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/UI/Modal';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Simple Validation
        if (form.name.length < 3) {
            setError('Nama minimal 3 karakter ya!');
            return;
        }
        if (!form.email.includes('@')) {
            setError('Format email sepertinya salah.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password minimal 6 karakter biar aman!');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(form)
            });

            if (res.ok) {
                // Auto login or redirect
                router.push('/login');
            } else {
                setLoading(false);
                setError('Gagal mendaftar. Email mungkin sudah dipakai.');
            }
        } catch (err) {
            setLoading(false);
            setError('Terjadi kesalahan jaringan.');
        }
    };

    return (
        <GlassCard className="p-8 backdrop-blur-xl bg-white/80 border-white/40 shadow-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Join SakuPelajar</h1>
                <p className="text-slate-500">Mulai atur keuanganmu sekarang!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                        type="text"
                        placeholder="Budi Santoso"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white/50 focus:bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="nama@sekolah.id"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white/50 focus:bg-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Buat password kuat..."
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-white/50 focus:bg-white"
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/30 flex justify-center items-center transform active:scale-95"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600">
                Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login disini</Link>
            </p>

            {/* Error Modal */}
            <Modal
                isOpen={!!error}
                onClose={() => setError(null)}
                title="Pendaftaran Gagal 🛑"
                type="danger"
            >
                <div className="text-center">
                    <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-slate-600">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg font-bold"
                    >
                        Perbaiki Data
                    </button>
                </div>
            </Modal>
        </GlassCard>
    )
}
