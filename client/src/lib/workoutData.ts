export interface Exercise {
    name: string;
    duration: number; // in seconds
    sets?: number;
    reps?: string; // Can be "12" or "30 sec" etc.
    instructions: string;
    videoUrl: string;
}

export interface DayWorkout {
    day: string;
    title: string;
    description: string;
    warmup: Exercise[];
    strength: Exercise[];
    cardio: Exercise[];
}

// Warmup exercises - same every day (5 minutes total)
const warmupExercises: Exercise[] = [
    {
        name: "Jumping Jacks",
        duration: 60,
        instructions: "Jump while spreading arms and legs, then return to standing position",
        videoUrl: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
    },
    {
        name: "Arm Circles (Forward + Backward)",
        duration: 60,
        instructions: "Extend arms and rotate in circles, 30 seconds each direction",
        videoUrl: "https://media.giphy.com/media/3oriO5EMLxl1f7funs/giphy.gif"
    },
    {
        name: "Hip Circles",
        duration: 60,
        instructions: "Place hands on hips and rotate in large circles",
        videoUrl: "https://media.giphy.com/media/l3V0dy1zzyjbYTQQM/giphy.gif"
    },
    {
        name: "Bodyweight Squats",
        duration: 60,
        instructions: "Stand feet shoulder-width apart, squat down keeping back straight",
        videoUrl: "https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.gif"
    },
    {
        name: "Toe Touch + Shoulder Stretch",
        duration: 60,
        instructions: "Bend forward to touch toes, then stretch shoulders",
        videoUrl: "https://media.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.gif"
    }
];

// Monday - Upper Push (Strength: ~25 min = 1500 sec)
const mondayStrength: Exercise[] = [
    {
        name: "Push-ups",
        duration: 300, // 5 min
        sets: 4,
        reps: "15 reps",
        instructions: "Keep body straight, lower chest to ground, push back up",
        videoUrl: "https://media.giphy.com/media/Kajba84HjVGHtrThAT/giphy.gif"
    },
    {
        name: "Pike Push-ups",
        duration: 300, // 5 min
        sets: 3,
        reps: "12 reps",
        instructions: "Form inverted V shape, lower head toward ground",
        videoUrl: "https://media.giphy.com/media/xULW8zdkZVa1dMfmtW/giphy.gif"
    },
    {
        name: "Chair/Bed Triceps Dips",
        duration: 300, // 5 min
        sets: 4,
        reps: "12 reps",
        instructions: "Hands on edge, lower body by bending elbows, push back up",
        videoUrl: "https://media.giphy.com/media/l0HlKfptHe8rJkKNa/giphy.gif"
    },
    {
        name: "Incline Push-ups (Slow)",
        duration: 300, // 5 min
        sets: 3,
        reps: "15 reps",
        instructions: "Hands elevated on surface, perform slow controlled push-ups",
        videoUrl: "https://media.giphy.com/media/3ohs7JomJSRdlxaVGg/giphy.gif"
    },
    {
        name: "Wide Push-ups",
        duration: 300, // 5 min
        sets: 3,
        reps: "12 reps",
        instructions: "Hands wider than shoulders, focus on chest activation",
        videoUrl: "https://media.giphy.com/media/Kajba84HjVGHtrThAT/giphy.gif"
    }
];

const mondayCardio: Exercise[] = [
    {
        name: "Mountain Climbers",
        duration: 600,
        instructions: "Plank position, alternate driving knees to chest at steady pace",
        videoUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0NTY3OA/giphy.gif"
    }
];

// Tuesday - Lower Body (Strength: ~25 min = 1500 sec)
const tuesdayStrength: Exercise[] = [
    {
        name: "Squats",
        duration: 300,
        sets: 4,
        reps: "15 reps",
        instructions: "Feet shoulder-width, lower until thighs parallel to ground",
        videoUrl: "https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.gif"
    },
    {
        name: "Forward Lunges",
        duration: 300,
        sets: 3,
        reps: "12 each leg",
        instructions: "Step forward, lower back knee toward ground, alternate legs",
        videoUrl: "https://media.giphy.com/media/xULW8zdkZVa1dMfmtW/giphy.gif"
    },
    {
        name: "Wall Sit",
        duration: 300,
        sets: 3,
        reps: "60 sec hold",
        instructions: "Back against wall, slide down until knees at 90 degrees, hold",
        videoUrl: "https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif"
    },
    {
        name: "Squat Pulses",
        duration: 300,
        sets: 3,
        reps: "20 reps",
        instructions: "Hold squat position, pulse up and down in small movements",
        videoUrl: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
    },
    {
        name: "Glute Bridges",
        duration: 300,
        sets: 4,
        reps: "15 reps",
        instructions: "Lie on back, push hips up squeezing glutes, lower slowly",
        videoUrl: "https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif"
    }
];

const tuesdayCardio: Exercise[] = [
    {
        name: "High Knees",
        duration: 600,
        instructions: "Run in place lifting knees high, controlled pace",
        videoUrl: "https://media.giphy.com/media/l3V0dy1zzyjbYTQQM/giphy.gif"
    }
];

// Wednesday - Pull + Core (Strength: ~25 min = 1500 sec)
const wednesdayStrength: Exercise[] = [
    {
        name: "Superman Hold",
        duration: 300,
        sets: 4,
        reps: "30 sec hold",
        instructions: "Lie face down, lift arms and legs off ground, hold",
        videoUrl: "https://media.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.gif"
    },
    {
        name: "Towel Rows",
        duration: 300,
        sets: 4,
        reps: "12 reps",
        instructions: "Anchor towel to door/bed, pull toward chest, squeeze back",
        videoUrl: "https://media.giphy.com/media/3oriO5EMLxl1f7funs/giphy.gif"
    },
    {
        name: "Plank",
        duration: 300,
        sets: 3,
        reps: "45 sec hold",
        instructions: "Forearms on ground, body straight line, hold position",
        videoUrl: "https://media.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.gif"
    },
    {
        name: "Leg Raises",
        duration: 300,
        sets: 3,
        reps: "15 reps",
        instructions: "Lie on back, raise legs to 90 degrees, lower slowly",
        videoUrl: "https://media.giphy.com/media/l0HlKfptHe8rJkKNa/giphy.gif"
    },
    {
        name: "Bicycle Crunches",
        duration: 300,
        sets: 3,
        reps: "20 each side",
        instructions: "Alternate elbow to opposite knee, twist core",
        videoUrl: "https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif"
    }
];

const wednesdayCardio: Exercise[] = [
    {
        name: "Invisible Jump Rope",
        duration: 600,
        instructions: "Mimic jump rope motion without rope, stay on toes",
        videoUrl: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
    }
];

// Thursday - Full Body Conditioning (Strength: ~25 min = 1500 sec)
const thursdayStrength: Exercise[] = [
    {
        name: "Burpees",
        duration: 375,
        sets: 5,
        reps: "10 reps",
        instructions: "Squat, jump back to plank, push-up, jump up, repeat",
        videoUrl: "https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.gif"
    },
    {
        name: "Squat → Punch",
        duration: 375,
        sets: 4,
        reps: "15 reps",
        instructions: "Squat down, stand up with alternating punches",
        videoUrl: "https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.gif"
    },
    {
        name: "Plank Shoulder Taps",
        duration: 375,
        sets: 3,
        reps: "20 each side",
        instructions: "Plank position, alternate tapping opposite shoulder",
        videoUrl: "https://media.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.gif"
    },
    {
        name: "Mountain Climbers",
        duration: 375,
        sets: 3,
        reps: "30 each leg",
        instructions: "Plank position, alternate driving knees to chest fast",
        videoUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0NTY3OA/giphy.gif"
    }
];

const thursdayCardio: Exercise[] = [
    {
        name: "Jumping Jacks (Non-stop)",
        duration: 600,
        instructions: "Continuous jumping jacks, maintain steady pace",
        videoUrl: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
    }
];

// Friday - Shoulders + Arms (Strength: ~25 min = 1500 sec)
const fridayStrength: Exercise[] = [
    {
        name: "Arm Circles (Slow & Controlled)",
        duration: 300,
        sets: 3,
        reps: "60 sec forward + backward",
        instructions: "Slow, controlled arm circles, feel the burn",
        videoUrl: "https://media.giphy.com/media/3oriO5EMLxl1f7funs/giphy.gif"
    },
    {
        name: "Diamond Push-ups",
        duration: 300,
        sets: 4,
        reps: "10 reps",
        instructions: "Hands form diamond shape under chest, perform push-ups",
        videoUrl: "https://media.giphy.com/media/Kajba84HjVGHtrThAT/giphy.gif"
    },
    {
        name: "Isometric Biceps Hold",
        duration: 300,
        sets: 4,
        reps: "30 sec hold",
        instructions: "Towel curl position, squeeze and hold at 90 degrees",
        videoUrl: "https://media.giphy.com/media/l0HlKfptHe8rJkKNa/giphy.gif"
    },
    {
        name: "Triceps Dips",
        duration: 300,
        sets: 4,
        reps: "12 reps",
        instructions: "Use chair or bed edge, dip down and push up",
        videoUrl: "https://media.giphy.com/media/l0HlKfptHe8rJkKNa/giphy.gif"
    },
    {
        name: "Pike Push-ups",
        duration: 300,
        sets: 3,
        reps: "10 reps",
        instructions: "Inverted V position, lower head toward ground for shoulders",
        videoUrl: "https://media.giphy.com/media/xULW8zdkZVa1dMfmtW/giphy.gif"
    }
];

const fridayCardio: Exercise[] = [
    {
        name: "Mountain Climbers",
        duration: 600,
        instructions: "Plank position, alternate driving knees to chest",
        videoUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjM0NTY3OA/giphy.gif"
    }
];

// Saturday - Core + Mobility (Strength: ~25 min = 1500 sec)
const saturdayStrength: Exercise[] = [
    {
        name: "Plank",
        duration: 300,
        sets: 3,
        reps: "60 sec hold",
        instructions: "Hold plank position, focus on breathing",
        videoUrl: "https://media.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.gif"
    },
    {
        name: "Bicycle Crunch",
        duration: 300,
        sets: 3,
        reps: "20 each side",
        instructions: "Alternate elbow to opposite knee, twist core",
        videoUrl: "https://media.giphy.com/media/3o7TKP9ln2Dr6ze6f6/giphy.gif"
    },
    {
        name: "Cobra Stretch",
        duration: 300,
        sets: 3,
        reps: "45 sec hold",
        instructions: "Lie face down, push upper body up, stretch abs",
        videoUrl: "https://media.giphy.com/media/xT1XGzAnABSXy8DPCU/giphy.gif"
    },
    {
        name: "Child's Pose",
        duration: 300,
        sets: 3,
        reps: "45 sec hold",
        instructions: "Kneel, sit back on heels, arms extended forward",
        videoUrl: "https://media.giphy.com/media/l3V0dy1zzyjbYTQQM/giphy.gif"
    },
    {
        name: "Cat-Cow Stretch",
        duration: 300,
        sets: 3,
        reps: "10 cycles",
        instructions: "On all fours, arch and round back alternately",
        videoUrl: "https://media.giphy.com/media/l3V0dy1zzyjbYTQQM/giphy.gif"
    }
];

const saturdayCardio: Exercise[] = [
    {
        name: "Brisk Walk in Place",
        duration: 600,
        instructions: "Walk briskly in place, swing arms naturally",
        videoUrl: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
    }
];

// Sunday - Rest Day
const sundayStrength: Exercise[] = [];
const sundayCardio: Exercise[] = [];

export const workoutSchedule: DayWorkout[] = [
    {
        day: "Sunday",
        title: "🛋️ REST DAY",
        description: "Recovery is part of the process. Rest, hydrate, sleep well.",
        warmup: [],
        strength: sundayStrength,
        cardio: sundayCardio
    },
    {
        day: "Monday",
        title: "💪 UPPER PUSH",
        description: "Chest, Shoulders, Triceps + Cardio",
        warmup: warmupExercises,
        strength: mondayStrength,
        cardio: mondayCardio
    },
    {
        day: "Tuesday",
        title: "🦵 LOWER BODY",
        description: "Legs + Thigh Fat Focus + Cardio",
        warmup: warmupExercises,
        strength: tuesdayStrength,
        cardio: tuesdayCardio
    },
    {
        day: "Wednesday",
        title: "🔙 PULL + CORE",
        description: "Back, Biceps, Abs + Cardio",
        warmup: warmupExercises,
        strength: wednesdayStrength,
        cardio: wednesdayCardio
    },
    {
        day: "Thursday",
        title: "🔥 FULL BODY CONDITIONING",
        description: "Fat-Loss Heavy Day - You'll hate it. Good.",
        warmup: warmupExercises,
        strength: thursdayStrength,
        cardio: thursdayCardio
    },
    {
        day: "Friday",
        title: "💎 SHOULDERS + ARMS",
        description: "Definition Day + Cardio",
        warmup: warmupExercises,
        strength: fridayStrength,
        cardio: fridayCardio
    },
    {
        day: "Saturday",
        title: "🧘 CORE + MOBILITY",
        description: "Recovery Day - Light Cardio",
        warmup: warmupExercises,
        strength: saturdayStrength,
        cardio: saturdayCardio
    }
];

export const getTodayWorkout = (): DayWorkout => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return workoutSchedule.find(w => w.day === today) || workoutSchedule[0];
};

export const PHASE_DURATIONS = {
    warmup: 5 * 60,    // 5 minutes
    strength: 25 * 60, // 25 minutes
    cardio: 10 * 60    // 10 minutes
};

export const TOTAL_WORKOUT_TIME = 40 * 60; // 40 minutes in seconds
