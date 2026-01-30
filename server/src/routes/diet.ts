import { Router, Request, Response } from 'express';
import { Diet } from '../models/Diet';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const router = Router();

// Analyze food image using Groq API (OpenAI-compatible endpoint)
router.post('/analyze', async (req: Request, res: Response) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ success: false, message: 'No image provided' });
        }

        console.log('Analyzing food with Groq API...');

        // Use Groq's OpenAI-compatible API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Analyze this food image and estimate the nutritional information.

IMPORTANT:
1. Identify the food items visible in the image
2. Estimate the QUANTITY/PORTION SIZE (e.g., "1 cup", "2 pieces", "300g", "1 plate")
3. Calculate nutritional values based on the estimated quantity

Return ONLY a valid JSON object with no additional text:
{
  "name": "descriptive food name",
  "quantity": "estimated portion size",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "vitamins": ["Vitamin A", "Iron", etc.]
}

Be realistic with nutritional values for the portion size.`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 600
            })
        });

        const data = await response.json() as any;
        console.log('Groq response status:', response.status);

        if (!response.ok) {
            console.error('Groq API error:', data);
            return res.status(500).json({
                success: false,
                message: data.error?.message || 'Failed to analyze food'
            });
        }

        const responseText = data.choices?.[0]?.message?.content || '';
        console.log('Groq response:', responseText);

        // Parse the JSON response
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const food = JSON.parse(jsonMatch[0]);
                res.json({ success: true, food });
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('Parse error:', parseError, 'Response:', responseText);
            res.status(500).json({
                success: false,
                message: 'Failed to parse food analysis',
                raw: responseText
            });
        }
    } catch (error) {
        console.error('Groq API error:', error);
        res.status(500).json({ success: false, message: 'Failed to analyze food' });
    }
});

// Log a meal
router.post('/log', async (req: Request, res: Response) => {
    try {
        const { name, quantity, calories, protein, carbs, fat, fiber, vitamins } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let diet = await Diet.findOne({
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (!diet) {
            diet = new Diet({
                date: today,
                meals: [],
                totalCalories: 0,
                totalProtein: 0,
                totalCarbs: 0,
                totalFat: 0
            });
        }

        const meal = {
            name,
            quantity,
            calories: calories || 0,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            fiber: fiber || 0,
            vitamins: vitamins || [],
            timestamp: new Date()
        };

        diet.meals.push(meal);
        diet.totalCalories += calories || 0;
        diet.totalProtein += protein || 0;
        diet.totalCarbs += carbs || 0;
        diet.totalFat += fat || 0;

        await diet.save();

        res.json({
            success: true,
            mealId: (diet.meals[diet.meals.length - 1] as any)._id,
            totals: {
                calories: diet.totalCalories,
                protein: diet.totalProtein,
                carbs: diet.totalCarbs,
                fat: diet.totalFat
            }
        });
    } catch (error) {
        console.error('Error logging meal:', error);
        res.status(500).json({ success: false, message: 'Failed to log meal' });
    }
});

// Get today's meals
router.get('/today', async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diet = await Diet.findOne({
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (!diet) {
            return res.json({
                success: true,
                meals: [],
                totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }
            });
        }

        res.json({
            success: true,
            meals: diet.meals,
            totals: {
                calories: diet.totalCalories,
                protein: diet.totalProtein,
                carbs: diet.totalCarbs,
                fat: diet.totalFat
            }
        });
    } catch (error) {
        console.error('Error fetching today meals:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch meals' });
    }
});

// Delete a meal
router.delete('/meal/:mealId', async (req: Request, res: Response) => {
    try {
        const { mealId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diet = await Diet.findOne({
            date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (!diet) {
            return res.status(404).json({ success: false, message: 'No diet record found' });
        }

        const mealIndex = diet.meals.findIndex((m: any) => m._id.toString() === mealId);
        if (mealIndex === -1) {
            return res.status(404).json({ success: false, message: 'Meal not found' });
        }

        const meal = diet.meals[mealIndex] as any;
        diet.totalCalories -= meal.calories || 0;
        diet.totalProtein -= meal.protein || 0;
        diet.totalCarbs -= meal.carbs || 0;
        diet.totalFat -= meal.fat || 0;

        diet.meals.splice(mealIndex, 1);
        await diet.save();

        res.json({ success: true, message: 'Meal deleted' });
    } catch (error) {
        console.error('Error deleting meal:', error);
        res.status(500).json({ success: false, message: 'Failed to delete meal' });
    }
});

// Cleanup old diet records (older than today)
router.delete('/cleanup', async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await Diet.deleteMany({ date: { $lt: today } });

        res.json({ success: true, message: 'Old diet records cleaned up' });
    } catch (error) {
        console.error('Error cleaning up:', error);
        res.status(500).json({ success: false, message: 'Failed to cleanup' });
    }
});

export default router;
