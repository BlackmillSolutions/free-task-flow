import React, { useState, useEffect, useMemo } from "react";
import TaskDetailModal from '../TaskDetailModal';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
  RowSelectionState,
  ColumnResizeMode,
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

interface TableViewProps {
  className?: string;
}

const TableView: React.FC<TableViewProps> = ({ className = '' }) => {
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
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
    () => createTableColumns(projects, updateTask),
    [projects, updateTask]
  );

  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange' as ColumnResizeMode,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
    <div className={`flex flex-col h-full bg-white relative ${className}`}>
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
            <TableRow
              key={row.id}
              row={row}
              onDeleteTask={handleDeleteTask}
              onSelectTask={setSelectedTask}
            />
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
