'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';
import { useBoardStore } from '@/store/boardStore';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const DynamicBreadcrumb = () => {
    const pathname = usePathname();
    const workspaces = useAppStore((state) => state.workspaces);
    const boardStoreBoards = useBoardStore((state) => state.boards);

    // Helper to resolve Workspace ID to Name
    const getWorkspaceName = (id: string) => {
        const ws = workspaces.find((w) => w.id === id);
        return ws ? ws.name : null;
    };

    // Helper to resolve Board ID to Name and its actual Workspace ID
    const getBoardInfo = (id: string) => {
        const b = boardStoreBoards.find((b) => b.id === id);
        if (b) {
            return {
                name: b.title || b.name,
                workspaceId: b.workspace_id
            };
        }
        return null;
    };

    // Parse path: e.g., /workspace/1/board/abc or /boards/abc
    const pathSegments = pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const items: { label: string; href: string; isCurrent: boolean }[] = [];

    // 1. Always start with Home
    items.push({ label: 'Home', href: '/', isCurrent: pathSegments.length === 0 });

    // 2. Handle /workspace/[workspaceId]/board/[boardId] routes
    if (pathSegments[0] === 'workspace' && pathSegments[1]) {
        const urlWorkspaceId = pathSegments[1];

        // 3. If there's a board in the path, get the REAL workspace ID from the board
        if (pathSegments[2] === 'board' && pathSegments[3]) {
            const boardId = pathSegments[3];
            const boardInfo = getBoardInfo(boardId);

            // Use the board's actual workspace_id, not the URL's
            const realWorkspaceId = boardInfo?.workspaceId || urlWorkspaceId;
            const workspaceName = getWorkspaceName(realWorkspaceId);

            items.push({
                label: workspaceName || 'Workspace',
                href: `/workspace/${realWorkspaceId}`, // Use REAL workspace ID
                isCurrent: false,
            });

            items.push({
                label: boardInfo?.name || 'Board',
                href: `/workspace/${realWorkspaceId}/board/${boardId}`,
                isCurrent: true,
            });
        } else {
            // Just /workspace/[id] - no nested board
            const workspaceName = getWorkspaceName(urlWorkspaceId);
            items.push({
                label: workspaceName || 'Workspace',
                href: `/workspace/${urlWorkspaceId}`,
                isCurrent: true,
            });
        }
    }
    // 4. Handle standalone /boards/[boardId] routes
    else if (pathSegments[0] === 'boards' && pathSegments[1]) {
        const boardId = pathSegments[1];
        const boardInfo = getBoardInfo(boardId);

        // If we can resolve the parent workspace, add it
        if (boardInfo?.workspaceId) {
            const workspaceName = getWorkspaceName(boardInfo.workspaceId);
            items.push({
                label: workspaceName || 'Workspace',
                href: `/workspace/${boardInfo.workspaceId}`,
                isCurrent: false,
            });
        }

        items.push({
            label: boardInfo?.name || 'Board',
            href: `/boards/${boardId}`,
            isCurrent: true,
        });
    }

    // Don't render if we only have "Home"
    if (items.length <= 1) return null;

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <React.Fragment key={item.href}>
                        <BreadcrumbItem>
                            {item.isCurrent ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
