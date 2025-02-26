import React, { useState } from 'react';
import { FaExclamationCircle, FaUserCircle, FaEllipsisH, FaPaperclip, FaRegComment } from 'react-icons/fa';

interface TaskCardProps {
  status: string;
  statusColor: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
  title?: string;
  description?: string;
  progress?: number;
  attachments?: number;
  comments?: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  status,
  statusColor,
  priority,
  dueDate,
  assignee,
  title = 'Untitled Task',
  description = 'No description provided',
  progress = 0,
  attachments = 0,
  comments = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const priorityColors = {
    high: 'red-500',
    medium: 'yellow-500',
    low: 'green-500',
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold`}
            style={{ backgroundColor: statusColor, color: 'white' }}
          >
            {status}
          </span>
          {isHovered && (
            <button className="text-gray-400 hover:text-gray-600">
              <FaEllipsisH />
            </button>
          )}
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      </div>

      {/* Card Content */}
      <div className="p-3">
        <div className="flex items-center mb-3">
          <FaExclamationCircle className={`text-${priorityColors[priority]} mr-2`} />
          <span className="text-sm text-gray-600 mr-3">{formatDate(dueDate)}</span>
          <div className="flex items-center">
            <FaUserCircle className="text-gray-400 text-xl" />
            <span className="text-sm text-gray-600 ml-1">{assignee}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Description Toggle */}
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          {showDescription ? 'Hide Description' : 'Show Description'}
        </button>

        {/* Expandable Description */}
        {showDescription && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}

        {/* Card Footer */}
        <div className="flex items-center text-gray-400 text-sm">
          <div className="flex items-center mr-3">
            <FaPaperclip className="mr-1" />
            <span>{attachments}</span>
          </div>
          <div className="flex items-center">
            <FaRegComment className="mr-1" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
