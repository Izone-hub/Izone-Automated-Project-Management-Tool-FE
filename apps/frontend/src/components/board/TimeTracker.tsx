import React, { useEffect, useState } from 'react';
import { timeTrackingService, TimeEntry } from '@/components/services/timeTrackingService';
import { Button } from '@/components/ui/button';
import { Play, Square, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TimeTrackerProps {
    cardId: string;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ cardId }) => {
    const [loading, setLoading] = useState(false);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // Load initial state
    useEffect(() => {
        const loadActiveTimer = async () => {
            try {
                // Ideally this endpoints filters by task, or we check if the active global timer matches this task
                const entry = await timeTrackingService.getActiveTimer();
                if (entry && entry.card_id === cardId && !entry.end_time) {
                    setActiveEntry(entry);
                    const start = new Date(entry.start_time).getTime();
                    const now = new Date().getTime();
                    setElapsedSeconds(Math.floor((now - start) / 1000));
                }
            } catch (error) {
                console.error("Failed to load active timer", error);
            }
        };
        loadActiveTimer();
    }, [cardId]);

    // Timer Interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeEntry) {
            interval = setInterval(() => {
                setElapsedSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeEntry]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleStart = async () => {
        setLoading(true);
        try {
            const entry = await timeTrackingService.startTimer(cardId);
            setActiveEntry(entry);
            setElapsedSeconds(0);
            toast.success("Timer started");
        } catch (error) {
            toast.error("Failed to start timer");
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        if (!activeEntry) return;
        setLoading(true);
        try {
            await timeTrackingService.stopTimer(activeEntry.id);
            setActiveEntry(null);
            setElapsedSeconds(0);
            toast.success("Timer stopped");
        } catch (error) {
            toast.error("Failed to stop timer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50 my-4">
            <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-xl font-medium tracking-wider">
                    {formatTime(elapsedSeconds)}
                </span>
            </div>

            {activeEntry ? (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleStop}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    <Square className="w-4 h-4 fill-current" />
                    Stop
                </Button>
            ) : (
                <Button
                    variant="default" // or confirm/primary if you have custom variants
                    size="sm"
                    onClick={handleStart}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Start Timer
                </Button>
            )}
        </div>
    );
};
