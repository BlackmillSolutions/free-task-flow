import React from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import ProjectFilter from '../ProjectFilter';

interface TableHeaderProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onNewTask: () => void;
  onNewProject: () => void;
  isNewTaskDisabled: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  globalFilter,
  onGlobalFilterChange,
  onNewTask,
  onNewProject,
  isNewTaskDisabled,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#e6e9ef] bg-white">
      <div className="flex items-center space-x-4">
        <ProjectFilter />
        <div className="relative">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 border border-[#e6e9ef] rounded-lg focus:outline-none focus:border-[#0073ea] w-64"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#676879]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onNewTask}
          className="px-4 py-2 bg-[#0073ea] text-white rounded-lg hover:bg-[#0060c2] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isNewTaskDisabled}
        >
          <FaPlus className="mr-2" />
          <span>New Task</span>
        </button>
        <button
          onClick={onNewProject}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          <span>New Project</span>
        </button>
      </div>
    </div>
  );
};
