'use client';

import { useState, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useToast } from '@/components/UI/Toast';

interface ReceiptScannerProps {
    onScanComplete: (amount: number, text: string) => void;
}

export function ReceiptScanner({ onScanComplete }: ReceiptScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanning(true);
        setProgress(0);
        addToast("Analysing receipt... This might take a few seconds.", "info");

        try {
            const result = await Tesseract.recognize(
                file,
                'ind', // Indonesian language support
                {
                    logger: (m) => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.floor(m.progress * 100));
                        }
                    }
                }
            );

            const text = result.data.text;
            console.log("OCR Result:", text);

            // Heuristic algorithm to find the total
            const foundAmount = parseAmountFromText(text);

            if (foundAmount > 0) {
                onScanComplete(foundAmount, `Scanned receipt: ${file.name}`);
                addToast(`Found amount: Rp ${foundAmount.toLocaleString('id-ID')}`, "success");
            } else {
                addToast("Could not detect a valid amount. Please enter manually.", "error");
            }

        } catch (error) {
            console.error(error);
            addToast("Failed to scan receipt.", "error");
        } finally {
            setScanning(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Helper to find the largest number that looks like a price
    const parseAmountFromText = (text: string): number => {
        // Clean text: remove non-digit characters that aren't dot/comma
        const lines = text.split('\n');
        let maxAmount = 0;

        // Regex to match currency formats like: Rp 50.000, 50.000,00, 50000
        // We look for numbers that might be followed by ',-' or ',00'
        const currencyRegex = /Rp\s?\.?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)|\b(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)\b/gi;

        for (const line of lines) {
            // Skip lines that look like dates or phone numbers if possible (simple heuristics)
            if (line.includes('+62') || line.match(/\d{2}\/\d{2}\/\d{4}/)) continue;

            const matches = line.matchAll(currencyRegex);
            for (const match of matches) {
                let amountStr = match[0].replace(/Rp|\.|,|-|\s/g, ''); // aggressive cleanup
                // If it has a comma for decimals (Indonesian style), we removed it, but let's handle standardizing
                // Re-parsing carefully:
                // 1. Remove 'Rp', spaces, docs
                // 2. Determine if dot is thousand separator

                // Simplified approach: Remove non-digits
                const cleanNumStr = match[0].replace(/[^0-9,]/g, '');

                // If contains comma, usually decimal in ID
                const parts = cleanNumStr.split(',');
                let numericValue = 0;
                if (parts.length > 1) {
                    numericValue = parseInt(parts[0].replace(/\./g, ''));
                } else {
                    numericValue = parseInt(cleanNumStr.replace(/\./g, ''));
                }

                if (!isNaN(numericValue) && numericValue > maxAmount && numericValue < 100000000) { // Limit to 100M to avoid phone numbers
                    maxAmount = numericValue;
                }
            }
        }
        return maxAmount;
    };

    return (
        <div className="mb-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                capture="environment" // Opens camera on mobile
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all ${scanning
                        ? 'bg-slate-100 border-slate-200 text-slate-500'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                    }`}
            >
                {scanning ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Scanning... {progress}%
                    </>
                ) : (
                    <>
                        <Camera className="w-5 h-5" />
                        Scan Struk (AI) 📸
                    </>
                )}
            </button>
            <p className="text-xs text-center text-slate-400 mt-2">
                Powered by On-Device AI (Tesseract.js). No data leaves your phone.
            </p>
        </div>
    );
}
