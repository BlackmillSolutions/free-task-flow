import React, { useState, useEffect } from 'react';
import { format, parseISO } from "date-fns";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { FaPlus, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { Task } from '../utils/database';
import { useTaskStore } from '../store/taskStore';
import NewTaskModal from './NewTaskModal';
import { useProjectSelection } from '../hooks/useProjectSelection';

interface KanbanColumn {
  id: string;
  title: 'Open' | 'In Progress' | 'Done';
  tasks: Task[];
  color: string;
  limit?: number;
}

const getColumnColor = (status: Task['status']): string => {
  switch (status) {
    case 'Open':
      return '#007bff';
    case 'In Progress':
      return '#ffc107';
    case 'Done':
      return '#28a745';
    default:
      return '#007bff';
  }
};

type TaskWithMetadata = Task & {
  attachments?: number;
  comments?: number;
};

interface CardPreviewProps {
  task: TaskWithMetadata;
  onClose: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({ task, onClose }) => {
  const statusColor = getColumnColor(task.status);
  
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <p>Status: <span className="font-medium" style={{color: statusColor}}>{task.status}</span></p>
          <p>Priority: {task.priority}</p>
          <p>Due Date: {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : '-'}</p>
          <p>Assignee: {task.assignee}</p>
          <p>Description: {task.description}</p>
          <p>Progress: {task.progress}%</p>
          <p>Attachments: {task.attachments || 0}</p>
          <p>Comments: {task.comments || 0}</p>
        </div>
      </div>
    </div>
  );
};

const KanbanView: React.FC = () => {
  const { tasks, selectedProjects, isLoading, fetchData, updateTask, addTask } = useTaskStore();
  const { defaultProject } = useProjectSelection();
  
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isWipLimitExceeded, setIsWipLimitExceeded] = useState(false);
  const [previewTask, setPreviewTask] = useState<TaskWithMetadata | null>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filteredTasks = selectedProjects.size === 0
      ? tasks
      : tasks.filter(task => selectedProjects.has(task.groupId));

    const columnDefinitions: Array<{
      id: string;
      title: Task['status'];
      limit?: number;
    }> = [
      { id: 'open', title: 'Open', limit: 5 },
      { id: 'inProgress', title: 'In Progress', limit: 3 },
      { id: 'done', title: 'Done' },
    ];

    const columns: KanbanColumn[] = columnDefinitions.map(def => ({
      ...def,
      color: getColumnColor(def.title),
      tasks: filteredTasks.filter(task => task.status === def.title),
    }));

    setColumns(columns);
  }, [tasks, selectedProjects]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    setIsWipLimitExceeded(false);

    if (!destination) return;

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find((col) => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);

    if (destColumn.limit && destTasks.length >= destColumn.limit && source.droppableId !== destination.droppableId) {
      setIsWipLimitExceeded(true);
      return;
    }

    destTasks.splice(destination.index, 0, removed);

    // Extract the actual task ID from the draggableId (remove 'task-' prefix)
    const taskId = result.draggableId.replace('task-', '');

    // Update the task's status in the database
    await updateTask(taskId, { status: destColumn.title });
  };

  const handleAddTask = async (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    const newTask: Omit<Task, 'id'> = {
      title: 'New Task',
      status: column.title as 'Open' | 'In Progress' | 'Done',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      description: '',
      progress: 0,
      groupId: defaultProject,
    };

    await addTask(newTask);
  };

  const handleColumnWidthChange = (columnId: string, width: number) => {
    setColumnWidths(prev => ({ ...prev, [columnId]: width }));
  };

  useEffect(() => {
    // Initialize column widths based on content
    const initialWidths: { [key: string]: number } = {};
    columns.forEach(col => {
      const element = document.getElementById(`column-${col.id}`);
      if (element) {
        initialWidths[col.id] = element.offsetWidth;
      }
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col">
                <div 
                  id={`column-${column.id}`}
                  className="flex flex-col bg-gray-100 rounded-lg p-4 transition-all duration-200"
                  style={{
                    width: columnWidths[column.id] || 300,
                    minWidth: 250,
                  }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">{column.title}</h3>
                      <span className="ml-2 text-sm text-gray-500">
                        {column.tasks.length}{column.limit ? `/${column.limit}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isWipLimitExceeded && column.limit && column.tasks.length >= column.limit && (
                        <span className="text-xs text-red-500">WIP Limit Exceeded</span>
                      )}
                      <button 
                        onClick={() => handleAddTask(column.id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Add Task"
                      >
                        <FaPlus className="text-gray-500" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Column Options"
                      >
                        <FaEllipsisH className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Column Content */}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[100px] transition-colors duration-200
                          ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
                        `}
                      >
                        <div className="space-y-3">
                          {column.tasks.map((task, index) => (
                            <Draggable
                              key={`task-${task.id}`}
                              draggableId={`task-${task.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`transition-transform duration-200 ${
                                    snapshot.isDragging ? 'scale-105 shadow-lg' : ''
                                  }`}
                                  onClick={() => setPreviewTask(task)}
                                >
                                  <TaskCard
                                    {...task} 
                                    statusColor={getColumnColor(task.status)}
                                    attachments={0}
                                    comments={0}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
                {/* Column Resizer */}
                <div 
                  className="w-1 h-full absolute right-0 top-0 bg-gray-300 hover:bg-blue-500 cursor-col-resize opacity-0 hover:opacity-100 transition-opacity"
                  style={{ transform: 'translateX(50%)' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startWidth = columnWidths[column.id] || 300;
                    const startX = e.clientX;

                    const handleMouseMove = (e: MouseEvent) => {
                      const newWidth = Math.max(250, startWidth + (e.clientX - startX));
                      handleColumnWidthChange(column.id, newWidth);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
      {previewTask && (
        <CardPreview task={previewTask} onClose={() => setPreviewTask(null)} />
      )}
    </div>
  );
};

export default KanbanView;
