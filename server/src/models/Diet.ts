import mongoose, { Schema, Document } from 'mongoose';

export interface IMeal {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    vitamins?: string[];
    timestamp: Date;
}

export interface IDiet extends Document {
    date: Date;
    meals: IMeal[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

const MealSchema = new Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number },
    vitamins: [{ type: String }],
    timestamp: { type: Date, default: Date.now }
});

const DietSchema = new Schema({
    date: { type: Date, required: true },
    meals: [MealSchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 }
});

export const Diet = mongoose.model<IDiet>('Diet', DietSchema);
