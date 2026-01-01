'use client';
import { useState, useEffect } from 'react';

interface CurrencyInputProps {
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder, className, required }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        if (value) {
            setDisplayValue(Number(value).toLocaleString('id-ID'));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        onChange(rawValue);

        if (rawValue) {
            setDisplayValue(Number(rawValue).toLocaleString('id-ID'));
        } else {
            setDisplayValue('');
        }
    };

    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
            <input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={`pl-12 ${className}`}
                required={required}
            />
        </div>
    );
}
