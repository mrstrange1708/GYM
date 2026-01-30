'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NutritionProgress from '@/components/NutritionProgress';
import { API_BASE } from '@/lib/api';

interface FoodEntry {
    _id?: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    vitamins?: string[];
    quantity?: string;
    timestamp?: string;
}

export default function DietPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedFood, setAnalyzedFood] = useState<FoodEntry | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFood, setEditedFood] = useState<FoodEntry | null>(null);
    const [todaysMeals, setTodaysMeals] = useState<FoodEntry[]>([]);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const auth = localStorage.getItem('gym-auth');
        if (!auth) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
            // Cleanup old meals on load
            cleanupOldMeals();
            fetchTodaysMeals();
        }
    }, [router]);

    const cleanupOldMeals = async () => {
        try {
            await fetch(`${API_BASE}/api/diet/cleanup`, { method: 'DELETE' });
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    };

    const fetchTodaysMeals = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/diet/today`);
            const data = await response.json();
            if (data.meals) {
                setTodaysMeals(data.meals);
                calculateTotals(data.meals);
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    };

    const calculateTotals = (meals: FoodEntry[]) => {
        const totals = meals.reduce(
            (acc, meal) => ({
                calories: acc.calories + (meal.calories || 0),
                protein: acc.protein + (meal.protein || 0),
                carbs: acc.carbs + (meal.carbs || 0),
                fat: acc.fat + (meal.fat || 0),
                fiber: acc.fiber + (meal.fiber || 0)
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
        );
        setTotals(totals);
    };

    const processImage = async (file: File) => {
        setIsAnalyzing(true);
        setError('');
        setAnalyzedFood(null);
        setIsEditing(false);

        try {
            const previewReader = new FileReader();
            previewReader.onloadend = () => {
                setPreviewImage(previewReader.result as string);
            };
            previewReader.readAsDataURL(file);

            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64 = (reader.result as string).split(',')[1];
                    const response = await fetch(`${API_BASE}/api/diet/analyze`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: base64 })
                    });

                    const data = await response.json();
                    if (data.success && data.food) {
                        setAnalyzedFood(data.food);
                        setEditedFood(data.food);
                    } else {
                        setError(data.message || 'Failed to analyze food. Please try again.');
                    }
                } catch (err) {
                    console.error('Fetch error:', err);
                    setError('Network error. Make sure the server is running.');
                }
                setIsAnalyzing(false);
            };
            reader.onerror = () => {
                setError('Failed to read image file');
                setIsAnalyzing(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Failed to process image');
            setIsAnalyzing(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImage(file);
        }
        e.target.value = '';
    };

    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error('Camera access error:', err);
            setError('Unable to access camera. Please check permissions.');
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                        processImage(file);
                        closeCamera();
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const handleAddFood = async () => {
        const foodToAdd = isEditing ? editedFood : analyzedFood;
        if (!foodToAdd) return;

        try {
            const response = await fetch(`${API_BASE}/api/diet/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodToAdd)
            });

            const data = await response.json();
            if (data.success) {
                setTodaysMeals([...todaysMeals, { ...foodToAdd, _id: data.mealId }]);
                calculateTotals([...todaysMeals, foodToAdd]);
                setAnalyzedFood(null);
                setEditedFood(null);
                setPreviewImage(null);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error logging food:', error);
            setError('Failed to log food');
        }
    };

    const handleDeleteMeal = async (mealId: string) => {
        try {
            const response = await fetch(`${API_BASE}/api/diet/meal/${mealId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                const updatedMeals = todaysMeals.filter(m => m._id !== mealId);
                setTodaysMeals(updatedMeals);
                calculateTotals(updatedMeals);
            }
        } catch (error) {
            console.error('Error deleting meal:', error);
        }
    };

    const startEditing = () => {
        setIsEditing(true);
        if (analyzedFood) {
            setEditedFood({ ...analyzedFood });
        }
    };

    const updateEditedField = (field: keyof FoodEntry, value: string | number) => {
        if (editedFood) {
            setEditedFood({ ...editedFood, [field]: value });
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pb-24 pt-4 md:pt-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-4xl font-bold mb-2">🥗 Diet Tracker</h1>
                    <p className="text-gray-400 text-sm md:text-base">AI-powered food analysis</p>
                    <div className="mt-2 text-emerald-400 font-semibold text-sm md:text-base">🎯 1800 kcal • 150g protein</div>
                </div>

                {/* Nutrition Progress */}
                <div className="mb-6">
                    <NutritionProgress
                        calories={totals.calories}
                        protein={totals.protein}
                        carbs={totals.carbs}
                        fat={totals.fat}
                        fiber={totals.fiber}
                    />
                </div>

                {/* Upload Section */}
                <div className="mb-6">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {isAnalyzing ? (
                        <div className="p-6 md:p-8 border-2 border-dashed border-emerald-500/50 rounded-2xl text-center bg-emerald-500/10">
                            <div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-white font-semibold text-sm md:text-base">Analyzing food with AI...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <button
                                onClick={openCamera}
                                className="p-4 md:p-6 border-2 border-dashed border-gray-600 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-center"
                            >
                                <div className="text-3xl md:text-4xl mb-2">📷</div>
                                <p className="text-white font-semibold text-sm md:text-base">Take Photo</p>
                                <p className="text-gray-500 text-xs">Open camera</p>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-4 md:p-6 border-2 border-dashed border-gray-600 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-center"
                            >
                                <div className="text-3xl md:text-4xl mb-2">🖼️</div>
                                <p className="text-white font-semibold text-sm md:text-base">Choose Photo</p>
                                <p className="text-gray-500 text-xs">From gallery</p>
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
                            {error}
                            <button onClick={() => setError('')} className="ml-3 text-white/60 hover:text-white">✕</button>
                        </div>
                    )}
                </div>

                {/* Preview and Analysis */}
                {(previewImage || analyzedFood) && (
                    <div className="mb-6 space-y-4">
                        {previewImage && (
                            <div className="relative">
                                <img
                                    src={previewImage}
                                    alt="Food preview"
                                    className="w-full max-w-sm mx-auto rounded-2xl border border-gray-700"
                                />
                                {!analyzedFood && !isAnalyzing && (
                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full text-white hover:bg-black/70"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        )}

                        {analyzedFood && (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl border border-gray-600 p-4 md:p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedFood?.name || ''}
                                                onChange={(e) => updateEditedField('name', e.target.value)}
                                                className="text-lg md:text-xl font-bold text-white bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 w-full"
                                            />
                                        ) : (
                                            <h3 className="text-lg md:text-xl font-bold text-white">{analyzedFood.name}</h3>
                                        )}
                                        {analyzedFood.quantity && !isEditing && (
                                            <p className="text-emerald-400 text-sm">📊 {analyzedFood.quantity}</p>
                                        )}
                                    </div>
                                    <div className="text-right ml-4">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editedFood?.calories || 0}
                                                onChange={(e) => updateEditedField('calories', parseInt(e.target.value) || 0)}
                                                className="text-xl font-bold text-emerald-400 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 w-20 text-right"
                                            />
                                        ) : (
                                            <div className="text-2xl font-bold text-emerald-400">{analyzedFood.calories}</div>
                                        )}
                                        <div className="text-gray-400 text-xs">kcal</div>
                                    </div>
                                </div>

                                {/* Macros Grid */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {['protein', 'carbs', 'fat', 'fiber'].map((macro) => (
                                        <div key={macro} className="text-center p-2 md:p-3 bg-gray-700/50 rounded-xl">
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editedFood?.[macro as keyof FoodEntry] || 0}
                                                    onChange={(e) => updateEditedField(macro as keyof FoodEntry, parseInt(e.target.value) || 0)}
                                                    className="text-base md:text-lg font-bold text-center bg-gray-600 border border-gray-500 rounded w-full mb-1"
                                                />
                                            ) : (
                                                <div className={`text-base md:text-lg font-bold ${macro === 'protein' ? 'text-red-400' :
                                                        macro === 'carbs' ? 'text-blue-400' :
                                                            macro === 'fat' ? 'text-yellow-400' : 'text-green-400'
                                                    }`}>
                                                    {(analyzedFood as any)[macro] || 0}g
                                                </div>
                                            )}
                                            <div className="text-gray-400 text-xs capitalize">{macro}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <button
                                                onClick={startEditing}
                                                className="flex-1 py-2 md:py-3 bg-gray-600 rounded-xl text-white font-semibold hover:bg-gray-500 transition-all text-sm md:text-base"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={handleAddFood}
                                                className="flex-1 py-2 md:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold hover:opacity-90 transition-all text-sm md:text-base"
                                            >
                                                ➕ Add
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setIsEditing(false); setEditedFood(analyzedFood); }}
                                                className="flex-1 py-2 md:py-3 bg-gray-600 rounded-xl text-white font-semibold hover:bg-gray-500 transition-all text-sm md:text-base"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleAddFood}
                                                className="flex-1 py-2 md:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold hover:opacity-90 transition-all text-sm md:text-base"
                                            >
                                                ✓ Save & Add
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Today's Meals */}
                <div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-3">🍽️ Today's Meals</h3>

                    {todaysMeals.length === 0 ? (
                        <div className="text-center py-8 md:py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
                            <div className="text-3xl md:text-4xl mb-3">🍴</div>
                            <p className="text-gray-400 text-sm md:text-base">No meals logged today</p>
                            <p className="text-gray-500 text-xs">Take a photo to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-2 md:space-y-3">
                            {todaysMeals.map((meal, index) => (
                                <div
                                    key={meal._id || index}
                                    className="p-3 md:p-4 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-between"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white text-sm md:text-base truncate">{meal.name}</div>
                                        {meal.quantity && (
                                            <div className="text-emerald-400 text-xs">{meal.quantity}</div>
                                        )}
                                        <div className="text-gray-400 text-xs">
                                            P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3 ml-2">
                                        <div className="text-right">
                                            <div className="text-base md:text-lg font-bold text-emerald-400">{meal.calories}</div>
                                            <div className="text-gray-500 text-xs">kcal</div>
                                        </div>
                                        <button
                                            onClick={() => meal._id && handleDeleteMeal(meal._id)}
                                            className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center text-red-400 transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Camera Modal */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    <button
                        onClick={closeCamera}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-colors"
                    >
                        ✕
                    </button>

                    <div className="flex-1 flex items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    <div className="p-6 flex justify-center">
                        <button
                            onClick={capturePhoto}
                            className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500 rounded-full" />
                        </button>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            )}
        </main>
    );
}
