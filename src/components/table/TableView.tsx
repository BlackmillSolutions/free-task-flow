import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import TaskDetailModal from '../TaskDetailModal';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Task } from '../../utils/database';
import { useTaskStore } from '../../store/taskStore';
import NewTaskModal from '../NewTaskModal';
import ProjectModal from '../ProjectModal';
import ConfirmationModal from '../ConfirmationModal';
import { useProjectSelection } from '../../hooks/useProjectSelection';
import { createTableColumns } from './TableColumns';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableColumnHeader } from './TableColumnHeader';

const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: any) => {
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    taskId: string | null;
  }>({ isOpen: false, taskId: null });
  const { defaultProject } = useProjectSelection();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    if (selectedProjects.size === 0) return tasks;
    return tasks.filter(task => selectedProjects.has(task.groupId));
  }, [tasks, selectedProjects]);

  const columns = useMemo(
    () => createTableColumns(projects, handleSaveEdit),
    [projects]
  );

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

  const tableRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (editingCell && tableRef.current && !tableRef.current.contains(event.target as Node)) {
      handleSaveEdit(editingCell.taskId, editingCell.columnId, editedValue as Task[keyof Task]);
    }
  }, [editingCell, editedValue]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleEditCell = (taskId: string, columnId: keyof Task, value: Task[keyof Task]) => {
    const autoSaveColumns = ['status', 'priority', 'progress', 'dueDate'];
    if (autoSaveColumns.includes(columnId)) {
      handleSaveEdit(taskId, columnId, value);
    } else {
      setEditingCell({ taskId, columnId });
      setEditedValue(String(value));
    }
  };

  function handleSaveEdit(taskId: string, columnId: keyof Task, value: Task[keyof Task]) {
    updateTask(taskId, { [columnId]: value });
    setEditingCell(null);
    setEditedValue('');
  }

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditedValue('');
  };

  const handleDeleteTask = async (taskId: string) => {
    setDeleteConfirmation({ isOpen: true, taskId });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.taskId) {
      await deleteTask(deleteConfirmation.taskId);
      setDeleteConfirmation({ isOpen: false, taskId: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0073ea]"></div>
      </div>
    );
  }

  return (
    <div ref={tableRef} className="flex flex-col h-full bg-white relative">
      <TableHeader
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onNewTask={() => setIsNewTaskModalOpen(true)}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        isNewTaskDisabled={selectedProjects.size > 1}
      />

      <div className="flex-1 overflow-auto">
        {/* Table Header */}
        <div className="sticky top-0 z-[1]">
          <div className="flex bg-[#f5f6f8] border-b border-[#e6e9ef]">
            {table.getHeaderGroups().map(headerGroup => (
              <div key={headerGroup.id} className="flex">
                {headerGroup.headers.map(header => (
                  <TableColumnHeader key={header.id} header={header} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1">
          {table.getRowModel().rows.map(row => (
                  <div onClick={() => !editingCell && setSelectedTask(row.original)}>
                    <TableRow
                      key={row.id}
                      row={row}
                      editingCell={editingCell}
                      editedValue={editedValue}
                      onEditCell={handleEditCell}
                      onSaveEdit={handleSaveEdit}
                      onCancelEdit={handleCancelEdit}
                      onDeleteTask={handleDeleteTask}
                      setEditedValue={setEditedValue}
                    />
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
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projects={projects}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onUpdate={(taskId, updates) => {
            updateTask(taskId, updates);
          }}
        />
      )}
      {isNewProjectModalOpen && (
        <ProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onSubmit={addProject}
        />
      )}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, taskId: null })}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default TableView;
