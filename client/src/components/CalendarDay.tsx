'use client';

import { DayWorkout } from '@/lib/workoutData';

interface CalendarDayProps {
    workout: DayWorkout;
    isToday: boolean;
    isCompleted?: boolean;
}

export default function CalendarDay({ workout, isToday, isCompleted }: CalendarDayProps) {
    const isRestDay = workout.day === 'Sunday';

    // Calculate total time for each phase
    const warmupTime = workout.warmup.reduce((acc, ex) => acc + ex.duration, 0);
    const strengthTime = workout.strength.reduce((acc, ex) => acc + ex.duration, 0);
    const cardioTime = workout.cardio.reduce((acc, ex) => acc + ex.duration, 0);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        return `${mins} min`;
    };

    return (
        <div
            className={`
        relative p-4 rounded-2xl border transition-all overflow-hidden
        ${isToday
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500 ring-2 ring-emerald-500/50'
                    : isRestDay
                        ? 'bg-gray-800/30 border-gray-700/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                }
        ${isCompleted ? 'ring-2 ring-green-500/50' : ''}
      `}
        >
            {/* Day header */}
            <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${isToday ? 'text-emerald-400' : 'text-white/80'}`}>
                    {workout.day}
                </span>
                {isToday && (
                    <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                        TODAY
                    </span>
                )}
                {isCompleted && !isToday && (
                    <span className="text-green-400 text-xl">✓</span>
                )}
            </div>

            {/* Workout title */}
            <h3 className="text-lg font-bold text-white mb-1">
                {workout.title}
            </h3>
            <p className="text-white/50 text-xs mb-3">
                {workout.description}
            </p>

            {/* Rest day content */}
            {isRestDay ? (
                <div className="text-center py-6">
                    <span className="text-4xl">😴</span>
                    <p className="text-white/40 mt-2 text-sm">Recovery & Rest</p>
                </div>
            ) : (
                <>
                    {/* Phase summary with times */}
                    <div className="flex gap-2 mb-3 text-xs">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                            🔥 {formatTime(warmupTime)}
                        </span>
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            💪 {formatTime(strengthTime)}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            ❤️ {formatTime(cardioTime)}
                        </span>
                    </div>

                    {/* Strength exercises with sets/reps */}
                    <div className="space-y-1">
                        <p className="text-white/40 text-xs uppercase tracking-wider">Strength Exercises</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {workout.strength.map((ex, i) => (
                                <div key={i} className="flex items-center justify-between text-xs p-2 bg-white/5 rounded-lg">
                                    <span className="text-white/80 truncate flex-1">{ex.name}</span>
                                    {ex.sets && ex.reps ? (
                                        <span className="text-emerald-400 font-medium ml-2 whitespace-nowrap">
                                            {ex.sets}×{ex.reps}
                                        </span>
                                    ) : (
                                        <span className="text-white/40 ml-2 whitespace-nowrap">
                                            {Math.floor(ex.duration / 60)}min
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cardio */}
                    {workout.cardio.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Cardio</p>
                            {workout.cardio.map((ex, i) => (
                                <div key={i} className="text-xs text-blue-400">
                                    ❤️ {ex.name} ({formatTime(ex.duration)})
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
