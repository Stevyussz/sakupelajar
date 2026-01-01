'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { BookOpen, Calendar } from 'lucide-react';

interface JournalHistoryProps {
    reflections: any[];
}

export function JournalHistory({ reflections }: JournalHistoryProps) {
    // Sort by period descending (newest first)
    const sorted = [...reflections].sort((a, b) => b.period.localeCompare(a.period));

    if (sorted.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Riwayat Jurnal</h3>
            </div>

            <div className="space-y-4">
                {sorted.map((ref, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {ref.period.replace('-', ' - ')}
                            </span>
                            <span className="text-[10px] text-slate-400">
                                {new Date(ref.createdAt).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                        <p className="text-slate-700 italic font-handwriting text-lg leading-relaxed">
                            "{ref.content}"
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
