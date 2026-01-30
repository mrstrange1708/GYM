'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '@/components/Timer';
import ExerciseCard from '@/components/ExerciseCard';
import ExerciseVideo from '@/components/ExerciseVideo';
import WorkoutProgress from '@/components/WorkoutProgress';
import Navbar from '@/components/Navbar';
import { getTodayWorkout, Exercise, PHASE_DURATIONS, TOTAL_WORKOUT_TIME } from '@/lib/workoutData';
import { startWorkout, completeWorkout } from '@/lib/api';

type Phase = 'warmup' | 'strength' | 'cardio';

export default function WorkoutPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [workout] = useState(getTodayWorkout());
    const [phase, setPhase] = useState<Phase>('warmup');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [completedExercises, setCompletedExercises] = useState<{ warmup: boolean[], strength: boolean[], cardio: boolean[] }>({
        warmup: [],
        strength: [],
        cardio: []
    });

    // Check authentication
    useEffect(() => {
        const auth = localStorage.getItem('gym-auth');
        if (!auth) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Get current exercises based on phase
    const getCurrentExercises = useCallback((): Exercise[] => {
        if (phase === 'warmup') return workout.warmup;
        if (phase === 'strength') return workout.strength;
        return workout.cardio;
    }, [phase, workout]);

    const currentExercises = getCurrentExercises();
    const currentExercise = currentExercises[currentExerciseIndex];

    // Track elapsed time
    useEffect(() => {
        if (!isStarted || isPaused || isCompleted) return;

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isStarted, isPaused, isCompleted]);

    // Start workout
    const handleStart = async () => {
        setIsStarted(true);
        setIsPaused(false);

        // Initialize completed exercises tracking
        setCompletedExercises({
            warmup: new Array(workout.warmup.length).fill(false),
            strength: new Array(workout.strength.length).fill(false),
            cardio: new Array(workout.cardio.length).fill(false)
        });

        // Start session in database
        const result = await startWorkout(
            workout.day,
            workout.warmup.map(e => ({ name: e.name, duration: e.duration, completed: false })),
            workout.strength.map(e => ({ name: e.name, duration: e.duration, completed: false })),
            workout.cardio.map(e => ({ name: e.name, duration: e.duration, completed: false }))
        );

        if (result?.session?._id) {
            setSessionId(result.session._id);
        }
    };

    // Complete current exercise and move to next
    const handleExerciseComplete = useCallback(() => {
        // Mark current exercise as completed
        setCompletedExercises(prev => ({
            ...prev,
            [phase]: prev[phase].map((v, i) => i === currentExerciseIndex ? true : v)
        }));

        // Move to next exercise or phase
        if (currentExerciseIndex < currentExercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            // Phase complete - move to next phase
            if (phase === 'warmup') {
                setPhase('strength');
                setCurrentExerciseIndex(0);
            } else if (phase === 'strength') {
                setPhase('cardio');
                setCurrentExerciseIndex(0);
            } else {
                // Workout complete!
                handleWorkoutComplete();
            }
        }
    }, [phase, currentExerciseIndex, currentExercises.length]);

    const handleWorkoutComplete = async () => {
        setIsCompleted(true);
        setIsPaused(true);

        if (sessionId) {
            await completeWorkout(
                sessionId,
                elapsedTime,
                workout.warmup.map(e => ({ name: e.name, duration: e.duration, completed: true })),
                workout.strength.map(e => ({ name: e.name, duration: e.duration, completed: true })),
                workout.cardio.map(e => ({ name: e.name, duration: e.duration, completed: true }))
            );
        }
    };

    // Rest day check
    if (workout.day === 'Sunday') {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-8xl mb-6">🛋️</div>
                    <h1 className="text-4xl font-bold text-white mb-4">{workout.title}</h1>
                    <p className="text-white/60 text-xl">{workout.description}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white pb-20 md:pt-20">
            <Navbar />

            {/* Header */}
            <header className="p-4 border-b border-white/10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold">{workout.title}</h1>
                    <p className="text-white/60">{workout.day} • {workout.description}</p>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-6xl mx-auto p-4">
                {!isStarted ? (
                    // Pre-workout screen
                    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="text-8xl mb-8 animate-bounce">💪</div>
                        <h2 className="text-4xl font-bold mb-4">Ready to Crush It?</h2>
                        <p className="text-white/60 text-xl mb-8">40 minutes of pure transformation</p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-orange-500/20 rounded-xl border border-orange-500/30">
                                <div className="text-3xl mb-2">🔥</div>
                                <div className="font-semibold">Warm-up</div>
                                <div className="text-white/60 text-sm">5 min</div>
                            </div>
                            <div className="p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                                <div className="text-3xl mb-2">💪</div>
                                <div className="font-semibold">Strength</div>
                                <div className="text-white/60 text-sm">25 min</div>
                            </div>
                            <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                <div className="text-3xl mb-2">❤️</div>
                                <div className="font-semibold">Cardio</div>
                                <div className="text-white/60 text-sm">10 min</div>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
                        >
                            START WORKOUT 🚀
                        </button>
                    </div>
                ) : isCompleted ? (
                    // Workout complete screen
                    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                        <div className="text-8xl mb-8">🎉</div>
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                            WORKOUT COMPLETE!
                        </h2>
                        <p className="text-white/60 text-xl mb-4">You crushed it today!</p>
                        <p className="text-2xl font-semibold text-emerald-400 mb-8">
                            Time: {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl text-xl font-bold hover:scale-105 transition-all"
                        >
                            Done 💪
                        </button>
                    </div>
                ) : (
                    // Active workout screen
                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                        {/* Left side - Timer and Video */}
                        <div className="space-y-6">
                            {/* Progress bar */}
                            <WorkoutProgress
                                phase={phase}
                                totalTime={TOTAL_WORKOUT_TIME}
                                elapsedTime={elapsedTime}
                            />

                            {/* Timer */}
                            <div className="flex justify-center">
                                <Timer
                                    key={`${phase}-${currentExerciseIndex}`}
                                    duration={currentExercise?.duration || 60}
                                    onComplete={handleExerciseComplete}
                                    isPaused={isPaused}
                                    label={currentExercise?.name || ''}
                                    phase={phase}
                                />
                            </div>

                            {/* Pause/Resume button */}
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className={`px-8 py-4 rounded-xl text-lg font-bold transition-all ${isPaused
                                        ? 'bg-green-600 hover:bg-green-500'
                                        : 'bg-yellow-600 hover:bg-yellow-500'
                                        }`}
                                >
                                    {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
                                </button>
                                <button
                                    onClick={handleExerciseComplete}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-lg font-bold transition-all"
                                >
                                    SKIP ⏭️
                                </button>
                            </div>

                            {/* Current exercise video */}
                            {currentExercise && (
                                <ExerciseVideo exercise={currentExercise} />
                            )}
                        </div>

                        {/* Right side - Exercise list */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white/80 uppercase tracking-wider">
                                {phase === 'warmup' ? '🔥 Warm-up' : phase === 'strength' ? '💪 Strength' : '❤️ Cardio'}
                            </h3>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {currentExercises.map((exercise, index) => (
                                    <ExerciseCard
                                        key={`${phase}-${index}`}
                                        exercise={exercise}
                                        isActive={index === currentExerciseIndex}
                                        isCompleted={completedExercises[phase][index]}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {/* Phase summary */}
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 mt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Phase Progress</span>
                                    <span className="text-white/80">
                                        {completedExercises[phase].filter(Boolean).length} / {currentExercises.length} exercises
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
