import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Task } from '../../utils/database';

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  columnId: keyof Task;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  columnId,
}) => {
  // These columns are handled by their own components
  const nonEditableColumns: (keyof Task)[] = ['status', 'priority', 'progress', 'groupId'];

  if (nonEditableColumns.includes(columnId)) {
    return null;
  }

  return (
    <div className="flex items-center flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#0073ea]"
        autoFocus
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave();
        }}
        className="ml-2 p-1 text-[#0073ea] hover:text-[#0060c2]"
      >
        <FaCheck />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
        className="ml-1 p-1 text-[#676879] hover:text-[#323338]"
      >
        <FaTimes />
      </button>
    </div>
  );
};
