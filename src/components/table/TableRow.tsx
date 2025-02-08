import React from 'react';
import { Row } from '@tanstack/react-table';
import { Task } from '../../utils/database';
import { FaTrashAlt } from 'react-icons/fa';
import { EditableCell } from './EditableCell';

interface TableRowProps {
  row: Row<Task>;
  editingCell: { taskId: string; columnId: keyof Task } | null;
  editedValue: string;
  onEditCell: (taskId: string, columnId: keyof Task, value: Task[keyof Task]) => void;
  onSaveEdit: (taskId: string, columnId: keyof Task, value: Task[keyof Task]) => void;
  onCancelEdit: () => void;
  onDeleteTask: (taskId: string) => void;
  setEditedValue: (value: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  editingCell,
  editedValue,
  onEditCell,
  onSaveEdit,
  onCancelEdit,
  onDeleteTask,
  setEditedValue,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="flex border-b border-[#e6e9ef] hover:bg-[#f5f6f8] relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {row.getVisibleCells().map(cell => (
        <div
          key={cell.id}
          className="px-4 py-2 text-sm text-[#323338] min-h-[40px] border-r border-[#e6e9ef] last:border-r-0"
          style={{ width: cell.column.getSize() }}
          onClick={() => {
            if (
              cell.column.id === 'groupId' ||
              cell.column.id === 'status' ||
              cell.column.id === 'priority' ||
              cell.column.id === 'progress'
            ) {
              return;
            }
            onEditCell(
              row.original.id,
              cell.column.id as keyof Task,
              cell.getValue() as Task[keyof Task]
            );
          }}
        >
          {editingCell?.taskId === row.original.id && editingCell?.columnId === cell.column.id ? (
            <EditableCell
              value={editedValue}
              onChange={setEditedValue}
              onSave={() => onSaveEdit(
                row.original.id,
                cell.column.id as keyof Task,
                editedValue as Task[keyof Task]
              )}
              onCancel={onCancelEdit}
              columnId={cell.column.id as keyof Task}
            />
          ) : (
            <div className="flex items-center">
              {cell.column.columnDef.cell && 
                typeof cell.column.columnDef.cell === 'function' 
                  ? cell.column.columnDef.cell(cell.getContext())
                  : cell.getValue()
              }
            </div>
          )}
        </div>
      ))}
      {isHovered && (
        <button
          onClick={() => onDeleteTask(row.original.id)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#676879] hover:text-[#323338] bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaTrashAlt size={14} />
        </button>
      )}
    </div>
  );
};
