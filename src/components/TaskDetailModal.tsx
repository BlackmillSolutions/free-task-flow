import React, { useState } from 'react';
import { Task, Project } from '../utils/database';
import StatusSelect from './StatusSelect';
import PrioritySelect from './PrioritySelect';
import ProgressBar from './ProgressBar';
import ProjectSelect from './ProjectSelect';
import { DueDateCell } from './table/DueDateCell';

interface TaskDetailModalProps {
  task: Task;
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  projects,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleUpdate = (field: keyof Task, value: Task[keyof Task]) => {
    const updates = { [field]: value };
    setEditedTask(prev => ({ ...prev, ...updates }));
    onUpdate(task.id, updates);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <input
            type="text"
            value={editedTask.title}
            onChange={e => handleUpdate('title', e.target.value)}
            className="text-xl font-semibold w-full focus:outline-none focus:border-b-2 focus:border-[#0073ea]"
          />
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedTask.description}
              onChange={e => handleUpdate('description', e.target.value)}
              className="w-full h-32 p-2 border rounded focus:outline-none focus:border-[#0073ea]"
            />
          </div>

          {/* Project and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <ProjectSelect
                value={editedTask.groupId}
                projects={projects}
                onChange={value => handleUpdate('groupId', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <StatusSelect
                value={editedTask.status}
                onChange={value => handleUpdate('status', value)}
              />
            </div>
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <PrioritySelect
                value={editedTask.priority}
                onChange={value => handleUpdate('priority', value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <DueDateCell
                value={editedTask.dueDate}
                onChange={value => handleUpdate('dueDate', value)}
              />
            </div>
          </div>

          {/* Assignee and Progress Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <input
                type="text"
                value={editedTask.assignee}
                onChange={e => handleUpdate('assignee', e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-[#0073ea]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
              <ProgressBar
                value={editedTask.progress}
                onChange={value => handleUpdate('progress', value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
