'use client';

interface HeatmapProps {
    data: { date: string; duration: number }[];
}

export default function Heatmap({ data }: HeatmapProps) {
    // Generate last 84 days (12 weeks)
    const days = [];
    const today = new Date();

    for (let i = 83; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const workout = data.find(d => d.date === dateStr);
        days.push({
            date: dateStr,
            duration: workout?.duration || 0,
            dayOfWeek: date.getDay(),
            isToday: i === 0
        });
    }

    // Group by weeks
    const weeks: typeof days[] = [];
    let currentWeek: typeof days = [];

    days.forEach((day, index) => {
        currentWeek.push(day);
        if (day.dayOfWeek === 6 || index === days.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const getColor = (duration: number) => {
        if (duration === 0) return 'bg-white/5';
        if (duration < 20) return 'bg-green-900';
        if (duration < 30) return 'bg-green-700';
        if (duration < 40) return 'bg-green-500';
        return 'bg-green-400';
    };

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Activity Heatmap</h3>

            <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-2">
                    {dayLabels.map((label, i) => (
                        <div key={i} className="w-4 h-4 flex items-center justify-center text-[10px] text-white/40">
                            {i % 2 === 1 ? label : ''}
                        </div>
                    ))}
                </div>

                {/* Heatmap grid */}
                <div className="flex gap-1 overflow-x-auto">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {/* Pad first week if needed */}
                            {weekIndex === 0 && week[0]?.dayOfWeek > 0 && (
                                Array(week[0].dayOfWeek).fill(null).map((_, i) => (
                                    <div key={`pad-${i}`} className="w-4 h-4" />
                                ))
                            )}
                            {week.map((day, dayIndex) => (
                                <div
                                    key={day.date}
                                    className={`
                    w-4 h-4 rounded-sm transition-all cursor-pointer
                    ${getColor(day.duration)}
                    ${day.isToday ? 'ring-2 ring-emerald-500' : ''}
                    hover:ring-2 hover:ring-white/50
                  `}
                                    title={`${day.date}: ${day.duration > 0 ? `${day.duration} min` : 'No workout'}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-white/40">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-white/5" />
                <div className="w-3 h-3 rounded-sm bg-green-900" />
                <div className="w-3 h-3 rounded-sm bg-green-700" />
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <div className="w-3 h-3 rounded-sm bg-green-400" />
                <span>More</span>
            </div>
        </div>
    );
}
