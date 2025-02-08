import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  createColumnHelper,
  flexRender,
  VisibilityState,
  SortingState,
  Row as TableRow,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import {
  FaSort,
  FaPlus,
  FaEllipsisH,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaTrashAlt,
  FaSearch,
} from 'react-icons/fa';
import { Task } from '../utils/database';
import { useTaskStore } from '../store/taskStore';
import NewTaskModal from './NewTaskModal';
import StatusSelect from './StatusSelect';
import PrioritySelect from './PrioritySelect';
import ProgressBar from './ProgressBar';
import ProjectFilter from './ProjectFilter';
import ProjectModal from './ProjectModal';
import ProjectSelect from './ProjectSelect';
import { Menu } from '@headlessui/react';
import { useProjectSelection } from '../hooks/useProjectSelection';

const columnHelper = createColumnHelper<Task>();

const fuzzyFilter = (row: TableRow<Task>, columnId: string, value: string, addMeta: any) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const TableView: React.FC = () => {
  const {
    tasks,
    projects,
    selectedProjects,
    isLoading,
    fetchData,
    addTask,
    updateTask,
    deleteTask,
    addProject,
  } = useTaskStore();

  const [globalFilter, setGlobalFilter] = useState('');
  const [editingCell, setEditingCell] = useState<{ taskId: string; columnId: keyof Task } | null>(null);
  const [editedValue, setEditedValue] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const { defaultProject } = useProjectSelection();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    if (selectedProjects.size === 0) return tasks;
    return tasks.filter(task => selectedProjects.has(task.groupId));
  }, [tasks, selectedProjects]);

  const columns = useMemo(() => [
    columnHelper.accessor((row) => row.title, {
      id: 'title',
      header: 'Title',
      cell: info => <div className="font-medium text-[#323338]">{info.getValue()}</div>,
      size: 200,
    }),
    columnHelper.accessor((row) => row.groupId, {
      id: 'groupId',
      header: 'Project',
      cell: info => (
        <div className="w-[140px]">
          <ProjectSelect
            value={info.getValue()}
            projects={projects}
            onChange={(value) => handleSaveEdit(info.row.original.id, 'groupId', value)}
          />
        </div>
      ),
      size: 140,
    }),
    columnHelper.accessor((row) => row.status, {
      id: 'status',
      header: 'Status',
      cell: info => (
        <div className="w-[140px]">
          <StatusSelect
            value={info.getValue()}
            onChange={(value) => handleSaveEdit(info.row.original.id, 'status', value)}
          />
        </div>
      ),
      size: 160,
    }),
    columnHelper.accessor((row) => row.priority, {
      id: 'priority',
      header: 'Priority',
      cell: info => (
        <div className="w-[140px]">
          <PrioritySelect
            value={info.getValue()}
            onChange={(value) => handleSaveEdit(info.row.original.id, 'priority', value)}
          />
        </div>
      ),
      size: 160,
    }),
    columnHelper.accessor((row) => row.dueDate, {
      id: 'dueDate',
      header: 'Due Date',
      cell: info => (
        <div className="text-[#676879]">
          {info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-'}
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor((row) => row.assignee, {
      id: 'assignee',
      header: 'Assignee',
      cell: info => (
        <div className="text-[#676879]">
          {info.getValue() || '-'}
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor((row) => row.description, {
      id: 'description',
      header: 'Description',
      cell: info => (
        <div className="text-[#676879] line-clamp-2">
          {info.getValue() || '-'}
        </div>
      ),
      size: 200,
    }),
    columnHelper.accessor((row) => row.progress, {
      id: 'progress',
      header: 'Progress',
      cell: info => (
        <div className="w-[140px]">
          <ProgressBar
            value={info.getValue()}
            onChange={(value) => handleSaveEdit(info.row.original.id, 'progress', value)}
          />
        </div>
      ),
      size: 100,
    }),
  ] as ColumnDef<Task>[], [projects]);

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEditCell = (taskId: string, columnId: keyof Task, value: Task[keyof Task]) => {
    if (columnId === 'status' || columnId === 'priority' || columnId === 'progress') {
      handleSaveEdit(taskId, columnId, value);
    } else {
      setEditingCell({ taskId, columnId });
      setEditedValue(String(value));
    }
  };

  const handleSaveEdit = async (taskId: string, columnId: keyof Task, value: Task[keyof Task]) => {
    await updateTask(taskId, { [columnId]: value });
    setEditingCell(null);
    setEditedValue('');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditedValue('');
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0073ea]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Table Controls */}
      <div className="flex items-center justify-between p-4 border-b border-[#e6e9ef] bg-white">
        <div className="flex items-center space-x-4">
          <ProjectFilter />
          <div className="relative">
            <input
              type="text"
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-[#e6e9ef] rounded-lg focus:outline-none focus:border-[#0073ea] w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#676879]" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-4 py-2 bg-[#0073ea] text-white rounded-lg hover:bg-[#0060c2] transition-colors flex items-center"
            disabled={selectedProjects.size > 1}
          >
            <FaPlus className="mr-2" />
            <span>New Task</span>
          </button>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        {/* Table Header */}
        <div className="sticky top-0 z-[1]">
          <div className="flex bg-[#f5f6f8] border-b border-[#e6e9ef]">
            {table.getHeaderGroups().map(headerGroup => (
              <div key={headerGroup.id} className="flex">
                {headerGroup.headers.map(header => (
                  <div
                    key={header.id}
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
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1">
          {table.getRowModel().rows.map(row => (
            <div
              key={row.id}
              className="flex border-b border-[#e6e9ef] hover:bg-[#f5f6f8] relative group"
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
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
                    handleEditCell(
                      row.original.id,
                      cell.column.id as keyof Task,
                      cell.getValue() as Task[keyof Task]
                    );
                  }}
                >
                  {editingCell?.taskId === row.original.id && editingCell?.columnId === cell.column.id ? (
                    <div className="flex items-center w-full">
                      {cell.column.id !== 'status' &&
                        cell.column.id !== 'priority' &&
                        cell.column.id !== 'progress' &&
                        cell.column.id !== 'groupId' && (
                          <div className="flex items-center flex-1">
                            <input
                              type="text"
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:border-[#0073ea]"
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(
                                  row.original.id,
                                  cell.column.id as keyof Task,
                                  editedValue as Task[keyof Task]
                                );
                              }}
                              className="ml-2 p-1 text-[#0073ea] hover:text-[#0060c2]"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="ml-1 p-1 text-[#676879] hover:text-[#323338]"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )}
                </div>
              ))}
              {hoveredRowId === row.id && (
                <button
                  onClick={() => handleDeleteTask(row.original.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#676879] hover:text-[#323338] bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrashAlt size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {isNewTaskModalOpen && (
        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          onSubmit={addTask}
          groupId={defaultProject}
        />
      )}
      {isNewProjectModalOpen && (
        <ProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onSubmit={addProject}
        />
      )}
    </div>
  );
};

export default TableView;
