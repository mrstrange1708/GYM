'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimerProps {
    duration: number; // in seconds
    onComplete: () => void;
    isPaused: boolean;
    label: string;
    phase: 'warmup' | 'strength' | 'cardio';
}

export default function Timer({ duration, onComplete, isPaused, label, phase }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (isPaused || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, timeLeft, onComplete]);

    const progress = ((duration - timeLeft) / duration) * 100;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const phaseColors = {
        warmup: { bg: 'from-orange-500 to-yellow-500', ring: 'ring-orange-400', text: 'text-orange-400' },
        strength: { bg: 'from-red-500 to-pink-500', ring: 'ring-red-400', text: 'text-red-400' },
        cardio: { bg: 'from-blue-500 to-cyan-500', ring: 'ring-blue-400', text: 'text-blue-400' }
    };

    const colors = phaseColors[phase];

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                        className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={phase === 'warmup' ? '#f97316' : phase === 'strength' ? '#ef4444' : '#3b82f6'} />
                            <stop offset="100%" stopColor={phase === 'warmup' ? '#eab308' : phase === 'strength' ? '#ec4899' : '#06b6d4'} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Timer text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-6xl md:text-7xl font-bold ${colors.text}`}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-white/60 text-sm uppercase tracking-wider mt-2">{label}</span>
                </div>
            </div>

            {isPaused && (
                <div className="mt-4 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                    <span className="text-yellow-400 font-medium">⏸️ PAUSED</span>
                </div>
            )}
        </div>
    );
}
