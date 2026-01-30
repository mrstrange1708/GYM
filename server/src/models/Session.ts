import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise {
    name: string;
    duration: number;
    completed: boolean;
}

export interface ISession extends Document {
    date: Date;
    day: string;
    startTime: Date;
    endTime?: Date;
    completed: boolean;
    warmupExercises: IExercise[];
    strengthExercises: IExercise[];
    cardioExercises: IExercise[];
    totalDuration: number;
}

const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    completed: { type: Boolean, default: false }
});

const SessionSchema = new Schema({
    date: { type: Date, default: Date.now },
    day: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    completed: { type: Boolean, default: false },
    warmupExercises: [ExerciseSchema],
    strengthExercises: [ExerciseSchema],
    cardioExercises: [ExerciseSchema],
    totalDuration: { type: Number, default: 0 }
});

export const Session = mongoose.model<ISession>('Session', SessionSchema);
