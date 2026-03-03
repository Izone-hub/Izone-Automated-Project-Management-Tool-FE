import { TimeEntry, CreateTimeEntryData, TimeEntriesListResponse } from '@/types/time_entry';
import { API_BASE_URL, getHeaders } from '@/lib/api/config';

export const timeEntryService = {
    getTimeEntries: async (cardId: string): Promise<TimeEntriesListResponse> => {
        const res = await fetch(`${API_BASE_URL}/cards/${cardId}/time-entries/`, {
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    createTimeEntry: async (cardId: string, data: CreateTimeEntryData): Promise<TimeEntry> => {
        const res = await fetch(`${API_BASE_URL}/cards/${cardId}/time-entries/`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },

    deleteTimeEntry: async (cardId: string, entryId: string): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/cards/${cardId}/time-entries/${entryId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error(await res.text());
    },
};
