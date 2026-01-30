'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Heatmap from '@/components/Heatmap';
import { API_BASE } from '@/lib/api';

interface WorkoutSession {
    _id: string;
    date: string;
    day: string;
    completed: boolean;
    totalDuration: number;
}

interface Stats {
    totalDays: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
}

export default function TrackerPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [heatmapData, setHeatmapData] = useState<{ date: string; duration: number }[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalDays: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0
    });

    useEffect(() => {
        const auth = localStorage.getItem('gym-auth');
        if (!auth) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
            fetchData();
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/workout/history`);
            const data = await response.json();

            if (data.sessions) {
                setSessions(data.sessions);

                // Calculate heatmap data
                const completedSessions = data.sessions.filter((s: WorkoutSession) => s.completed);
                const heatmap = completedSessions.map((s: WorkoutSession) => ({
                    date: new Date(s.date).toISOString().split('T')[0],
                    duration: Math.round(s.totalDuration / 60) // Convert to minutes
                }));
                setHeatmapData(heatmap);

                // Calculate stats
                const totalMinutes = completedSessions.reduce((acc: number, s: WorkoutSession) =>
                    acc + Math.round(s.totalDuration / 60), 0);

                // Calculate streak properly - only count actual workout days
                let currentStreak = 0;
                let longestStreak = 0;

                if (heatmap.length > 0) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Sort workout dates
                    const workoutDates = heatmap
                        .map((h: { date: string }) => h.date)
                        .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

                    // Check if there's a workout today or yesterday to start streak
                    const todayStr = today.toISOString().split('T')[0];
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    // Calculate current streak (consecutive days from today/yesterday)
                    let checkDate = new Date(today);
                    let hasRecentWorkout = workoutDates.includes(todayStr) || workoutDates.includes(yesterdayStr);

                    if (hasRecentWorkout) {
                        // Start from the most recent workout
                        if (!workoutDates.includes(todayStr) && workoutDates.includes(yesterdayStr)) {
                            checkDate = yesterday;
                        }

                        for (let i = 0; i < 365; i++) {
                            const dateStr = checkDate.toISOString().split('T')[0];
                            const isRestDay = checkDate.getDay() === 0; // Sunday
                            const hasWorkout = workoutDates.includes(dateStr);

                            if (hasWorkout) {
                                currentStreak++;
                            } else if (isRestDay) {
                                // Skip rest days but don't break streak
                            } else {
                                break; // No workout on non-rest day, streak breaks
                            }

                            checkDate.setDate(checkDate.getDate() - 1);
                        }
                    }

                    // Calculate longest streak
                    let tempStreak = 0;
                    for (let i = 0; i < 365; i++) {
                        const checkDate = new Date(today);
                        checkDate.setDate(checkDate.getDate() - i);
                        const dateStr = checkDate.toISOString().split('T')[0];
                        const isRestDay = checkDate.getDay() === 0;
                        const hasWorkout = workoutDates.includes(dateStr);

                        if (hasWorkout) {
                            tempStreak++;
                            longestStreak = Math.max(longestStreak, tempStreak);
                        } else if (!isRestDay) {
                            tempStreak = 0;
                        }
                    }
                }

                setStats({
                    totalDays: completedSessions.length,
                    totalMinutes,
                    currentStreak,
                    longestStreak
                });
            } else {
                // No sessions - reset everything to 0
                setStats({
                    totalDays: 0,
                    totalMinutes: 0,
                    currentStreak: 0,
                    longestStreak: 0
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

            <div className="max-w-6xl mx-auto p-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">📊 Workout Tracker</h1>
                    <p className="text-white/60">Track your fitness journey</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl border border-emerald-500/30">
                        <div className="text-4xl font-bold text-emerald-400">{stats.totalDays}</div>
                        <div className="text-white/60 text-sm mt-1">Total Workouts</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30">
                        <div className="text-4xl font-bold text-blue-400">{stats.totalMinutes}</div>
                        <div className="text-white/60 text-sm mt-1">Minutes Trained</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl border border-green-500/30">
                        <div className="text-4xl font-bold text-green-400">{stats.currentStreak}</div>
                        <div className="text-white/60 text-sm mt-1">Current Streak</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-orange-600/20 to-yellow-600/20 rounded-2xl border border-orange-500/30">
                        <div className="text-4xl font-bold text-orange-400">{stats.longestStreak}</div>
                        <div className="text-white/60 text-sm mt-1">Longest Streak</div>
                    </div>
                </div>

                {/* Heatmap */}
                <Heatmap data={heatmapData} />

                {/* Recent Workouts */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Workouts</h3>
                    <div className="space-y-3">
                        {sessions.slice(0, 10).map((session) => (
                            <div
                                key={session._id}
                                className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${session.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <div>
                                        <div className="font-medium">{session.day}</div>
                                        <div className="text-white/50 text-sm">
                                            {new Date(session.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-medium ${session.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {session.completed ? 'Completed' : 'In Progress'}
                                    </div>
                                    <div className="text-white/50 text-sm">
                                        {Math.round(session.totalDuration / 60)} min
                                    </div>
                                </div>
                            </div>
                        ))}

                        {sessions.length === 0 && (
                            <div className="text-center py-12 text-white/40">
                                <div className="text-4xl mb-4">🏋️</div>
                                <p>No workouts yet. Start your first workout!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
