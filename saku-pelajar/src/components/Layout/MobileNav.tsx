'use client';
import { Home, Plus, Target, PieChart, BookOpen, User, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden z-50 px-6 pb-6 pt-2">
            <div className="flex justify-between items-end">
                {/* Left Side */}
                <div className="flex items-center gap-6">
                    <Link id="mobile-nav-home" href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-blue-600' : 'text-slate-400'}`}>
                        <Home className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    <Link id="mobile-nav-analytics" href="/analytics" className={`flex flex-col items-center gap-1 ${pathname === '/analytics' ? 'text-blue-600' : 'text-slate-400'}`}>
                        <PieChart className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Stats</span>
                    </Link>
                </div>

                {/* Center Add Button */}
                <div className="relative -top-6">
                    <Link id="mobile-nav-add" href="/add" className="flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full text-white shadow-xl shadow-slate-900/30 border-4 border-slate-50 transform hover:scale-105 transition active:scale-95">
                        <Plus className="w-8 h-8" />
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-6">
                    <Link id="mobile-nav-quest" href="/quest" className={`flex flex-col items-center gap-1 ${pathname === '/quest' ? 'text-blue-600' : 'text-slate-400'}`}>
                        <Gamepad2 className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Quest</span>
                    </Link>

                    <Link id="mobile-nav-wishlist" href="/wishlist" className={`flex flex-col items-center gap-1 ${pathname === '/wishlist' ? 'text-blue-600' : 'text-slate-400'}`}>
                        <Target className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Goals</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
