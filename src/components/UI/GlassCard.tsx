import { cn } from "@/lib/utils";
import React from "react";

export function GlassCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl rounded-2xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
