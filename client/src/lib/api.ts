export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777';

export const verifyPassword = async (password: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE}/api/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Auth error:', error);
        return false;
    }
};

export const startWorkout = async (day: string, warmupExercises: any[], strengthExercises: any[], cardioExercises: any[]) => {
    try {
        const response = await fetch(`${API_BASE}/api/workout/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, warmupExercises, strengthExercises, cardioExercises })
        });
        return await response.json();
    } catch (error) {
        console.error('Start workout error:', error);
        return null;
    }
};

export const completeWorkout = async (
    sessionId: string,
    totalDuration: number,
    warmupExercises: any[],
    strengthExercises: any[],
    cardioExercises: any[]
) => {
    try {
        const response = await fetch(`${API_BASE}/api/workout/${sessionId}/complete`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalDuration, warmupExercises, strengthExercises, cardioExercises })
        });
        return await response.json();
    } catch (error) {
        console.error('Complete workout error:', error);
        return null;
    }
};

export const getWorkoutHistory = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/workout/history`);
        return await response.json();
    } catch (error) {
        console.error('History error:', error);
        return { sessions: [] };
    }
};
