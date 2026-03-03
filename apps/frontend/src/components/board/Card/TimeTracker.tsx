'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Clock, Play, Square, Trash2, Plus } from 'lucide-react';
import { TimeEntry } from '@/types/time_entry';
import { timeEntryService } from '@/services/timeEntry';

interface TimeTrackerProps {
    cardId: string;
}

function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatElapsed(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ cardId }) => {
    const [entries, setEntries] = useState<TimeEntry[]>([]);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Manual log form
    const [description, setDescription] = useState('');
    const [manualMinutes, setManualMinutes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Live timer
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<Date | null>(null);

    // Load entries
    const loadEntries = useCallback(async () => {
        try {
            const data = await timeEntryService.getTimeEntries(cardId);
            setEntries(data.entries);
            setTotalMinutes(data.total_minutes);
        } catch {
            toast.error('Failed to load time entries');
        } finally {
            setIsLoading(false);
        }
    }, [cardId]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    // Timer tick
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setElapsedSeconds((s) => s + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimerRunning]);

    const handleStartTimer = () => {
        startTimeRef.current = new Date();
        setElapsedSeconds(0);
        setIsTimerRunning(true);
    };

    const handleStopTimer = async () => {
        setIsTimerRunning(false);
        const endTime = new Date();
        const startTime = startTimeRef.current;
        if (!startTime) return;

        try {
            const entry = await timeEntryService.createTimeEntry(cardId, {
                description: description || undefined,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
            });
            setEntries((prev) => [entry, ...prev]);
            setTotalMinutes((t) => t + entry.duration_minutes);
            setDescription('');
            setElapsedSeconds(0);
            startTimeRef.current = null;
            toast.success('Time logged!');
        } catch {
            toast.error('Failed to save timer entry');
        }
    };

    const handleManualLog = async () => {
        const mins = parseInt(manualMinutes, 10);
        if (!mins || mins <= 0) {
            toast.error('Enter a valid number of minutes');
            return;
        }
        setIsSubmitting(true);
        try {
            const entry = await timeEntryService.createTimeEntry(cardId, {
                description: description || undefined,
                duration_minutes: mins,
            });
            setEntries((prev) => [entry, ...prev]);
            setTotalMinutes((t) => t + entry.duration_minutes);
            setDescription('');
            setManualMinutes('');
            toast.success('Time logged!');
        } catch {
            toast.error('Failed to log time');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (entryId: string, duration: number) => {
        try {
            await timeEntryService.deleteTimeEntry(cardId, entryId);
            setEntries((prev) => prev.filter((e) => e.id !== entryId));
            setTotalMinutes((t) => Math.max(0, t - duration));
            toast.success('Entry removed');
        } catch {
            toast.error('Failed to delete entry');
        }
    };

    return (
        <div className="p-3 border border-border rounded-lg space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Time Tracking</span>
                </h4>
                {totalMinutes > 0 && (
                    <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-medium">
                        {formatDuration(totalMinutes)} total
                    </span>
                )}
            </div>

            {/* Description input (shared between timer and manual) */}
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on? (optional)"
                className="w-full px-2 py-1.5 text-sm border border-input rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {/* Timer */}
            <div className="flex items-center gap-2">
                {isTimerRunning ? (
                    <>
                        <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                            {formatElapsed(elapsedSeconds)}
                        </span>
                        <button
                            onClick={handleStopTimer}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                            <Square className="w-3 h-3 fill-white" />
                            Stop
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleStartTimer}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                        <Play className="w-3 h-3 fill-white" />
                        Start Timer
                    </button>
                )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 border-t border-border" />
                <span>or log manually</span>
                <div className="flex-1 border-t border-border" />
            </div>

            {/* Manual log */}
            <div className="flex gap-2">
                <input
                    type="number"
                    min={1}
                    value={manualMinutes}
                    onChange={(e) => setManualMinutes(e.target.value)}
                    placeholder="Minutes"
                    className="w-24 px-2 py-1.5 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    onClick={handleManualLog}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Log
                </button>
            </div>

            {/* Entries list */}
            {isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-2">Loading...</p>
            ) : entries.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No time logged yet</p>
            ) : (
                <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {entries.map((entry) => (
                        <li
                            key={entry.id}
                            className="flex items-start justify-between gap-2 text-xs p-2 bg-muted/40 rounded-lg group"
                        >
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold text-foreground">
                                    {formatDuration(entry.duration_minutes)}
                                </span>
                                {entry.description && (
                                    <span className="text-muted-foreground ml-1 truncate block">
                                        {entry.description}
                                    </span>
                                )}
                                <span className="text-muted-foreground/70 block mt-0.5">
                                    {new Date(entry.created_at).toLocaleString()}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDelete(entry.id, entry.duration_minutes)}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                            >
                                <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
