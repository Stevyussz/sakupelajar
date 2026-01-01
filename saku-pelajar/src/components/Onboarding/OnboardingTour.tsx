'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

interface OnboardingTourProps {
    hasSeenOnboarding: boolean;
}

export function OnboardingTour({ hasSeenOnboarding }: OnboardingTourProps) {
    useEffect(() => {
        if (hasSeenOnboarding) return;

        const isMobile = window.innerWidth < 768;

        const steps = [
            {
                popover: {
                    title: "👋 Selamat Datang, Sultan Muda!",
                    description: "Selamat datang di SakuPelajar! Aplikasi kece yang bakal bantu kamu atur duit, nabung buat impian, dan jadi finansial master. Yuk, tour singkat dulu!",
                    side: "left",
                    align: 'start'
                }
            },
            {
                element: '#level-badge',
                popover: {
                    title: "🏆 Level & Rank Kamu",
                    description: "Ini status ke-Sultan-an kamu! Semakin rajin nabung, semakin tinggi level dan badge-nya. Klik buat liat progress bar-nya!",
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#stats-grid',
                popover: {
                    title: "💰 Radar Keuangan",
                    description: "Pantau total tabungan, net worth, pemasukan, dan pengeluaranmu secara real-time di sini. Jangan sampe boncos ya!",
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '#smart-advisor',
                popover: {
                    title: "🤖 Smart AI Advisor",
                    description: "Asisten pribadimu! Dia bakal kasih saran cerdas berdasarkan pola belanjamu. Dengerin sarannya biar cepet kaya!",
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '#add-transaction-btn',
                popover: {
                    title: "📝 Catat Duit Masuk/Keluar",
                    description: "Wajib banget! Setiap abis jajan atau dapet uang saku, langsung catat di sini. Bisa scan struk juga biar praktis!",
                    side: "left",
                    align: 'start'
                }
            },
            // Analytics
            {
                element: isMobile ? '#mobile-nav-analytics' : '#sidebar-analytics',
                popover: {
                    title: "📊 Analisis & Laporan",
                    description: "Mau tau duitmu lari kemana aja? Cek Analisis detail, Spending DNA, dan download laporan PDF di sini!",
                    side: isMobile ? "top" : "right",
                    align: 'start'
                }
            },
            // Quests
            {
                element: isMobile ? '#mobile-nav-quest' : '#sidebar-dashboard', // Fallback/Correct ID
                popover: {
                    title: "🎮 Game Center (Quests)",
                    description: isMobile
                        ? "Klik di sini buat kerjain Misi Harian, cek Leaderboard Global, dan belanja Avatar di XP Store!"
                        : "Selesaikan Misi Harian, panjat Leaderboard Global, dan beli Avatar keren pake XP di sini!",
                    side: isMobile ? "top" : "right",
                    align: 'start'
                }
            },
            // Wishlist
            {
                element: isMobile ? '#mobile-nav-wishlist' : '#sidebar-wishlist',
                popover: {
                    title: "✨ Wishlist & Goals",
                    description: "Punya barang impian? Tabung di sini! Kita bakal kasih estimasi kapan barang itu bisa kebeli. Semangat!",
                    side: isMobile ? "top" : "right",
                    align: 'start'
                }
            },
            // Conclusion
            {
                popover: {
                    title: "🚀 Siap Jadi Legenda?",
                    description: "Itu dulu tour-nya! Sekarang giliran kamu buat atur strategi, kumpulin XP, dan jadi user paling tajir di SakuPelajar. Gas pol!",
                    side: "bottom",
                    align: 'start'
                }
            }
        ];

        // Fix for dynamic Quest step selector on Desktop if I used wrong ID previously
        // Desktop sidebar ID was `sidebar-quests` (plural) or `sidebar-quest`?
        // Checking Sidebar.tsx: `id={`sidebar-${menu.name.toLowerCase()}`}` -> name is "Quests" -> `sidebar-quests`.
        // MobileNav: `mobile-nav-quest`.

        // Correcting the step object above dynamically
        // Note: Indices shifted by +1 due to Analytics step
        const questStepIndex = 6;
        steps[questStepIndex].element = isMobile ? '#mobile-nav-quest' : '#sidebar-quests';

        const wishlistStepIndex = 7;
        steps[wishlistStepIndex].element = isMobile ? '#mobile-nav-wishlist' : '#sidebar-wishlist';

        const driverObj = driver({
            showProgress: true,
            animate: true,
            doneBtnText: "Siap, Gas! 🚀",
            nextBtnText: "Lanjut 👉",
            prevBtnText: "Mundur 👈",
            allowClose: false,
            steps: steps,
            onDestroyStarted: async () => {
                await fetch('/api/user/onboarding', { method: 'POST' });
                driverObj.destroy();
            },
        });

        driverObj.drive();
    }, [hasSeenOnboarding]);

    return null; // This component doesn't render anything visible directly
}
