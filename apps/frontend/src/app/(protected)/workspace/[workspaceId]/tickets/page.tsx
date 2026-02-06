'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ticketService, Ticket } from '@/lib/api/tickets';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function TicketsPage() {
    const params = useParams();
    const workspaceId = params.workspaceId as string;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // New Ticket State
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const loadTickets = async () => {
        try {
            const data = await ticketService.getTickets(workspaceId);
            setTickets(data);
        } catch (error) {
            console.error("Failed to load tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workspaceId) loadTickets();
    }, [workspaceId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await ticketService.createTicket(workspaceId, {
                title: newTitle,
                description: newDesc,
            });
            toast.success("Ticket created");
            setNewTitle('');
            setNewDesc('');
            setOpen(false);
            loadTickets();
        } catch (error) {
            toast.error("Failed to create ticket");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete ticket?")) return;
        try {
            await ticketService.deleteTicket(id);
            setTickets(prev => prev.filter(t => t.id !== id));
            toast.success("Ticket deleted");
        } catch (error) {
            toast.error("Failed to delete ticket");
        }
    };

    if (loading) return <div className="p-8">Loading tickets...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Tickets</h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Ticket</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded min-h-[100px]"
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Ticket</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Title</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Priority</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">No tickets found.</td>
                            </tr>
                        ) : (
                            tickets.map(ticket => (
                                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-medium">{ticket.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{ticket.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                                                ticket.status === 'resolved' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}
                                        `}>
                                            {ticket.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-gray-600 capitalize">{ticket.priority}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(ticket.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
