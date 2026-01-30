import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import workoutRoutes from './routes/workout';
import dietRoutes from './routes/diet';
import { startScheduler, triggerReminderCheck } from './services/scheduler';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads

// Connect to MongoDB
connectDB();

// Start the email reminder scheduler
startScheduler();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/diet', dietRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Gym Tracker API is running' });
});

// Manual trigger for testing reminder
app.post('/api/reminder/test', async (req, res) => {
    const result = await triggerReminderCheck();
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`🏋️ Gym Tracker Server running on port ${PORT}`);
});
