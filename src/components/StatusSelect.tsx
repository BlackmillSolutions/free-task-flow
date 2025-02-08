import React from 'react';
import { Task } from '../utils/database';

interface StatusOption {
  value: Task['status'];
  label: string;
  color: string;
}

const statusOptions: StatusOption[] = [
  { value: 'Open', label: 'Open', color: '#e2e8f0' },
  { value: 'In Progress', label: 'In Progress', color: '#60a5fa' },
  { value: 'Done', label: 'Done', color: '#34d399' }
];

interface StatusSelectProps {
  value: Task['status'];
  onChange: (value: Task['status']) => void;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentStatus = statusOptions.find(option => option.value === value) || statusOptions[0];

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 text-sm font-medium rounded-full flex items-center justify-between gap-2 transition-all duration-200 hover:opacity-80"
        style={{
          backgroundColor: currentStatus.color,
          color: currentStatus.color === '#e2e8f0' ? '#1f2937' : 'white'
        }}
      >
        <span>{currentStatus.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusSelect;
