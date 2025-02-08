import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { FaPlus, FaEllipsisH, FaTimes } from 'react-icons/fa';

interface Task {
  id: string;
  title: string;
  status: string;
  statusColor: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
  description: string;
  progress: number;
  attachments: number;
  comments: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  limit?: number;
}

interface CardPreviewProps {
  task: Task;
  onClose: () => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({ task, onClose }) => {
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
          <p>Status: <span className="font-medium" style={{color: task.statusColor}}>{task.status}</span></p>
          <p>Priority: {task.priority}</p>
          <p>Due Date: {task.dueDate}</p>
          <p>Assignee: {task.assignee}</p>
          <p>Description: {task.description}</p>
          <p>Progress: {task.progress}%</p>
          <p>Attachments: {task.attachments}</p>
          <p>Comments: {task.comments}</p>
        </div>
      </div>
    </div>
  );
};

const KanbanView: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: '#007bff',
      limit: 5,
      tasks: [
        {
          id: '1',
          title: 'Design New Landing Page',
          status: 'To Do',
          statusColor: '#007bff',
          priority: 'high',
          dueDate: '2024-02-10',
          assignee: 'John Doe',
          description: 'Create a modern and responsive landing page design.',
          progress: 0,
          attachments: 2,
          comments: 3,
        },
      ],
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      color: '#ffc107',
      limit: 3,
      tasks: [
        {
          id: '2',
          title: 'API Integration',
          status: 'In Progress',
          statusColor: '#ffc107',
          priority: 'medium',
          dueDate: '2024-02-15',
          assignee: 'Jane Smith',
          description: 'Integrate payment gateway API.',
          progress: 50,
          attachments: 1,
          comments: 5,
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: '#28a745',
      tasks: [
        {
          id: '3',
          title: 'Bug Fixes',
          status: 'Done',
          statusColor: '#28a745',
          priority: 'low',
          dueDate: '2024-02-08',
          assignee: 'Peter Jones',
          description: 'Fix reported bugs in the mobile app.',
          progress: 100,
          attachments: 0,
          comments: 8,
        },
      ],
    },
  ]);
  const [isWipLimitExceeded, setIsWipLimitExceeded] = useState(false);
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});

  const onDragEnd = (result: DropResult) => {
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

    destTasks.splice(destination.index, 0, {
      ...removed,
      status: destColumn.title,
      statusColor: destColumn.color,
    });

    setColumns(columns.map(col => {
      if (col.id === source.droppableId) return { ...col, tasks: sourceTasks };
      if (col.id === destination.droppableId) return { ...col, tasks: destTasks };
      return col;
    }));
  };

  const handleAddTask = (columnId: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7), // Generate a random ID
      title: 'New Task',
      status: '',
      statusColor: '',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      description: '',
      progress: 0,
      attachments: 0,
      comments: 0,
    };

    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, newTask] };
      }
      return col;
    }));
  };

  const handleColumnWidthChange = (columnId: string, width: number) => {
    setColumnWidths(prev => ({ ...prev, [columnId]: width }));
  };

  const handleMouseEnter = (task: Task) => {
    setPreviewTask(task);
  };

  const handleMouseLeave = () => {
    setPreviewTask(null);
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
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onMouseEnter={() => handleMouseEnter(task)}
                                  onMouseLeave={handleMouseLeave}
                                  className={`transition-transform duration-200 ${
                                    snapshot.isDragging ? 'scale-105 shadow-lg' : ''
                                  }`}
                                >
                                  <TaskCard {...task} />
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
