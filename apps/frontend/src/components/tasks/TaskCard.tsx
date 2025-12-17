"use client";

import { Task } from "@/types/task";

export default function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div
      className="p-3 bg-white rounded shadow cursor-pointer border"
      onClick={onClick}
    >
      <p className="font-medium">{task.title}</p>

      <div className="flex justify-between mt-2">
        <span className="text-xs">{task.priority}</span>
        {task.dueDate && (
          <span className="text-xs text-gray-600">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}




