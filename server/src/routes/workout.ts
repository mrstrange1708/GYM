import { Router, Request, Response } from 'express';
import { Session } from '../models/Session';

const router = Router();

// Start a new workout session
router.post('/start', async (req: Request, res: Response) => {
    try {
        const { day, warmupExercises, strengthExercises, cardioExercises } = req.body;

        const session = new Session({
            day,
            warmupExercises: warmupExercises || [],
            strengthExercises: strengthExercises || [],
            cardioExercises: cardioExercises || [],
            startTime: new Date()
        });

        await session.save();
        res.json({ success: true, session });
    } catch (error) {
        console.error('Error starting session:', error);
        res.status(500).json({ success: false, message: 'Failed to start session' });
    }
});

// Complete a workout session
router.put('/:id/complete', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { totalDuration, warmupExercises, strengthExercises, cardioExercises } = req.body;

        const session = await Session.findByIdAndUpdate(
            id,
            {
                completed: true,
                endTime: new Date(),
                totalDuration,
                warmupExercises,
                strengthExercises,
                cardioExercises
            },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        res.json({ success: true, session });
    } catch (error) {
        console.error('Error completing session:', error);
        res.status(500).json({ success: false, message: 'Failed to complete session' });
    }
});

// Get workout history
router.get('/history', async (req: Request, res: Response) => {
    try {
        const sessions = await Session.find()
            .sort({ date: -1 })
            .limit(30);
        res.json({ success: true, sessions });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
});

// Get today's session if exists
router.get('/today', async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const session = await Session.findOne({
            date: { $gte: today, $lt: tomorrow }
        });

        res.json({ success: true, session });
    } catch (error) {
        console.error('Error fetching today session:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch today session' });
    }
});

export default router;
