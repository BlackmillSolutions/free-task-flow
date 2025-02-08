import React, { useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const nonEditableColumns: (keyof Task)[] = ['status', 'priority', 'progress', 'groupId', 'dueDate'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onSave();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    inputRef.current?.addEventListener('keydown', handleKeyDown);
    return () => {
      inputRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave, onCancel]);

  if (nonEditableColumns.includes(columnId)) {
    return null;
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onSave}
      className="w-full px-2 py-1 text-sm bg-white border rounded focus:outline-none focus:border-[#0073ea] focus:ring-1 focus:ring-[#0073ea]"
      autoFocus
    />
  );
};
