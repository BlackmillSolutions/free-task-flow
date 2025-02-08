import React from 'react';
import { Header, flexRender } from '@tanstack/react-table';
import { Task } from '../../utils/database';
import { FaEllipsisH, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Menu } from '@headlessui/react';

interface TableColumnHeaderProps {
  header: Header<Task, unknown>;
}

export const TableColumnHeader: React.FC<TableColumnHeaderProps> = ({ header }) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 font-medium text-[#323338] select-none h-[42px]"
      style={{ width: header.getSize() }}
      onClick={header.column.getToggleSortingHandler()}
    >
      <span>
        {flexRender(
          header.column.columnDef.header,
          header.getContext()
        )}
      </span>
      <div className="flex items-center space-x-2">
        {header.column.getIsSorted() && (
          <span>
            {header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼'}
          </span>
        )}
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 hover:bg-[#dcdfec] rounded-full">
            <FaEllipsisH className="text-[#676879]" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[60]">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-[#f5f6f8]' : ''
                  } group flex w-full items-center px-4 py-2 text-sm text-[#323338]`}
                  onClick={() => header.column.toggleVisibility()}
                >
                  {header.column.getIsVisible() ? (
                    <>
                      <FaEye className="mr-2" />
                      <span>Hide Column</span>
                    </>
                  ) : (
                    <>
                      <FaEyeSlash className="mr-2" />
                      <span>Show Column</span>
                    </>
                  )}
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};
