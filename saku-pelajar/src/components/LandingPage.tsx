'use client';

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ScanLine, Trophy, TrendingUp, Sparkles, Smartphone, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function LandingPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (idx: number) => setOpenFaq(openFaq === idx ? null : idx);

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 relative">

            {/* Animated Background Blobs */}
            <motion.div style={{ y: y1, x: -50 }} className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply filter pointer-events-none" />
            <motion.div style={{ y: y2, x: 50 }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply filter pointer-events-none" />


            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transaction-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg rotate-3 shadow-lg shadow-blue-500/30">S</div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">SakuPelajar</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">Masuk</Link>
                        <Link href="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                            Daftar Gratis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                            <Sparkles className="w-3 h-3 text-yellow-500" /> #1 Finance App for Students
                        </motion.div>
                        <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                            Kelola Uang Saku <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">Jadi Lebih Seru.</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                            Aplikasi pencatat keuangan pintar dengan fitur AI Scanner, Gamification, dan Analisis yang bikin kamu jago atur duit sejak dini.
                        </motion.p>
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-blue-500/30 hover:-translate-y-1">
                                Mulai Sekarang <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/login" className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg transition shadow-sm hover:shadow-md">
                                Sudah Punya Akun?
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeIn} className="mt-8 flex items-center gap-4 text-sm text-slate-500 font-medium">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
                            </div>
                            <p>Dipercaya oleh 10.000+ Pelajar</p>
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-[2.5rem] shadow-2xl skew-y-3 hover:skew-y-0 transition duration-500 ring-1 ring-white/50">
                            {/* Mockup UI Element */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Total Tabungan</p>
                                    <p className="text-3xl font-bold text-slate-800">Rp 1.250.000</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-white/50 shadow-sm">
                                        <div className={`w-8 h-8 rounded-lg ${i === 1 ? 'bg-orange-100 text-orange-500' : 'bg-blue-100 text-blue-500'} flex items-center justify-center`}>
                                            {i === 1 ? <ScanLine className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 w-24 bg-slate-200 rounded mb-1"></div>
                                            <div className="h-2 w-16 bg-slate-100 rounded"></div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400">-Rp 25.000</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                        >
                            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Trophy className="w-6 h-6" /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold">Level Up!</p>
                                <p className="font-bold text-slate-800">Sultan Muda</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                        >
                            <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold">Goal Reached</p>
                                <p className="font-bold text-slate-800">Sepatu Baru</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Sultan, Harga Teman (Gratis!)</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Kami mengerti masalah pelajar. Makanya SakuPelajar dibuat simpel tapi powerful.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ScanLine,
                                color: "text-blue-600 bg-blue-50",
                                title: "AI Receipt Scanner",
                                desc: "Teknologi OCR canggih yang bisa baca struk belanjaanmu. Bye-bye catat manual!"
                            },
                            {
                                icon: Trophy,
                                color: "text-purple-600 bg-purple-50",
                                title: "Gamification",
                                desc: "Setiap sen yang kamu catat bikin level kamu naik. Bisa pamer badge ke teman-teman!"
                            },
                            {
                                icon: TrendingUp,
                                color: "text-emerald-600 bg-emerald-50",
                                title: "Financial DNA",
                                desc: "Pahami gaya belanjamu lewat grafik keren. Boros di makanan atau game? Ketahuan!"
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                key={idx}
                                className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition duration-300 group hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:rotate-6 transition`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-slate-50 relative z-10">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Sering Ditanyakan</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Apakah aplikasi ini gratis?", a: "100% Gratis untuk pelajar! Misi kami adalah meningkatkan literasi keuangan." },
                            { q: "Data saya aman nggak?", a: "Aman banget. Kami menggunakan enkripsi standar industri dan tidak menjual data ke pihak ketiga." },
                            { q: "Bisa diinstall di HP?", a: "Bisa! SakuPelajar adalah PWA. Buka di Chrome/Safari lalu pilih 'Add to Home Screen'." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-800 hover:bg-slate-50 transition"
                                >
                                    {item.q}
                                    <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-in slide-in-from-top-2">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-blue-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                    <div className="absolute bottom-0 left-0 p-32 bg-purple-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Siap Jadi Juara Finansial?</h2>
                        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Bergabung dengan ribuan pelajar cerdas lainnya. Gratis selamanya untuk fitur dasar.</p>
                        <Link href="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition shadow-xl shadow-blue-500/20 hover:scale-105 hover:rotate-1">
                            Buat Akun Sekarang <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 bg-white tex-center">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">S</div>
                        <span className="font-bold text-slate-900">SakuPelajar</span>
                    </div>
                    <p className="text-slate-500 text-sm">© 2026 SakuPelajar by Stevyuss. All rights reserved.</p>
                    <div className="flex gap-6 text-sm font-bold text-slate-600">
                        <a href="#" className="hover:text-blue-600">Privacy</a>
                        <a href="#" className="hover:text-blue-600">Terms</a>
                        <a href="#" className="hover:text-blue-600">Help</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
