import api from '@/lib/axios';

export interface Ticket {
    id: string;
    title: string;
    description?: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    workspace_id: string;
    requester_id: string;
    created_at: string;
}

export interface TicketCreate {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
}

export const ticketService = {
    async getTickets(workspaceId: string): Promise<Ticket[]> {
        const { data } = await api.get(`/tickets/${workspaceId}`);
        return data;
    },

    async createTicket(workspaceId: string, ticket: TicketCreate): Promise<Ticket> {
        const { data } = await api.post(`/tickets/${workspaceId}`, ticket);
        return data;
    },

    async updateTicket(ticketId: string, updates: Partial<TicketCreate>): Promise<Ticket> {
        const { data } = await api.patch(`/tickets/${ticketId}`, updates);
        return data;
    },

    async deleteTicket(ticketId: string): Promise<void> {
        await api.delete(`/tickets/${ticketId}`);
    }
};
