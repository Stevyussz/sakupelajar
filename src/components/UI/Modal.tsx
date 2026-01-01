'use client';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    type?: 'default' | 'danger' | 'success';
}

export function Modal({ isOpen, onClose, title, children, type = 'default' }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-[70] w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden m-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className={`p-4 border-b flex justify-between items-center ${type === 'danger' ? 'bg-red-50 border-red-100' : 'border-slate-100 bg-white'}`}>
                            <h3 className={`font-bold ${type === 'danger' ? 'text-red-600' : 'text-slate-800'}`}>{title}</h3>
                            <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 transition">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
