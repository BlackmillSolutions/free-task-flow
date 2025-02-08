import React from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { Task } from '../../utils/database';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface TableRowProps {
  row: Row<Task>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onSelectTask: (task: Task) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  onDeleteTask,
  onSelectTask,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't open task modal if clicking on an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, input, [role="button"]');
    if (!isInteractive) {
      onSelectTask(row.original);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center border-b border-[#e6e9ef] min-h-[40px] ${
        row.getIsSelected() ? 'bg-[#f0f7ff]' : ''
      } hover:bg-[#f5f6f8] transition-colors duration-150 cursor-pointer`}
    >
      <div className="flex items-center flex-1">
        {row.getVisibleCells().map(cell => (
          <div
            key={cell.id}
            className="px-2 py-1"
            style={{ width: cell.column.getSize() }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ))}
      </div>
      <div className="px-2">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(row.original.id);
          }}
          className="text-gray-400 hover:text-red-500"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};
