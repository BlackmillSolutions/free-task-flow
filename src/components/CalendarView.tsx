import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type ViewType = 'month' | 'week' | 'day';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');

  const tasks = [
    {
      id: '1',
      title: 'Design New Landing Page',
      date: '2024-02-10',
      status: 'In Progress',
      statusColor: '#ffc107',
    },
    {
      id: '2',
      title: 'API Integration',
      date: '2024-02-15',
      status: 'Open',
      statusColor: '#007bff',
    },
  ];

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    
    const days = eachDayOfInterval({ start: startDate, end: monthEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week days header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, idx) => {
          const dayTasks = tasks.filter(
            (task) => task.date === format(day, 'yyyy-MM-dd')
          );

          return (
            <div
              key={idx}
              className={`min-h-[100px] p-2 border border-gray-200 ${
                format(day, 'MM') !== format(currentDate, 'MM')
                  ? 'bg-gray-50'
                  : 'bg-white'
              }`}
            >
              <div className="text-sm text-gray-500">{format(day, 'd')}</div>
              <div className="space-y-1 mt-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded truncate"
                    style={{ backgroundColor: task.statusColor, color: 'white' }}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-7 gap-2 h-full">
        {days.map((day, idx) => (
          <div key={idx} className="border border-gray-200 p-4">
            <div className="text-sm font-medium mb-2">
              {format(day, 'EEE, MMM d')}
            </div>
            {/* Week view content */}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="text-lg font-medium mb-4">
          {format(currentDate, 'EEEE, MMMM d')}
        </div>
        {/* Day view content */}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate((date) => addDays(date, -1))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => setCurrentDate((date) => addDays(date, 1))}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* View Type Switcher */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['month', 'week', 'day'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                viewType === type
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto">
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>
    </div>
  );
};

export default CalendarView;
