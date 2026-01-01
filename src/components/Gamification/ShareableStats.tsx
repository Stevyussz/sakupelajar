'use client';
import { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Share2, Download, Instagram, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { calculateLevel } from '@/lib/gamification';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string;
        avatarId: string;
        level: string; // Legacy string, we'll recalculate for more info
        streak: number;
        totalSavings: number;
    };
}

const AVATARS: Record<string, string> = {
    lion: '🦁', cat: '😼', robot: '🤖', unicorn: '🦄',
    rocket: '🚀', crown: '👑', detective: '🕵️', ninja: '🥷'
};

export function ShareableStats({ isOpen, onClose, user }: Props) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    // Recalculate level to get the latest badge info
    const levelInfo = calculateLevel(user.totalSavings);
    const avatarEmoji = AVATARS[user.avatarId] || '🦁';

    useEffect(() => {
        if (isOpen) {
            // FIREWORKS! 🎆
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // two confetti sources
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);

        try {
            // Wait a bit for images/fonts to be ready if needed, or just capture
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `SakuPelajar-Flex-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error("Failed to download", err);
            alert("Gagal mendownload gambar. Coba screenshot manual ya! 🙏");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Flex Your Stats 💪">
            <div className="flex flex-col items-center pb-4">
                <p className="text-slate-500 mb-4 text-sm text-center">Pamerin pencapaianmu ke teman-teman!</p>

                {/* The Card Container - ID for capture */}
                <div
                    ref={cardRef}
                    className="w-full max-w-[320px] aspect-[9/16] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col items-center justify-between text-white border-2 border-white/20 select-none transform transition-transform hover:scale-[1.02] duration-300"
                >

                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-40 -left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse delay-100"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>

                    {/* Header */}
                    <div className="z-10 text-center w-full">
                        <div className="flex justify-between items-center w-full mb-4 opacity-80 backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                            <span className="text-[10px] font-bold tracking-widest uppercase">SakuPelajar App</span>
                            <span className="text-[10px]">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="z-10 flex flex-col items-center text-center space-y-5 flex-1 justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-7xl shadow-2xl border border-white/40 relative z-10 animate-bounce-slow">
                                {avatarEmoji}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg">
                                Lvl {levelInfo.id}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-yellow-500 drop-shadow-sm mb-1">
                                {user.name}
                            </h2>
                            <div className={`px-4 py-1 rounded-full bg-black/30 border border-white/10 backdrop-blur-md inline-flex items-center gap-2 ${levelInfo.color}`}>
                                <span>{levelInfo.icon}</span>
                                <span className="font-bold text-sm tracking-wide text-white">{levelInfo.name}</span>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 w-full border border-white/20 shadow-inner group">
                            <p className="text-[10px] text-indigo-200 uppercase mb-1 tracking-wider">Total Tabungan</p>
                            <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                                Rp {user.totalSavings.toLocaleString('id-ID')}
                            </p>
                            <div className="mt-2 w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-[75%] rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 rounded-full shadow-lg transform -rotate-2 border-2 border-orange-400/50">
                            <span className="text-xl animate-pulse">🔥</span>
                            <span className="font-bold">{user.streak} Day Streak!</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="z-10 text-center space-y-3 pb-2 pt-6">
                        <p className="text-[10px] text-white/60 italic font-light px-4">"{levelInfo.description}"</p>
                        <div className="text-[10px] bg-white/20 px-3 py-1.5 rounded-lg inline-block font-mono backdrop-blur-md border border-white/10">
                            sakupelajar.app 🚀
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/30"
                    >
                        {downloading ? <span className="animate-spin">⏳</span> : <Download className="w-5 h-5" />}
                        {downloading ? 'Capturing...' : 'Download Image'}
                    </button>

                    <p className="text-xs text-slate-400 text-center">
                        *Share ke Instagram Stories atau WhatsApp Status!
                    </p>
                </div>
            </div>
        </Modal>
    );
}
