import React from 'react';
import { Task } from '../utils/database';
import { FaFlag } from 'react-icons/fa';

interface PriorityOption {
  value: Task['priority'];
  label: string;
  color: string;
  icon: React.ReactNode;
}

const priorityOptions: PriorityOption[] = [
  { 
    value: 'low', 
    label: 'Low', 
    color: '#94a3b8',
    icon: <FaFlag className="w-3 h-3" />
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    color: '#f59e0b',
    icon: <FaFlag className="w-3 h-3" />
  },
  { 
    value: 'high', 
    label: 'High', 
    color: '#ef4444',
    icon: <FaFlag className="w-3 h-3" />
  }
];

interface PrioritySelectProps {
  value: Task['priority'];
  onChange: (value: Task['priority']) => void;
}

const PrioritySelect: React.FC<PrioritySelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentPriority = priorityOptions.find(option => option.value === value) || priorityOptions[0];

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 text-sm font-medium rounded-full flex items-center justify-between gap-2 transition-all duration-200 hover:bg-gray-50 border border-gray-200"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: currentPriority.color }}>{currentPriority.icon}</span>
          <span className="text-gray-700">{currentPriority.label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <span style={{ color: option.color }}>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrioritySelect;
