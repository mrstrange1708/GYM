'use client';

interface NutritionProgressProps {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
}

// Gym-optimized daily macro targets
const DAILY_GOALS = {
    calories: 1800,
    protein: 150,
    carbs: 180,
    fat: 50,
    fiber: 30
};

export default function NutritionProgress({ calories, protein, carbs, fat, fiber = 0 }: NutritionProgressProps) {
    const getProgressPercent = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    const getProgressColor = (percent: number) => {
        if (percent < 50) return 'from-orange-500 to-yellow-500';
        if (percent < 80) return 'from-blue-500 to-cyan-500';
        if (percent <= 100) return 'from-green-500 to-emerald-500';
        return 'from-red-500 to-pink-500';
    };

    const macros = [
        {
            name: 'Calories',
            current: calories,
            goal: DAILY_GOALS.calories,
            unit: 'kcal',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            name: 'Protein',
            current: protein,
            goal: DAILY_GOALS.protein,
            unit: 'g',
            color: 'from-red-500 to-orange-500',
            emoji: '🥩'
        },
        {
            name: 'Carbs',
            current: carbs,
            goal: DAILY_GOALS.carbs,
            unit: 'g',
            color: 'from-blue-500 to-cyan-500',
            emoji: '🍚'
        },
        {
            name: 'Fat',
            current: fat,
            goal: DAILY_GOALS.fat,
            unit: 'g',
            color: 'from-yellow-500 to-orange-500',
            emoji: '🥑'
        },
        {
            name: 'Fiber',
            current: fiber,
            goal: DAILY_GOALS.fiber,
            unit: 'g',
            color: 'from-green-500 to-emerald-500',
            emoji: '🥬'
        }
    ];

    return (
        <div className="space-y-4">
            {/* Main stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {macros.map((macro) => {
                    const percent = getProgressPercent(macro.current, macro.goal);
                    return (
                        <div
                            key={macro.name}
                            className="p-3 md:p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/60 text-sm">{macro.name}</span>
                                <span className="text-white/40 text-xs">{Math.round(percent)}%</span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                                <div
                                    className={`h-full bg-gradient-to-r ${macro.color} transition-all duration-500`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">{Math.round(macro.current)}</span>
                                <span className="text-white/40 text-sm">/ {macro.goal} {macro.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Goal reminder */}
            <div className="p-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl border border-emerald-500/30 text-center">
                <p className="text-white/70 text-xs md:text-sm">
                    🎯 <span className="text-emerald-400 font-bold">Daily Target:</span> 1800 kcal • 150g protein • 180g carbs • 50g fat • 30g fiber
                </p>
            </div>
        </div>
    );
}
