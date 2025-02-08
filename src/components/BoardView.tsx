import React from 'react';
import { useViewStore } from '../store/viewStore';
import TableView from './table/TableView';
import KanbanView from './KanbanView';
import CalendarView from './CalendarView';
import TimelineView from './TimelineView';
import { FaTable, FaColumns, FaCalendarAlt, FaStream, FaChevronRight } from 'react-icons/fa';

const BoardView: React.FC = () => {
  const currentView = useViewStore((state) => state.currentView);
  const setView = useViewStore((state) => state.setView);

  const viewOptions = [
    { id: 'table', label: 'Table', icon: FaTable },
    { id: 'kanban', label: 'Kanban', icon: FaColumns },
    { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt },
    { id: 'timeline', label: 'Timeline', icon: FaStream },
  ] as const;

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb and View Switcher */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="hover:text-gray-700 cursor-pointer">Projects</span>
          <FaChevronRight className="mx-2" size={12} />
          <span className="hover:text-gray-700 cursor-pointer">Website Redesign</span>
          <FaChevronRight className="mx-2" size={12} />
          <span className="text-gray-900 font-medium">Tasks</span>
        </div>

        {/* View Switcher */}
        <div className="flex space-x-2">
          {viewOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentView === id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="mr-2" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Board View Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'table' && <TableView className="py-4" />}
        {currentView === 'kanban' && <KanbanView />}
        {currentView === 'calendar' && <CalendarView />}
        {currentView === 'timeline' && <TimelineView />}
      </div>
    </div>
  );
};

export default BoardView;
