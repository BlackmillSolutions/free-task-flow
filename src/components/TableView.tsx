import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { FaSort, FaFilter, FaPlus } from 'react-icons/fa';

const TableView: React.FC = () => {
  const tasks = [
    {
      id: 1,
      title: 'Design New Landing Page',
      status: 'In Progress',
      statusColor: '#ffc107',
      priority: 'high',
      dueDate: '2024-02-10',
      assignee: 'John Doe',
      description: 'Create a modern and responsive landing page design with focus on conversion rate.',
      progress: 60,
      attachments: 3,
      comments: 5,
    },
    {
      id: 2,
      title: 'API Integration',
      status: 'Open',
      statusColor: '#007bff',
      priority: 'medium',
      dueDate: '2024-02-15',
      assignee: 'Jane Smith',
      description: 'Integrate payment gateway API and implement webhook handlers.',
      progress: 30,
      attachments: 2,
      comments: 8,
    },
    {
      id: 3,
      title: 'Bug Fixes for Mobile App',
      status: 'Done',
      statusColor: '#28a745',
      priority: 'low',
      dueDate: '2024-02-08',
      assignee: 'Peter Jones',
      description: 'Fix reported bugs in the mobile app related to user authentication.',
      progress: 100,
      attachments: 1,
      comments: 12,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Table Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
            <FaPlus className="mr-2" />
            <span>New Task</span>
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <FaFilter className="mr-2" />
            <span>Filter</span>
          </button>
        </div>
        <div className="flex items-center">
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center">
            <FaSort className="mr-2" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              status={task.status}
              statusColor={task.statusColor}
              priority={task.priority as 'low' | 'high' | 'medium'}
              dueDate={task.dueDate}
              assignee={task.assignee}
              title={task.title}
              description={task.description}
              progress={task.progress}
              attachments={task.attachments}
              comments={task.comments}
            />
          ))}
      </div>
    </div>
  );
};

export default TableView;
