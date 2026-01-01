'use client';
import { Download } from "lucide-react";

export function ExportButton() {
    const handleExport = () => {
        window.print();
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition text-sm font-medium"
        >
            <Download className="w-4 h-4" /> Export PDF
        </button>
    );
}
