import React from 'react';
import { Header, flexRender } from '@tanstack/react-table';
import { Task } from '../../utils/database';

interface TableColumnHeaderProps {
  header: Header<Task, unknown>;
}

export const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({
  header,
}) => {
  return (
    <div
      className={`relative group ${
        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
      }`}
      onClick={header.column.getToggleSortingHandler()}
      style={{ width: header.getSize() }}
    >
      <div className="px-2 py-2 text-sm font-medium text-[#676879]">
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {header.column.getIsSorted() && (
          <span className="ml-2">
            {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
          </span>
        )}
      </div>
      {header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize group-hover:bg-[#0073ea] ${
            header.column.getIsResizing() ? 'bg-[#0073ea]' : ''
          }`}
        />
      )}
    </div>
  );
};
