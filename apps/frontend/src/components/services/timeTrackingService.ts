import api from '@/lib/axios';

export interface TimeEntry {
    id: string;
    card_id: string;
    user_id: string;
    start_time: string;
    end_time?: string;
    duration_minutes?: number;
}

export const timeTrackingService = {
    // Start a timer for a card
    async startTimer(cardId: string): Promise<TimeEntry> {
        const { data } = await api.post('/time-entries/', { card_id: cardId });
        return data;
    },

    // Stop a running timer
    async stopTimer(entryId: string): Promise<TimeEntry> {
        const { data } = await api.patch(`/time-entries/${entryId}/stop`);
        return data;
    },

    // Get time entries for a card
    async getCardEntries(cardId: string): Promise<TimeEntry[]> {
        const { data } = await api.get(`/time-entries/card/${cardId}`);
        return data;
    },

    // Get the currently running timer (global for user)
    async getActiveTimer(): Promise<TimeEntry | null> {
        try {
            const { data } = await api.get('/time-entries/active');
            return data;
        } catch (error) {
            return null;
        }
    },

    // Get the currently running timer for a specific card
    async getActiveTimerByCard(cardId: string): Promise<TimeEntry | null> {
        try {
            const { data } = await api.get(`/time-entries/active/card/${cardId}`);
            return data;
        } catch (error) {
            return null;
        }
    }
};
