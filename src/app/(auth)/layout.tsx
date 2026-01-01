import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
            {/* Animated Background Blobs (Static for Auth to avoid distraction, but matching style) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply filter pointer-events-none translate-x-1/2 translate-y-1/2" />

            <div className="w-full max-w-md relative z-10">
                {/* SakuPelajar Brand */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl rotate-3 shadow-lg shadow-blue-500/30">S</div>
                        <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">SakuPelajar</span>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
