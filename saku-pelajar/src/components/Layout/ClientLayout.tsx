'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/Layout/Sidebar";
import { MobileNav } from "@/components/Layout/MobileNav";
import PageTransition from '@/components/UI/PageTransition';

export default function ClientLayout({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';
    // Landing page is root path when user is NOT authenticated
    const isLandingPage = pathname === '/' && !isAuthenticated;

    if (isAuthPage || isLandingPage) {
        return (
            <main className="min-h-screen bg-slate-50 relative">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />

            <main
                className={`flex-1 pb-20 md:pb-0 transition-all duration-300 relative ${isCollapsed ? 'md:ml-20' : 'md:ml-64'
                    }`}
            >
                <PageTransition>
                    {children}
                </PageTransition>
            </main>

            <MobileNav />
        </div>
    );
}
