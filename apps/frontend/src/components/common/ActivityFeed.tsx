'use client';

import { useEffect, useState } from 'react';
import { activityService, ActivityLog } from '@/lib/api/activity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from 'lucide-react';

export const ActivityFeed = ({ workspaceId }: { workspaceId: string }) => {
    const [activities, setActivities] = useState<ActivityLog[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await activityService.getActivities(workspaceId);
                setActivities(data);
            } catch (error) {
                console.error("Failed to fetch activity");
            }
        };
        fetchActivity();
        // Poll every minute
        const interval = setInterval(fetchActivity, 60000);
        return () => clearInterval(interval);
    }, [workspaceId]);

    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm h-full">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500" />
                Activity Log
            </h3>
            <ScrollArea className="h-[400px] pr-4">
                {activities.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>No recent activity</p>
                        <p className="text-xs mt-1">Actions like creating tickets or cards will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((log) => (
                            <div key={log.id} className="flex gap-3 text-sm">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={log.user_avatar} />
                                    <AvatarFallback>{log.user_name ? log.user_name[0] : '?'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-gray-900">{log.user_name || 'Unknown'}</span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-0.5">{log.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
