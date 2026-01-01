'use client';
import { Coffee, Bus, ShoppingBag, Book, Gamepad2, MoreHorizontal } from "lucide-react";

export const CATEGORIES = [
    { id: 'Makanan', icon: Coffee, color: 'text-orange-500 bg-orange-50' },
    { id: 'Transport', icon: Bus, color: 'text-blue-500 bg-blue-50' },
    { id: 'Belanja', icon: ShoppingBag, color: 'text-pink-500 bg-pink-50' },
    { id: 'Edukasi', icon: Book, color: 'text-green-500 bg-green-50' },
    { id: 'Hiburan', icon: Gamepad2, color: 'text-purple-500 bg-purple-50' },
    { id: 'Lainnya', icon: MoreHorizontal, color: 'text-slate-500 bg-slate-50' },
];

interface CategorySelectorProps {
    selected: string;
    onSelect: (category: string) => void;
    customCategories?: string[];
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelect(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${selected === cat.id
                        ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                        : 'border-slate-100 hover:bg-slate-50'
                        }`}
                >
                    <div className={`p-2 rounded-full ${cat.color} mb-2`}>
                        <cat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{cat.id}</span>
                </button>
            ))}
        </div>
    );
}
