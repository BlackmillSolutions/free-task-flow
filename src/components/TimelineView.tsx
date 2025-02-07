import React, { useState } from 'react';
import { format, addDays, eachDayOfInterval, isToday } from 'date-fns';
import { FaMinus, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee: string;
  statusColor: string;
}

const TimelineView: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [startDate, setStartDate] = useState(new Date());

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Design New Landing Page',
      startDate: new Date(2024, 1, 10),
      endDate: new Date(2024, 1, 15),
      progress: 60,
      assignee: 'John Doe',
      statusColor: '#ffc107',
    },
    {
      id: '2',
      title: 'API Integration',
      startDate: new Date(2024, 1, 12),
      endDate: new Date(2024, 1, 18),
      progress: 30,
      assignee: 'Jane Smith',
      statusColor: '#007bff',
    },
  ];

  const daysToShow = 14 / zoom;
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysToShow),
  });

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.5, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.5, 0.5));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStartDate((d) => addDays(d, -7))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => setStartDate((d) => addDays(d, 7))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FaArrowRight />
            </button>
          </div>
          <span className="font-medium">
            {format(startDate, 'MMM d')} - {format(addDays(startDate, daysToShow), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={zoom <= 0.5}
          >
            <FaMinus />
          </button>
          <span className="w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={zoom >= 2}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Timeline Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex">
              <div className="w-48 flex-shrink-0 p-4 border-r border-gray-200">
                <span className="font-medium">Tasks</span>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-14 divide-x divide-gray-200">
                  {days.map((day, idx) => (
                    <div
                      key={idx}
                      className={`p-2 text-center ${
                        isToday(day) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                      <div className="text-xs text-gray-500">{format(day, 'd')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="relative">
            {tasks.map((task) => (
              <div key={task.id} className="flex border-b border-gray-200">
                <div className="w-48 flex-shrink-0 p-4 border-r border-gray-200">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.assignee}</div>
                </div>
                <div className="flex-1 relative">
                  <div className="grid grid-cols-14 h-full divide-x divide-gray-200">
                    {days.map((_, idx) => (
                      <div key={idx} className="h-full" />
                    ))}
                  </div>
                  {/* Task Bar */}
                  <div
                    className="absolute top-1/2 h-6 -mt-3 rounded-full"
                    style={{
                      left: '10%',
                      width: '40%',
                      backgroundColor: task.statusColor,
                    }}
                  >
                    <div
                      className="h-full rounded-full bg-opacity-50"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today Marker */}
          {days.some(day => isToday(day)) && (
            <div
              className="absolute top-0 bottom-0 w-px bg-red-500"
              style={{
                left: `${
                  (days.findIndex(day => isToday(day)) / days.length) * 100
                }%`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
