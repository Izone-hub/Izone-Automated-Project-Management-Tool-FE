export interface TimeEntry {
    id: string;
    card_id: string;
    user_id?: string | null;
    description?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    duration_minutes: number;
    created_at: string;
}

export interface CreateTimeEntryData {
    description?: string;
    duration_minutes?: number;
    start_time?: string;
    end_time?: string;
}

export interface TimeEntriesListResponse {
    entries: TimeEntry[];
    total_minutes: number;
}
