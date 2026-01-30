'use client';

interface WorkoutProgressProps {
    phase: 'warmup' | 'strength' | 'cardio';
    totalTime: number;
    elapsedTime: number;
}

export default function WorkoutProgress({ phase, totalTime, elapsedTime }: WorkoutProgressProps) {
    const progress = (elapsedTime / totalTime) * 100;

    const phaseInfo = {
        warmup: { label: 'WARM-UP', icon: '🔥', color: 'from-orange-500 to-yellow-500', duration: '5 min' },
        strength: { label: 'STRENGTH', icon: '💪', color: 'from-red-500 to-pink-500', duration: '25 min' },
        cardio: { label: 'CARDIO', icon: '❤️', color: 'from-blue-500 to-cyan-500', duration: '10 min' }
    };

    const phases = ['warmup', 'strength', 'cardio'] as const;
    const currentPhaseIndex = phases.indexOf(phase);

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Phase indicators */}
            <div className="flex justify-between mb-4">
                {phases.map((p, index) => (
                    <div
                        key={p}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${index === currentPhaseIndex
                                ? `bg-gradient-to-r ${phaseInfo[p].color} shadow-lg`
                                : index < currentPhaseIndex
                                    ? 'bg-green-600/50'
                                    : 'bg-white/10'
                            }`}
                    >
                        <span>{phaseInfo[p].icon}</span>
                        <span className="font-medium text-sm">{phaseInfo[p].label}</span>
                        <span className="text-xs opacity-70">{phaseInfo[p].duration}</span>
                    </div>
                ))}
            </div>

            {/* Overall progress bar */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${phaseInfo[phase].color} transition-all duration-1000 ease-linear rounded-full`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Time info */}
            <div className="flex justify-between mt-2 text-white/60 text-sm">
                <span>{Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')} elapsed</span>
                <span>{Math.floor((totalTime - elapsedTime) / 60)}:{String((totalTime - elapsedTime) % 60).padStart(2, '0')} remaining</span>
            </div>
        </div>
    );
}
