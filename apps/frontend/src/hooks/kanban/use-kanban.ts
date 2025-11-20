// hooks/kanban/use-kanban.ts
'use client';

import { useState, useEffect } from 'react';
import { Task, Column, Board } from '@/lib/types/kanban';

const initialColumns: Column[] = [
  {
    id: 'backlog',
    name: 'Backlog',
    type: 'backlog',
    tasks: []
  },
  {
    id: 'todo',
    name: 'To Do',
    type: 'todo',
    tasks: []
  },
  {
    id: 'inProgress',
    name: 'In Progress',
    type: 'inProgress',
    tasks: []
  },
  {
    id: 'review',
    name: 'Review',
    type: 'review',
    tasks: []
  },
  {
    id: 'done',
    name: 'Done',
    type: 'done',
    tasks: []
  }
];

const mockLabels = [
  { id: '1', name: 'Design', color: '#8B5CF6', type: 'design' },
  { id: '2', name: 'Writing', color: '#10B981', type: 'writing' },
  { id: '3', name: 'Research', color: '#3B82F6', type: 'research' },
  { id: '4', name: 'Documentation', color: '#6B7280', type: 'documentation' },
];

const mockAssignees = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' as const },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' as const },
];

export function useKanban() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('kanban-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setColumns(parsedData.columns || initialColumns);
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Initialize with sample data
        initializeSampleData();
      }
    } else {
      initializeSampleData();
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever columns change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kanban-data', JSON.stringify({ columns }));
    }
  }, [columns, isLoaded]);

  const initializeSampleData = () => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Create project documentation',
        description: 'Write comprehensive documentation for the new project',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        labels: [mockLabels[0], mockLabels[3]],
        assignees: [mockAssignees[0]],
        attachments: 2,
        comments: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Design user interface mockups',
        description: 'Create wireframes and mockups for the main dashboard',
        status: 'inProgress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        labels: [mockLabels[0]],
        assignees: [mockAssignees[1]],
        attachments: 5,
        comments: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Research competitor products',
        description: 'Analyze features and pricing of competitor products',
        status: 'backlog',
        priority: 'low',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        labels: [mockLabels[2]],
        assignees: [],
        attachments: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    const sampleColumns = initialColumns.map(col => ({
      ...col,
      tasks: sampleTasks.filter(task => task.status === col.type)
    }));

    setColumns(sampleColumns);
  };

  const moveTask = (taskId: string, newStatus: Column['type']) => {
    setColumns(prevColumns => {
      return prevColumns.map(column => {
        // Remove task from all columns
        const filteredTasks = column.tasks.filter(task => task.id !== taskId);
        
        // Add task to the target column with updated status
        if (column.type === newStatus) {
          const taskToMove = prevColumns
            .flatMap(col => col.tasks)
            .find(task => task.id === taskId);
          
          if (taskToMove) {
            const updatedTask = {
              ...taskToMove,
              status: newStatus,
              updatedAt: new Date().toISOString()
            };
            return {
              ...column,
              tasks: [...filteredTasks, updatedTask]
            };
          }
        }
        
        return {
          ...column,
          tasks: filteredTasks
        };
      });
    });
  };

  const addTask = (taskData: { title: string }, columnType: Column['type']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: '',
      status: columnType,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      labels: [],
      assignees: [],
      attachments: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.type === columnType
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  };

  const updateTask = (updatedTask: Task) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task =>
          task.id === updatedTask.id 
            ? { ...updatedTask, updatedAt: new Date().toISOString() }
            : task
        )
      }))
    );
  };

  const deleteTask = (taskId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId)
      }))
    );
  };

  const handleDragStart = (task: Task) => {
    setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id;
    const newColumnType = over.id;

    if (newColumnType && ['backlog', 'todo', 'inProgress', 'review', 'done'].includes(newColumnType)) {
      moveTask(taskId, newColumnType as Column['type']);
    }

    setActiveTask(null);
  };

  const addColumn = (name: string, type: Column['type']) => {
    const newColumn: Column = {
      id: type,
      name,
      type,
      tasks: []
    };
    setColumns(prev => [...prev, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
  };

  return {
    columns,
    moveTask,
    addTask,
    updateTask,
    deleteTask,
    addColumn,
    deleteColumn,
    activeTask,
    handleDragStart,
    handleDragEnd,
    isLoaded
  };
}



// import { useState, useMemo } from 'react';
// import { Column, Task } from '@/lib/types/kanban';

// // EXACT DATA FROM YOUR IMAGE
// const sampleTasks: Task[] = [
//   // Backlog tasks
//   {
//     id: '1',
//     title: 'Create styleguide foundation',
//     status: 'backlog',
//     priority: 'high',
//     dueDate: '2021-08-20',
//     labels: [{ id: '1', name: 'Design', color: '#8B5CF6', type: 'design' }],
//     assignees: [{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' }],
//     attachments: 2,
//     comments: 3,
//     createdAt: '2021-08-01',
//     updatedAt: '2021-08-15',
//   },
//   {
//     id: '2',
//     title: 'Copywriting Content',
//     status: 'backlog',
//     priority: 'medium',
//     dueDate: '2021-09-20',
//     labels: [{ id: '2', name: 'Writing', color: '#10B981', type: 'writing' }],
//     assignees: [{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' }],
//     attachments: 1,
//     comments: 1,
//     createdAt: '2021-08-05',
//     updatedAt: '2021-08-18',
//   },

//   // To Do tasks
//   {
//     id: '3',
//     title: 'Updating information architecture',
//     status: 'todo',
//     priority: 'high',
//     dueDate: '2021-08-20',
//     labels: [{ id: '3', name: 'Research', color: '#3B82F6', type: 'research' }],
//     assignees: [{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' }],
//     attachments: 0,
//     comments: 2,
//     createdAt: '2021-08-10',
//     updatedAt: '2021-08-12',
//   },
//   {
//     id: '4',
//     title: 'Update support documentation',
//     status: 'todo',
//     priority: 'medium',
//     dueDate: '2021-08-20',
//     labels: [{ id: '4', name: 'Documentation', color: '#6B7280', type: 'documentation' }],
//     assignees: [{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' }],
//     attachments: 3,
//     comments: 0,
//     createdAt: '2021-08-08',
//     updatedAt: '2021-08-14',
//   },

//   // In Progress tasks
//   {
//     id: '5',
//     title: 'Lifting deliverable checklist',
//     status: 'inProgress',
//     priority: 'high',
//     dueDate: '2021-08-20',
//     labels: [{ id: '5', name: 'Planning', color: '#EC4899', type: 'planning' }],
//     assignees: [{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' }],
//     attachments: 1,
//     comments: 5,
//     createdAt: '2021-08-03',
//     updatedAt: '2021-08-16',
//   },
//   {
//     id: '6',
//     title: 'Qualitative research planning',
//     status: 'inProgress',
//     priority: 'medium',
//     dueDate: '2021-09-20',
//     labels: [{ id: '3', name: 'Research', color: '#3B82F6', type: 'research' }],
//     assignees: [{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' }],
//     attachments: 2,
//     comments: 3,
//     createdAt: '2021-08-07',
//     updatedAt: '2021-08-17',
//   },
//   {
//     id: '7',
//     title: 'Copywriting Content',
//     status: 'inProgress',
//     priority: 'medium',
//     dueDate: '2021-09-20',
//     labels: [{ id: '2', name: 'Writing', color: '#10B981', type: 'writing' }],
//     assignees: [{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' }],
//     attachments: 1,
//     comments: 2,
//     createdAt: '2021-08-09',
//     updatedAt: '2021-08-13',
//   },

//   // Review tasks (first column)
//   {
//     id: '8',
//     title: 'High fidelity UI Desktop',
//     status: 'review',
//     priority: 'high',
//     dueDate: '2021-08-20',
//     labels: [{ id: '1', name: 'Design', color: '#8B5CF6', type: 'design' }],
//     assignees: [{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' }],
//     attachments: 4,
//     comments: 7,
//     createdAt: '2021-08-01',
//     updatedAt: '2021-08-19',
//   },
//   {
//     id: '9',
//     title: 'Linking deliverables checklist',
//     status: 'review',
//     priority: 'medium',
//     dueDate: '2021-08-20',
//     labels: [{ id: '6', name: 'Content', color: '#F59E0B', type: 'content' }],
//     assignees: [{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' }],
//     attachments: 1,
//     comments: 2,
//     createdAt: '2021-08-09',
//     updatedAt: '2021-08-13',
//   },

//   // Review tasks (second column - same as first review)
//   {
//     id: '10',
//     title: 'High fidelity UI Desktop',
//     status: 'review',
//     priority: 'high',
//     dueDate: '2021-08-20',
//     labels: [{ id: '1', name: 'Design', color: '#8B5CF6', type: 'design' }],
//     assignees: [{ id: '1', name: 'John Doe', email: 'john@example.com', avatar: '', role: 'admin' }],
//     attachments: 4,
//     comments: 7,
//     createdAt: '2021-08-01',
//     updatedAt: '2021-08-19',
//   },
//   {
//     id: '11',
//     title: 'Linking deliverables checklist',
//     status: 'review',
//     priority: 'medium',
//     dueDate: '2021-08-20',
//     labels: [{ id: '6', name: 'Content', color: '#F59E0B', type: 'content' }],
//     assignees: [{ id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '', role: 'member' }],
//     attachments: 1,
//     comments: 2,
//     createdAt: '2021-08-09',
//     updatedAt: '2021-08-13',
//   },
// ];

// const columnsData: Column[] = [
//   { id: '1', name: 'Backlog', type: 'backlog', position: 0, tasks: [] },
//   { id: '2', name: 'To Do', type: 'todo', position: 1, tasks: [] },
//   { id: '3', name: 'In Progress', type: 'inProgress', position: 2, tasks: [] },
//   { id: '4', name: 'Review', type: 'review', position: 3, tasks: [] },
//   { id: '5', name: 'Review', type: 'review', position: 4, tasks: [] },
// ];

// export function useKanban() {
//   const [tasks, setTasks] = useState<Task[]>(sampleTasks);
//   const [activeTask, setActiveTask] = useState<Task | null>(null);

//   const columns = useMemo(() => {
//     return columnsData.map(column => ({
//       ...column,
//       tasks: tasks.filter(task => {
//         if (column.type === 'review' && column.position === 4) {
//           return task.status === 'review' && ['10', '11'].includes(task.id);
//         }
//         return task.status === column.type;
//       })
//     }));
//   }, [tasks]);

//   // Move task between columns
//   const moveTask = (taskId: string, newStatus: Column['type']) => {
//     setTasks(prev => prev.map(task =>
//       task.id === taskId ? { ...task, status: newStatus } : task
//     ));
//   };

//   // Drag & Drop functions
//   const handleDragStart = (task: Task) => {
//     setActiveTask(task);
//   };

//   const handleDragEnd = (result: any) => {
//     setActiveTask(null);
    
//     const { active, over } = result;
//     if (!over) return;

//     const taskId = active.id;
//     const newColumnType = over.id as Column['type'];

//     // Don't do anything if dropping in same column
//     const currentTask = tasks.find(t => t.id === taskId);
//     if (currentTask?.status === newColumnType) return;

//     moveTask(taskId, newColumnType);
//   };

//   // Add new task
//   const addTask = (taskData: { title: string }, columnType: Column['type']) => {
//     const newTask: Task = {
//       id: Date.now().toString(),
//       title: taskData.title,
//       description: '',
//       status: columnType,
//       priority: 'medium',
//       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//       labels: [],
//       assignees: [],
//       attachments: 0,
//       comments: 0,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     setTasks(prev => [...prev, newTask]);
//   };

//   // Update existing task
//   const updateTask = (updatedTask: Task) => {
//     setTasks(prev => prev.map(task =>
//       task.id === updatedTask.id 
//         ? { 
//             ...updatedTask, 
//             updatedAt: new Date().toISOString(),
//             // Preserve other properties if not provided
//             description: updatedTask.description || task.description,
//             dueDate: updatedTask.dueDate || task.dueDate,
//             labels: updatedTask.labels || task.labels,
//             assignees: updatedTask.assignees || task.assignees,
//             attachments: updatedTask.attachments ?? task.attachments,
//             comments: updatedTask.comments ?? task.comments,
//           } 
//         : task
//     ));
//   };

//   // Delete task
//   const deleteTask = (taskId: string) => {
//     setTasks(prev => prev.filter(task => task.id !== taskId));
//   };

//   return {
//     columns,
//     tasks,
//     moveTask,
//     addTask,
//     updateTask,
//     deleteTask,
//     // Drag & Drop
//     activeTask,
//     handleDragStart,
//     handleDragEnd,
//   };
// }

