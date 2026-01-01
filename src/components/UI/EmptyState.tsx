'use client';

import { LucideIcon, Ghost } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon = Ghost, action }: EmptyStateProps) {
    return (
        <GlassCard className="flex flex-col items-center justify-center p-8 text-center min-h-[200px] w-full border-dashed border-2 border-slate-200 bg-slate-50/50">
            <div className="p-4 bg-slate-100 rounded-full mb-4">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-1">{title}</h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
            {action}
        </GlassCard>
    );
}
