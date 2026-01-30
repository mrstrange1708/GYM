import cron from 'node-cron';
import { Session } from '../models/Session';
import { sendReminderEmail } from './emailService';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const REMINDER_EMAIL = 'junaidsamishaik@gmail.com';

// Check if user exercised today
const checkTodayWorkout = async (): Promise<boolean> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const session = await Session.findOne({
        date: { $gte: today, $lt: tomorrow },
        completed: true
    });

    return !!session;
};

// Schedule daily reminder at 8 PM IST (14:30 UTC)
export const startScheduler = () => {
    // Run at 8:00 PM IST every day
    // IST is UTC+5:30, so 8:00 PM IST = 14:30 UTC
    cron.schedule('30 14 * * *', async () => {
        console.log('⏰ Running 8 PM workout check...');

        // Skip Sunday (rest day)
        const today = new Date();
        if (today.getDay() === 0) {
            console.log('📅 Sunday - rest day, skipping reminder');
            return;
        }

        const hasWorkedOut = await checkTodayWorkout();

        if (!hasWorkedOut) {
            console.log('❌ No workout today, sending reminder...');
            await sendReminderEmail(REMINDER_EMAIL);
        } else {
            console.log('✅ Workout completed today, no reminder needed');
        }
    }, {
        timezone: 'Asia/Kolkata' // IST timezone
    });

    console.log('📅 Scheduler started - Daily reminder at 8:00 PM IST');
};

// Manual trigger for testing
export const triggerReminderCheck = async () => {
    const hasWorkedOut = await checkTodayWorkout();

    if (!hasWorkedOut) {
        await sendReminderEmail(REMINDER_EMAIL);
        return { sent: true, message: 'Reminder email sent' };
    }

    return { sent: false, message: 'Workout already completed today' };
};
