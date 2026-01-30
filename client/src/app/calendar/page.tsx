'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CalendarDay from '@/components/CalendarDay';
import { workoutSchedule } from '@/lib/workoutData';
import { API_BASE } from '@/lib/api';

export default function CalendarPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [completedDays, setCompletedDays] = useState<string[]>([]);

    useEffect(() => {
        const auth = localStorage.getItem('gym-auth');
        if (!auth) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
            // Fetch completed days from API
            fetchCompletedDays();
        }
    }, [router]);

    const fetchCompletedDays = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/workout/history`);
            const data = await response.json();
            if (data.sessions) {
                const days = data.sessions
                    .filter((s: any) => s.completed)
                    .map((s: any) => new Date(s.date).toDateString());
                setCompletedDays(days);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const today = new Date().getDay();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const todayName = days[today];

    // Check if today was completed
    const isTodayCompleted = completedDays.includes(new Date().toDateString());

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
                    <h1 className="text-4xl font-bold mb-2">📅 Weekly Schedule</h1>
                    <p className="text-white/60">Your workout plan for the week</p>
                </div>

                {/* Calendar Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {workoutSchedule.map((workout) => (
                        <CalendarDay
                            key={workout.day}
                            workout={workout}
                            isToday={workout.day === todayName}
                            isCompleted={workout.day === todayName ? isTodayCompleted : false}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-600/50 border border-emerald-500" />
                        <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-600/50 border border-green-500" />
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-800/50 border border-gray-700" />
                        <span>Rest Day</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
