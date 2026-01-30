'use client';

import { Exercise } from '@/lib/workoutData';

interface ExerciseCardProps {
    exercise: Exercise;
    isActive: boolean;
    isCompleted: boolean;
    index: number;
}

export default function ExerciseCard({ exercise, isActive, isCompleted, index }: ExerciseCardProps) {
    return (
        <div
            className={`
        relative p-4 rounded-xl transition-all duration-300
        ${isActive
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
                    : isCompleted
                        ? 'bg-green-900/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10'
                }
      `}
        >
            {/* Status indicator */}
            <div className="absolute -left-2 -top-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                    background: isCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : isActive ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                            : 'rgba(255,255,255,0.1)'
                }}
            >
                {isCompleted ? '✓' : index + 1}
            </div>

            <div className="ml-4">
                <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {exercise.name}
                </h3>
                <p className="text-white/50 text-sm mt-1">
                    {Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, '0')} min
                </p>
                {isActive && (
                    <p className="text-white/70 text-sm mt-2 italic">
                        {exercise.instructions}
                    </p>
                )}
            </div>
        </div>
    );
}
