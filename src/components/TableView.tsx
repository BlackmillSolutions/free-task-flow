import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  readDatabase,
  addItem,
  updateItem,
  deleteItem,
  Task,
} from '../utils/database';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  createColumnHelper,
  flexRender,
  VisibilityState,
  SortingState,
} from '@tanstack/react-table';
import {
  FaSort,
  FaFilter,
  FaPlus,
  FaEllipsisH,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaTrashAlt,
  FaLayerGroup
} from 'react-icons/fa';
import Select from 'react-select';
import NewTaskModal from './NewTaskModal';
import StatusSelect from './StatusSelect';
import PrioritySelect from './PrioritySelect';
import ProgressBar from './ProgressBar';

const columnHelper = createColumnHelper<Task>();

interface Project {
  id: string;
  name: string;
  color: string;
}

interface ProjectOption {
  value: string;
  label: string;
  color: string;
}

const TableView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects] = useState<Project[]>([
    { id: 'group1', name: 'Project A', color: '#0073ea' },
    { id: 'group2', name: 'Project B', color: '#00c875' },
    { id: 'group3', name: 'Project C', color: '#fb275d' },
    { id: 'group4', name: 'Project D', color: '#784bd1' },
  ]);
  const [selectedProjects, setSelectedProjects] = useState<ProjectOption[]>(
    projects.map(project => ({
      value: project.id,
      label: project.name,
      color: project.color
    }))
  );
  const [editingCell, setEditingCell] = useState<{ taskId: string; columnId: string } | null>(null);
  const [editedValue, setEditedValue] = useState('');
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const projectOptions = useMemo(() => 
    projects.map(project => ({
      value: project.id,
      label: project.name,
      color: project.color
    }))
  , [projects]);

  const loadTasks = useCallback(async () => {
    const db = await readDatabase();
    setTasks(db.tasks);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    if (selectedProjects.length === 0) return tasks;
    return tasks.filter(task => 
      selectedProjects.some(project => project.value === task.groupId)
    );
  }, [tasks, selectedProjects]);

  const columns = useMemo(() => [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => (
        <div className="font-medium text-[#323338]">{info.getValue()}</div>
      ),
      size: 200,
    }),
    columnHelper.accessor('groupId', {
      header: 'Project',
      cell: info => {
        const project = projects.find(p => p.id === info.getValue());
        return project ? (
          <div 
            className="px-2 py-1 rounded text-white inline-block"
            style={{ backgroundColor: project.color }}
          >
            {project.name}
          </div>
        ) : null;
      },
      size: 140,
    }),
    columnHelper.accessor('status', {
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
    columnHelper.accessor('priority', {
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
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: info => (
        <div className="text-[#676879]">
          {info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-'}
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor('assignee', {
      header: 'Assignee',
      cell: info => (
        <div className="text-[#676879]">
          {info.getValue() || '-'}
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => (
        <div className="text-[#676879] line-clamp-2">
          {info.getValue() || '-'}
        </div>
      ),
      size: 200,
    }),
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: info => (
        <div className="w-[140px]">
          <ProgressBar
            value={info.getValue() as number}
            onChange={(value) => handleSaveEdit(info.row.original.id, 'progress', value)}
          />
        </div>
      ),
      size: 100,
    }),
  ], [projects]);

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleAddTask = async (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: String(Date.now()),
    };
    await addItem('tasks', newTask);
    await loadTasks();
  };

  const openNewTaskModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsNewTaskModalOpen(true);
  };

  const handleEditCell = (taskId: string, columnId: string, value: string | number) => {
    if (columnId === 'status' || columnId === 'priority' || columnId === 'progress') {
      handleSaveEdit(taskId, columnId, value);
    } else {
      setEditingCell({ taskId, columnId });
      setEditedValue(String(value));
    }
  };

  const handleSaveEdit = async (taskId: string, columnId: string, value: string | number) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    if (!updatedTask) return;

    const updatedTaskWithChanges = { ...updatedTask, [columnId]: value };
    await updateItem('tasks', taskId, updatedTaskWithChanges);
    await loadTasks();

    setEditingCell(null);
    setEditedValue('');
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditedValue('');
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteItem('tasks', taskId);
    await loadTasks();
  };

  const toggleColumnVisibility = (columnId: string) => {
    table.getColumn(columnId)?.toggleVisibility();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setIsColumnMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Table Controls */}
      <div className="flex items-center justify-between p-4 border-b border-[#e6e9ef] bg-white">
        <div className="flex items-center space-x-4">
          {/* Project Select */}
          <div className="flex items-center min-w-[300px] bg-[#f5f6f8] rounded-lg px-3 py-1">
            <FaLayerGroup className="text-[#676879] mr-2" />
            <Select
              isMulti
              value={selectedProjects}
              onChange={(selected) => setSelectedProjects(selected as ProjectOption[])}
              options={projectOptions}
              placeholder="Filter by project..."
              className="react-select-container w-full"
              classNamePrefix="react-select"
              isClearable={false}
              isSearchable={true}
              styles={{
                control: (base) => ({
                  ...base,
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'transparent',
                  minHeight: '34px',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? '#dcdfec' : state.isFocused ? '#f5f6f8' : 'white',
                  color: '#323338',
                  ':active': {
                    backgroundColor: '#dcdfec',
                  },
                }),
                multiValue: (base, { data }) => ({
                  ...base,
                  backgroundColor: data.color,
                  color: 'white',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'white',
                  fontSize: '13px',
                  padding: '2px 6px',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'white',
                  ':hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0 8px',
                }),
                input: (base) => ({
                  ...base,
                  margin: '0',
                  padding: '0',
                }),
              }}
            />
          </div>
          <button className="px-4 py-2 text-[#323338] hover:bg-[#dcdfec] rounded-lg transition-colors flex items-center">
            <FaFilter className="mr-2" />
            <span>Filter</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-[#323338] hover:bg-[#dcdfec] rounded-lg transition-colors flex items-center">
            <FaSort className="mr-2" />
            <span>Sort</span>
          </button>
          <button
            onClick={() => {
              if (selectedProjects.length === 1) {
                openNewTaskModal(selectedProjects[0].value);
              }
            }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              selectedProjects.length === 1
                ? 'bg-[#0073ea] text-white hover:bg-[#0060c2]'
                : 'bg-[#dcdfec] text-[#676879] cursor-not-allowed'
            }`}
            disabled={selectedProjects.length !== 1}
          >
            <FaPlus className="mr-2" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        {/* Table Header */}
        <div className="sticky top-0 z-10">
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
                      <button
                        className="p-1 hover:bg-[#dcdfec] rounded-full"
                        title="Column Options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsColumnMenuOpen(true);
                        }}
                      >
                        <FaEllipsisH className="text-[#676879]" />
                      </button>
                      {isColumnMenuOpen && (
                        <div
                          ref={columnMenuRef}
                          className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-[#e6e9ef] py-2 z-20"
                        >
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-[#f5f6f8] flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleColumnVisibility(header.column.id);
                            }}
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
                        </div>
                      )}
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
                    if (cell.column.id !== 'groupId') {
                      handleEditCell(
                        row.original.id,
                        cell.column.id,
                        cell.getValue() as string | number
                      );
                    }
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
                            onClick={() => handleSaveEdit(row.original.id, cell.column.id, editedValue)}
                            className="ml-2 p-1 text-[#0073ea] hover:text-[#0060c2]"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleCancelEdit}
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
              {/* Delete button - only shows on row hover */}
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

      {/* New Task Modal */}
      {selectedProjectId && (
        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => {
            setIsNewTaskModalOpen(false);
            setSelectedProjectId(null);
          }}
          onSubmit={handleAddTask}
          groupId={selectedProjectId}
        />
      )}
    </div>
  );
};

export default TableView;
