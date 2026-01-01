'use client';
import { Home, Wallet, LogOut, Target, Rocket, Users, ChevronLeft, ChevronRight, PieChart, BookOpen, Settings, Gamepad2, ScrollText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Analytics', icon: PieChart, href: '/analytics' },
    { name: 'Kakeibo', icon: ScrollText, href: '/kakeibo' },
    { name: 'Quests', icon: Gamepad2, href: '/quest' },
    { name: 'Wishlist', icon: Target, href: '/wishlist' },
    { name: 'Debts', icon: BookOpen, href: '/debts' },
    { name: 'Settings', icon: Settings, href: '/profile' },
];

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-md border-r border-slate-200 hidden md:flex flex-col p-4 z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header */}
            <div className={`flex items-center gap-3 px-2 mb-10 mt-2 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="bg-blue-600 p-2 rounded-xl text-white shrink-0">
                    <Wallet className="w-6 h-6" />
                </div>
                {!isCollapsed && (
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap overflow-hidden">
                        SakuPelajar
                    </h1>
                )}
            </div>

            {/* Minimize Button */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-blue-600 shadow-sm transition"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {menus.map((menu) => (
                    <Link
                        key={menu.name}
                        id={`sidebar-${menu.name.toLowerCase()}`}
                        href={menu.href}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${pathname === menu.href
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <menu.icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{menu.name}</span>}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto space-y-2">
                <Link
                    href="/api/auth/signout"
                    className={`flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Logout</span>}
                </Link>
            </div>
        </aside>
    );
}
