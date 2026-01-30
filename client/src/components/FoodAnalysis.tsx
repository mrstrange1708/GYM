'use client';

interface FoodAnalysisProps {
    food: {
        name: string;
        quantity?: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
        vitamins?: string[];
    };
    onAdd: () => void;
}

export default function FoodAnalysis({ food, onAdd }: FoodAnalysisProps) {
    return (
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30 p-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white">{food.name}</h3>
                    {food.quantity && (
                        <p className="text-emerald-400 text-sm font-medium">📊 {food.quantity}</p>
                    )}
                    <p className="text-white/60 text-sm">AI-analyzed nutrition</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">{food.calories}</div>
                    <div className="text-white/50 text-sm">calories</div>
                </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-xl font-bold text-red-400">{food.protein}g</div>
                    <div className="text-white/50 text-xs">Protein</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-xl font-bold text-blue-400">{food.carbs}g</div>
                    <div className="text-white/50 text-xs">Carbs</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-xl font-bold text-yellow-400">{food.fat}g</div>
                    <div className="text-white/50 text-xs">Fat</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{food.fiber || 0}g</div>
                    <div className="text-white/50 text-xs">Fiber</div>
                </div>
            </div>

            {/* Vitamins if present */}
            {food.vitamins && food.vitamins.length > 0 && (
                <div className="mb-6">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Vitamins & Minerals</p>
                    <div className="flex flex-wrap gap-2">
                        {food.vitamins.map((vitamin, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-white/70 text-xs">
                                {vitamin}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={onAdd}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-bold hover:opacity-90 transition-all"
            >
                ➕ Add to Today's Intake
            </button>
        </div>
    );
}
