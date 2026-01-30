import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const router = Router();

router.post('/verify', (req: Request, res: Response) => {
    const { password } = req.body;
    const correctPassword = process.env.APP_PASSWORD || 'tabassum@25';

    if (password === correctPassword) {
        res.json({ success: true, message: 'Access granted' });
    } else {
        res.status(401).json({ success: false, message: 'Incorrect password' });
    }
});

export default router;
