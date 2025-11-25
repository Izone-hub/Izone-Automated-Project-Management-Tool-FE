import { Board, List, Card, Workspace } from '@/types';

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Web Development',
    description: 'All web development projects and tasks',
    ownerId: 'user-1',
    members: ['user-1', 'user-2', 'user-3'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  // {
  //   id: 'ws-2',
  //   name: 'Marketing',
  //   description: 'Marketing campaigns and content planning',
  //   ownerId: 'user-1',
  //   members: ['user-1', 'user-4'],
  //   createdAt: new Date('2024-02-01'),
  //   updatedAt: new Date('2024-02-10'),
  // },
];

// Start with completely empty arrays
export const mockBoards: Board[] = [];
export const mockLists: List[] = [];
export const mockCards: Card[] = [];


// import { Board, List, Card, Workspace } from '@/types';

// export const mockWorkspaces: Workspace[] = [
//   {
//     id: 'ws-1',
//     name: 'Web Development',
//     description: 'All web development projects and tasks',
//     ownerId: 'user-1',
//     members: ['user-1', 'user-2', 'user-3'],
//     createdAt: new Date('2024-01-15'),
//     updatedAt: new Date('2024-01-20'),
//   },
//   {
//     id: 'ws-2',
//     name: 'Marketing',
//     description: 'Marketing campaigns and content planning',
//     ownerId: 'user-1',
//     members: ['user-1', 'user-4'],
//     createdAt: new Date('2024-02-01'),
//     updatedAt: new Date('2024-02-10'),
//   },
// ];

// export const mockBoards: Board[] = [
//   {
//     id: 'board-1',
//     title: 'Website Redesign',
//     description: 'Complete website redesign project for 2024',
//     workspaceId: 'ws-1',
//     background: 'blue',
//     lists: ['list-1', 'list-2', 'list-3'],
//     createdAt: new Date('2024-01-16'),
//     updatedAt: new Date('2024-02-01'),
//   },
//   {
//     id: 'board-2',
//     title: 'Mobile App Development',
//     description: 'New mobile app development project',
//     workspaceId: 'ws-1',
//     background: 'green',
//     lists: ['list-4', 'list-5', 'list-6'],
//     createdAt: new Date('2024-01-25'),
//     updatedAt: new Date('2024-02-05'),
//   },
// ];

// export const mockLists: List[] = [
//   // Website Redesign Board Lists - EMPTY
//   {
//     id: 'list-1',
//     title: 'To Do',
//     position: 0,
//     boardId: 'board-1',
//     cards: [], // Empty array
//     createdAt: new Date('2024-01-16'),
//   },
//   {
//     id: 'list-2',
//     title: 'In Progress',
//     position: 1,
//     boardId: 'board-1',
//     cards: [], // Empty array
//     createdAt: new Date('2024-01-16'),
//   },
//   {
//     id: 'list-3',
//     title: 'Done',
//     position: 2,
//     boardId: 'board-1',
//     cards: [], // Empty array
//     createdAt: new Date('2024-01-16'),
//   },
//   // Mobile App Development Board Lists - EMPTY
//   {
//     id: 'list-4',
//     title: 'Backlog',
//     position: 0,
//     boardId: 'board-2',
//     cards: [], // Empty array
//     createdAt: new Date('2024-01-25'),
//   },
//   {
//     id: 'list-5',
//     title: 'In Development',
//     position: 1,
//     boardId: 'board-2',
//     cards: [], // Empty array
//     createdAt: new Date('2024-01-25'),
//   },
//   {
//     id: 'list-6',
//     title: 'Testing',
//     position: 2,
//     boardId: 'board-2',
//     cards: [], // Empty array
//     createdAt: new Date('2024-01-25'),
//   },
// ];

// // Remove all mock cards - start with empty arrays
// export const mockCards: Card[] = [];




