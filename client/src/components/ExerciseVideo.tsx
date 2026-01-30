'use client';

import { Exercise } from '@/lib/workoutData';
import Image from 'next/image';

interface ExerciseVideoProps {
    exercise: Exercise;
}

export default function ExerciseVideo({ exercise }: ExerciseVideoProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10">
            <div className="aspect-video relative">
                {/* Exercise GIF/Video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900/50 to-teal-900/50">
                    {/* Animated exercise representation */}
                    <div className="text-center p-8">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center animate-pulse">
                            <span className="text-6xl">🏋️</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {exercise.name}
                        </h2>
                        <p className="text-white/70 text-lg">
                            {exercise.instructions}
                        </p>
                    </div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 rounded-full backdrop-blur-sm">
                    <span className="text-white font-medium">
                        {Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, '0')}
                    </span>
                </div>
            </div>
        </div>
    );
}
